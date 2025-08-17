import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export type ForgotPasswordPayload = { email: string }
type BackendOk = { statusCode: number; message?: string }

export const useForgotPasswordRequest = () => {
    return useMutation({
        mutationKey: ['auth', 'forgot-password'],
        mutationFn: async (payload: ForgotPasswordPayload) => {
            const res = await axiosClient.post<BackendOk>(ApiEndpoints.ForgotPassword, payload)
            return res.data
        },
    })
}


