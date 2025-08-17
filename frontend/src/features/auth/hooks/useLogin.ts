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
	data: { id: number; email: string; user: string }
	Authorization?: string
	message?: string
}

export const useLogin = () => {
	const setUser = useAuthStore((s) => s.setUser)
	const setAccessToken = useAuthStore((s) => s.setAccessToken)
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
			const user: AuthUser = { id: String(body.data?.id ?? body.id), email: body.data?.email ?? body.email, name: body.data?.user ?? body.user }
			return { user, token }
		},
		onSuccess: ({ user, token }) => {
			setUser(user)
			if (token) {
				tokenService.setAccessToken(token)
				setAccessToken(token)
			}
		},
	})
}

