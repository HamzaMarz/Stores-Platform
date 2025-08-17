import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export type CheckOtpPayload = { email: string; otp: string }
type BackendOk = { statusCode: number; message?: string }

export const useCheckOtp = () => {
    return useMutation({
        mutationKey: ['auth', 'check-otp'],
        mutationFn: async (payload: CheckOtpPayload) => {
            const res = await axiosClient.post<BackendOk>(ApiEndpoints.CheckOtp, payload)
            return res.data
        },
    })
}


