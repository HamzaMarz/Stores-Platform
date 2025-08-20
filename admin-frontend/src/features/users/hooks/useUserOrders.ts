import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import type { ApiListResponse, UserOrder } from '@/features/users/types'

export const useUserOrders = (userId: number, status: string | undefined, offset: number, limit: number) => {
  return useQuery({
    queryKey: ['admin-user-orders', userId, status, offset, limit],
    queryFn: async () => {
      const body: any = { user_id: userId, offset, limit }
      if (status) body.status = status
      const res = await axiosInstance.post(ApiEndpoints.AdminUserAllOrders, body)
      return res.data as ApiListResponse<UserOrder>
    }
  })
}


