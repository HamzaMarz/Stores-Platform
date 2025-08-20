import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import { useToastStore } from '@/hooks/useToastStore'

export const useRejectRefund = () => {
  const qc = useQueryClient()
  const show = useToastStore((s) => s.show)
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.put(ApiEndpoints.AdminOrderRejectRefund, { id })
      return res.data as { success?: boolean }
    },
    onSuccess: () => {
      show('Refund rejected', 'success')
      qc.invalidateQueries({ queryKey: ['admin-orders-pending'] })
    }
  })
}


