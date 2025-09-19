import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export const useCartList = () => {
  return useQuery({
    queryKey: ['cart', 'all'],
    queryFn: async () => {
      const { data } = await axiosClient.get(ApiEndpoints.CartAll)
      return (data as any).data
    },
  })
}

export const useCartDetails = () => {
  return useMutation({
    mutationFn: async (payload: { id: number; limit?: number; offset?: number; order?: { column: 'id' | 'quantity' | 'price' | 'name'; direction: 'asc' | 'desc' } }) => {
      const body = { limit: 10, offset: 0, order: { column: 'id', direction: 'desc' }, ...payload }
      const { data } = await axiosClient.post(ApiEndpoints.CartDetails, body)
      return (data as any).data
    },
  })
}

export const useCartAdd = () => {
  return useMutation({
    mutationFn: async (payload: { product_id: number; quantity: number; id?: number }) => {
      const { data } = await axiosClient.put(ApiEndpoints.CartAdd, payload)
      return (data as any).data
    },
  })
}

export const useCartUpdateQuantity = () => {
  return useMutation({
    mutationFn: async (payload: { id: number; product_id: number; quantity: number }) => {
      const { data } = await axiosClient.put(ApiEndpoints.CartUpdateQuantity, payload)
      return (data as any).data
    },
  })
}

export const useCartRemoveItem = () => {
  return useMutation({
    mutationFn: async (payload: { id: number; product_id: number }) => {
      const { data } = await axiosClient.delete(ApiEndpoints.CartRemoveItem, { data: payload })
      return (data as any).data
    },
  })
}

export const useCartRemove = () => {
  return useMutation({
    mutationFn: async (payload: { id: number }) => {
      const { data } = await axiosClient.delete(ApiEndpoints.CartRemove, { data: payload })
      return (data as any).data
    },
  })
}

export const useCartCheckout = () => {
  return useMutation({
    mutationFn: async (payload: { id: number; address: string; message?: string }) => {
      const { data } = await axiosClient.post(ApiEndpoints.CartCheckout, payload)
      return (data as any).data as { order: any; payment: { client_secret: string | null; status: string | null } | null }
    },
  })
}


