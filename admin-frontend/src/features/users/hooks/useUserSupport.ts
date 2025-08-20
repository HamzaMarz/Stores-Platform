import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import type { ApiListResponse, UserSupportTicket } from '@/features/users/types'

export const useUserSupport = (userId: number, status: string | undefined, offset: number, limit: number) => {
  return useQuery({
    queryKey: ['admin-user-support', userId, status, offset, limit],
    queryFn: async () => {
      const body: any = { user_id: userId, offset, limit }
      if (status) body.status = status
      const res = await axiosInstance.post(ApiEndpoints.AdminUserAllSupport, body)
      return res.data as ApiListResponse<UserSupportTicket>
    }
  })
}


