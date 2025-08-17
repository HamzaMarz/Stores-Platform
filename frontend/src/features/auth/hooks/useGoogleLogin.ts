import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import { useAuthStore } from '../state/useAuthStore'
import { tokenService } from '../../../lib/authToken'

type GooglePayload = { id_token: string }

type GoogleBackendResponse = {
	statusCode: number
	data: { id: number; email: string; user: string }
	Authorization?: string
}

export const useGoogleLogin = () => {
	const setUser = useAuthStore((s) => s.setUser)
	const setAccessToken = useAuthStore((s) => s.setAccessToken)
	return useMutation({
		mutationKey: ['auth', 'google-login'],
		mutationFn: async (payload: GooglePayload) => {
			// Send only id_token per requirement
			const response = await axiosClient.post<GoogleBackendResponse>(ApiEndpoints.UserGoogleLogin, payload)
			const token = response.data.Authorization || (response.headers?.['authorization'] as string | undefined) || ''
			return { user: { id: String(response.data.data.id), email: response.data.data.email, name: response.data.data.user }, token }
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

