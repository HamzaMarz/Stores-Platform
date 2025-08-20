import { useState } from 'react'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import type { ApiListResponse, OrderSummary } from '@/features/orders/types'

export const useSearchOrders = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiListResponse<OrderSummary> | null>(null)

  const search = async (userId: number, status: string | undefined, offset: number, limit: number) => {
    setLoading(true)
    try {
      const body: any = { user_id: userId, offset, limit }
      if (status) body.status = status
      const res = await axiosInstance.post(ApiEndpoints.AdminOrderSearch, body)
      setResult(res.data as ApiListResponse<OrderSummary>)
    } finally {
      setLoading(false)
    }
  }

  return { loading, result, search }
}


