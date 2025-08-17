import { useState, useMemo } from 'react'
import { useGoogleIdToken } from './useGoogleIdToken'
import { useGoogleLogin } from './useGoogleLogin'

export type GoogleAuthFlow = {
	isLoading: boolean
	startFlow: () => Promise<void>
}

export const useGoogleAuthFlow = (): GoogleAuthFlow => {
	const { isPending, start } = useGoogleIdToken()
	const googleLogin = useGoogleLogin()
	const [clicked, setClicked] = useState(false)

	const isLoading = useMemo(() => isPending || googleLogin.isPending || clicked, [isPending, googleLogin.isPending, clicked])

	const startFlow = async () => {
		try {
			setClicked(true)
			const idToken = await start()
			await googleLogin.mutateAsync({ id_token: idToken })
		} finally {
			setClicked(false)
		}
	}

	return { isLoading, startFlow }
}


