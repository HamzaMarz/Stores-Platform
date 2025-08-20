import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import { useToastStore } from '@/hooks/useToastStore'

export const useRestrictUser = () => {
  const qc = useQueryClient()
  const show = useToastStore((s) => s.show)
  return useMutation({
    mutationFn: async (args: { user_id: number; restricted: boolean }) => {
      const res = await axiosInstance.put(ApiEndpoints.AdminUserRestrict, args)
      return res.data
    },
    onSuccess: () => {
      show('User restriction updated', 'success')
      qc.invalidateQueries({ queryKey: ['admin-user-details'] })
    }
  })
}

export const useResetUserPassword = () => {
  const show = useToastStore((s) => s.show)
  return useMutation({
    mutationFn: async (userId: number) => {
      const res = await axiosInstance.put(ApiEndpoints.AdminUserResetPassword, { user_id: userId })
      return res.data
    },
    onSuccess: () => {
      show('Temporary password emailed to user', 'success')
    }
  })
}


