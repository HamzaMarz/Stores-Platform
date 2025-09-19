import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import type { ApiResponse } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import { useAuthStore } from '../state/useAuthStore'
import type { AuthUser } from '../state/useAuthStore'
import { tokenService } from '../../../lib/authToken'

export type LoginPayload = {
	email: string
	password: string
}

type BackendLoginResponse = {
	statusCode: number
	data: { id: number; email: string; type?: 'customer' | 'merchant' | 'store'; user?: string; verified?: boolean }
	Authorization?: string
	message?: string
}

export const useLogin = () => {
	const setUser = useAuthStore((s) => s.setUser)
	const setAccessToken = useAuthStore((s) => s.setAccessToken)
	const setBootstrapped = useAuthStore((s) => s.setBootstrapped)
	return useMutation({
		mutationKey: ['auth', 'login'],
		mutationFn: async (payload: LoginPayload) => {
			const response = await axiosClient.post<BackendLoginResponse | ApiResponse<BackendLoginResponse>>(ApiEndpoints.Login, payload)
			const tokenFromHeader = response.headers?.['authorization'] as string | undefined
			let body = response.data as any
			if ('success' in body) {
				if (!body.success) throw new Error(body.error)
				body = body.data
			}
			const token = body.Authorization || tokenFromHeader || ''
			const raw = body.data ?? body
			const type = (raw.type ?? raw.user) as AuthUser['type']
			const user: AuthUser = {
				id: String(raw.id),
				email: raw.email,
				name: raw.user || raw.email,
				type,
				verified: raw.verified ?? false,
			}
			return { user, token }
		},
		onSuccess: async ({ user, token }) => {
			// Persist token first
			if (token) {
				tokenService.setAccessToken(token)
				setAccessToken(token)
			}
			// Optimistically set minimal user, then hydrate from /me for verified/type
			setUser(user)
			try {
				const res = await axiosClient.get(ApiEndpoints.Me)
				const me: any = (res.data as any)?.data ?? res.data
				if (me) {
					setUser({
						id: String(me.id ?? user.id),
						email: me.email ?? user.email,
						name: me.user ?? me.name ?? user.name,
						type: (me.type ?? me.user_type ?? user.type) as AuthUser['type'],
						verified: Boolean(me.verified ?? me.is_verified ?? user.verified),
					})
				}
			} finally {
				setBootstrapped(true)
			}
		},
	})
}

