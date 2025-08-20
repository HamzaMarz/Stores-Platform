import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import type { ApiListResponse, OrderSummary } from '@/features/orders/types'

export const usePendingOrders = (offset: number, limit: number) => {
  return useQuery({
    queryKey: ['admin-orders-pending', offset, limit],
    queryFn: async () => {
      const res = await axiosInstance.post(ApiEndpoints.AdminOrderAllPending, { offset, limit })
      return res.data as ApiListResponse<OrderSummary>
    }
  })
}


