import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import type { ApiResponse } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import { useAuthStore } from '../state/useAuthStore'
import { tokenService } from '../../../lib/authToken'

type LogoutResponse = { ok: true }

export const useLogout = () => {
	const setUser = useAuthStore((s) => s.setUser)
	const setAccessToken = useAuthStore((s) => s.setAccessToken)
	return useMutation({
		mutationKey: ['auth', 'logout'],
		mutationFn: async () => {
			const { data } = await axiosClient.get<ApiResponse<LogoutResponse>>(ApiEndpoints.Logout as string)
			if ((data as any).success === false) throw new Error((data as any).error)
			return { ok: true }
		},
		onSuccess: () => {
			setUser(null)
			setAccessToken(null)
			tokenService.clear()
		},
	})
}

