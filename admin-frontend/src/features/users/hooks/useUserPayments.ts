import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import type { ApiListResponse, UserPaymentMethod, UserTransaction } from '@/features/users/types'

export const useUserPaymentMethods = (userId: number, offset: number, limit: number) => {
  return useQuery({
    queryKey: ['admin-user-payment-methods', userId, offset, limit],
    queryFn: async () => {
      const res = await axiosInstance.post(ApiEndpoints.AdminUserAllPaymentMethods, { user_id: userId, offset, limit })
      return res.data as ApiListResponse<UserPaymentMethod>
    }
  })
}

export const useUserTransactions = (userId: number, offset: number, limit: number) => {
  return useQuery({
    queryKey: ['admin-user-transactions', userId, offset, limit],
    queryFn: async () => {
      const res = await axiosInstance.post(ApiEndpoints.AdminUserAllTransactions, { user_id: userId, offset, limit })
      return res.data as ApiListResponse<UserTransaction>
    }
  })
}


