import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import type { ApiListResponse, UpgradeOperation } from '@/features/users/types'
import { useToastStore } from '@/hooks/useToastStore'

export const useUpgradeOps = (offset: number, limit: number) => {
  return useQuery({
    queryKey: ['admin-upgrade-ops', offset, limit],
    queryFn: async () => {
      const res = await axiosInstance.post(ApiEndpoints.AdminUserAllUpgrade, { offset, limit })
      return res.data as ApiListResponse<UpgradeOperation>
    }
  })
}

export const useApproveUpgrade = () => {
  const qc = useQueryClient()
  const show = useToastStore((s) => s.show)
  return useMutation({
    mutationFn: async (operation_id: number) => {
      const res = await axiosInstance.put(ApiEndpoints.AdminUserUpgrade, { operation_id })
      return res.data
    },
    onSuccess: () => {
      show('Upgrade approved', 'success')
      qc.invalidateQueries({ queryKey: ['admin-upgrade-ops'] })
    }
  })
}

export const useRejectUpgrade = () => {
  const qc = useQueryClient()
  const show = useToastStore((s) => s.show)
  return useMutation({
    mutationFn: async (operation_id: number) => {
      const res = await axiosInstance.put(ApiEndpoints.AdminUserRejectUpgrade, { operation_id })
      return res.data
    },
    onSuccess: () => {
      show('Upgrade rejected', 'success')
      qc.invalidateQueries({ queryKey: ['admin-upgrade-ops'] })
    }
  })
}


