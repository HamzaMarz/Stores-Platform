import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export type ForgotPasswordPayload = { email: string }
export type ForgotPasswordResponse = { statusCode: number; message?: string; created_at?: string }

const pickData = <T,>(payload: unknown): T => {
    if (!payload || typeof payload !== 'object') return payload as T
    const anyData: any = payload
    if (anyData.success === true && 'data' in anyData) return anyData.data as T
    if ('statusCode' in anyData && 'data' in anyData) return anyData.data as T
    return anyData as T
}

export const useForgotPasswordRequest = () => {
    return useMutation({
        mutationKey: ['auth', 'forgot-password'],
        mutationFn: async (payload: ForgotPasswordPayload) => {
            const { data } = await axiosClient.post<ForgotPasswordResponse>(ApiEndpoints.ForgotPassword, payload)
            return pickData<ForgotPasswordResponse>(data)
        },
    })
}


