import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import type { ApiResponse } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import { useAuthStore } from '../state/useAuthStore'
import type { AuthUser } from '../state/useAuthStore'
import { tokenService } from '../../../lib/authToken'

export type RegisterPayload = {
	name: string
	email: string
	password: string
}

type BackendRegisterResponse = {
	statusCode: number
	data: { id: number; email: string; user: string; type?: 'customer' | 'merchant' | 'store'; verified?: boolean }
	Authorization?: string
	message?: string
}

export const useRegister = () => {
	const setUser = useAuthStore((s) => s.setUser)
	const setAccessToken = useAuthStore((s) => s.setAccessToken)
	const setBootstrapped = useAuthStore((s) => s.setBootstrapped)
	return useMutation({
		mutationKey: ['auth', 'register'],
		mutationFn: async (payload: RegisterPayload) => {
			// Handle backend returning token either in JSON or header
			const response = await axiosClient.post<BackendRegisterResponse | ApiResponse<BackendRegisterResponse>>(ApiEndpoints.Register, payload)
			const tokenFromHeader = response.headers?.['authorization'] as string | undefined
			let body = response.data as any
			if ('success' in body) {
				if (!body.success) throw new Error(body.error)
				body = body.data
			}
			const token = body.Authorization || tokenFromHeader || ''
			const raw = body.data ?? body
			const type = (raw.type ?? 'customer') as AuthUser['type']
			const user: AuthUser = { 
				id: String(raw.id), 
				email: raw.email, 
				name: raw.user || raw.email,
				type,
				verified: raw.verified ?? false,
			}
			return { user, token }
		},
		onSuccess: ({ user, token }) => {
			setUser(user)
			if (token) {
				tokenService.setAccessToken(token)
				setAccessToken(token)
			}
			setBootstrapped(true)
		},
	})
}

