import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export type CheckOtpPayload = { email: string; otp: string }
type BackendResponse = { statusCode: number; message?: string }

const pickData = <T,>(payload: unknown): T => {
    if (!payload || typeof payload !== 'object') return payload as T
    const anyData: any = payload
    if (anyData.success === true && 'data' in anyData) return anyData.data as T
    if ('statusCode' in anyData && 'data' in anyData) return anyData.data as T
    return anyData as T
}

export const useCheckOtp = () => {
    return useMutation({
        mutationKey: ['auth', 'check-otp'],
        mutationFn: async (payload: CheckOtpPayload) => {
            const { data } = await axiosClient.post<BackendResponse>(ApiEndpoints.CheckOtp, payload)
            return pickData<BackendResponse>(data)
        },
    })
}


