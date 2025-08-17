import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export type ForgotPasswordPayload = { email: string }
export type ForgotPasswordResponse = { statusCode: number; message?: string; created_at?: string } | any

export const useForgotPasswordRequest = () => {
    return useMutation({
        mutationKey: ['auth', 'forgot-password'],
        mutationFn: async (payload: ForgotPasswordPayload) => {
            const res = await axiosClient.post<ForgotPasswordResponse>(ApiEndpoints.ForgotPassword, payload)
            return res.data
        },
    })
}


