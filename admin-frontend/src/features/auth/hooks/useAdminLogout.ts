import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import { useToastStore } from '@/hooks/useToastStore'

type Options = { onSuccess?: () => void }

export const useAdminLogout = (opts?: Options) => {
  const qc = useQueryClient()
  const show = useToastStore((s) => s.show)
  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.get(ApiEndpoints.AdminLogout)
      return res.data as { success?: boolean }
    },
    onSuccess: () => {
      qc.clear()
      show('Logged out', 'success')
      opts?.onSuccess?.()
    }
  })
}


