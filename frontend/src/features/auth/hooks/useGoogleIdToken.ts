import { useCallback, useRef, useState } from 'react'
import { GOOGLE_CLIENT_ID } from '../../../constants/thirdParty'

export type UseGoogleIdTokenResult = {
	isPending: boolean
	start: () => Promise<string>
}

const loadScript = (src: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (document.querySelector(`script[src="${src}"]`)) return resolve()
		const s = document.createElement('script')
		s.src = src
		s.async = true
		s.onload = () => resolve()
		s.onerror = () => reject(new Error('Failed to load Google script'))
		document.head.appendChild(s)
	})
}

export const useGoogleIdToken = (): UseGoogleIdTokenResult => {
	const [isPending, setIsPending] = useState(false)
	const finishedRef = useRef(false)

	const start = useCallback(async (): Promise<string> => {
		if (!GOOGLE_CLIENT_ID) throw new Error('Google client ID not configured')
		finishedRef.current = false
		setIsPending(true)
		await loadScript('https://accounts.google.com/gsi/client')

		return new Promise<string>((resolve, reject) => {
			try {
				// @ts-expect-error google global
				google.accounts.id.initialize({
					client_id: GOOGLE_CLIENT_ID,
					auto_select: false,
					ux_mode: 'popup',
					context: 'signin',
					use_fedcm_for_prompt: true,
					itp_support: true,
					cancel_on_tap_outside: true,
					callback: (response: any) => {
						if (finishedRef.current) return
						finishedRef.current = true
						setIsPending(false)
						const idToken = response?.credential as string | undefined
						if (idToken) resolve(idToken)
						else reject(new Error('Google sign-in failed'))
					},
				})
				// Render a real GIS button offscreen and programmatically click it to guarantee a user-initiated popup
				let container = document.getElementById('gis-hidden-container') as HTMLDivElement | null
				if (!container) {
					container = document.createElement('div')
					container.id = 'gis-hidden-container'
					container.style.position = 'fixed'
					container.style.left = '-9999px'
					container.style.top = '0'
					document.body.appendChild(container)
				}
				container.innerHTML = ''
				// @ts-expect-error google global
				google.accounts.id.renderButton(container, { theme: 'outline', size: 'large', type: 'standard' })
				const btn = container.querySelector('[role="button"]') as HTMLElement | null
				btn?.click()

				// No timeout rejection to avoid noisy console errors; user can try again if blocked
			} catch (e) {
				finishedRef.current = true
				setIsPending(false)
				reject(e as Error)
			}
		})
	}, [])

	return { isPending, start }
}


