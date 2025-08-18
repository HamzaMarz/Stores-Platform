import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import type { PaymentMethodSummary } from '../types'

const pickData = <T,>(payload: unknown): T => {
  if (!payload || typeof payload !== 'object') return payload as T
  const anyData: any = payload
  if (anyData.success === true && 'data' in anyData) return anyData.data as T
  if ('statusCode' in anyData && 'data' in anyData) return anyData.data as T
  return anyData as T
}

export const useEnsureCustomer = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosClient.post(ApiEndpoints.PaymentMethodsEnsure, {})
      return pickData<{ ok: true }>(data)
    },
  })
}

export const useStartAddCardNormal = () => {
  return useMutation({
    mutationFn: async (): Promise<{ client_secret: string }> => {
      const { data } = await axiosClient.post(ApiEndpoints.PaymentMethodsAdd, {})
      return pickData<{ client_secret: string }>(data)
    },
  })
}

export const useSaveCardNormal = () => {
  return useMutation({
    mutationFn: async (payment_method_id: string): Promise<{ ok: true } | { id: string }> => {
      const { data } = await axiosClient.post(ApiEndpoints.PaymentMethodsSave, { payment_method_id })
      return pickData<any>(data)
    },
  })
}

export const useListCards = () => {
  return useQuery({
    queryKey: ['payment-methods', 'list'],
    queryFn: async (): Promise<{ methods: PaymentMethodSummary[] }> => {
      const { data } = await axiosClient.get(ApiEndpoints.PaymentMethodsList)
      const payload = pickData<any>(data)
      const arr: any[] = Array.isArray(payload) ? payload : payload?.methods || []
      const methods: PaymentMethodSummary[] = arr.map((m) => ({
        id: String(m.id ?? m.payment_method_id ?? ''),
        brand: m.brand,
        last4: m.last4,
        exp_month: typeof m.exp_month === 'string' ? parseInt(m.exp_month, 10) : m.exp_month,
        exp_year: typeof m.exp_year === 'string' ? parseInt(m.exp_year, 10) : m.exp_year,
      }))
      return { methods }
    },
  })
}

export const useDeleteCard = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosClient.delete(ApiEndpoints.PaymentMethodsDelete, { params: { id } })
      return pickData<{ ok: true }>(data)
    },
  })
}


