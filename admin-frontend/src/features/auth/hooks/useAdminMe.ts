import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import type { ApiResponse, AdminMe } from '@/features/auth/types'

export const useAdminMe = () => {
  return useQuery({
    queryKey: ['admin-me'],
    queryFn: async () => {
      const res = await axiosInstance.get(ApiEndpoints.AdminMe)
      const data = res.data as any
      if (typeof data?.success === 'boolean') {
        return data as ApiResponse<AdminMe>
      }
      return { success: true, data } as ApiResponse<AdminMe>
    }
  })
}


