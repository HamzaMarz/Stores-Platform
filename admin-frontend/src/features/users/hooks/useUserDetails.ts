import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import type { ApiResponse } from '@/features/users/types'
import type { UserDetails } from '@/features/users/types'

export const useUserDetails = (userId: number) => {
  return useQuery({
    queryKey: ['admin-user-details', userId],
    queryFn: async () => {
      const res = await axiosInstance.post(ApiEndpoints.AdminUserDetails, { user_id: userId })
      const raw = res.data as any
      if (typeof raw?.success === 'boolean') {
        return raw as ApiResponse<UserDetails>
      }
      const u = raw?.data?.user ?? {}
      const normalized: UserDetails = {
        user: {
          id: u.id,
          email: u.email,
          username: u.username,
          type: u.type,
          restricted: u.restricted,
        },
        counts: {
          sessions: raw?.data?.sessions_count ?? 0,
          payment_methods: raw?.data?.payment_methods_count ?? 0,
          open_tickets: raw?.data?.open_support_count ?? 0,
          ratings: raw?.data?.ratings_count ?? 0,
          orders: raw?.data?.orders_count ?? 0,
          total_paid: raw?.data?.total_paid ?? 0,
        }
      }
      return { success: true, data: normalized } as ApiResponse<UserDetails>
    }
  })
}


