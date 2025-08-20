import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import type { ApiListResponse, UserRating } from '@/features/users/types'
import { useToastStore } from '@/hooks/useToastStore'

export const useUserRatings = (userId: number, offset: number, limit: number) => {
  return useQuery({
    queryKey: ['admin-user-ratings', userId, offset, limit],
    queryFn: async () => {
      const res = await axiosInstance.post(ApiEndpoints.AdminUserAllRatings, { user_id: userId, offset, limit })
      return res.data as ApiListResponse<UserRating>
    }
  })
}

export const useDeleteRating = () => {
  const qc = useQueryClient()
  const show = useToastStore((s) => s.show)
  return useMutation({
    mutationFn: async (ratingId: number) => {
      const res = await axiosInstance.put(ApiEndpoints.AdminUserDeleteRating, { rating_id: ratingId })
      return res.data
    },
    onSuccess: () => {
      show('Rating deleted', 'success')
      qc.invalidateQueries({ queryKey: ['admin-user-ratings'] })
    }
  })
}


