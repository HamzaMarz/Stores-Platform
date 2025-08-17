import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export type UpdatePasswordPayload = { email: string; otp: string; password: string }
type BackendOk = { statusCode: number; message?: string }

export const useUpdatePassword = () => {
    return useMutation({
        mutationKey: ['auth', 'update-password'],
        mutationFn: async (payload: UpdatePasswordPayload) => {
            const res = await axiosClient.post<BackendOk>(ApiEndpoints.UpdatePassword, payload)
            return res.data
        },
    })
}


