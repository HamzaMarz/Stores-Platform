import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import type { SellerOrder } from '../types'

type ListOrdersRequest = { offset: number; limit: number }

export const useListSellerOrders = (params: ListOrdersRequest) => {
	return useQuery({
		queryKey: ['seller-orders', params],
		queryFn: async () => {
			const { data } = await axiosClient.post(ApiEndpoints.SellerOrderAll, params)
			return data as { statusCode: number; data: SellerOrder[]; count: number; message: string }
		},
		select: (res) => ({ items: res.data, count: res.count }),
	})
}

export const useGetSellerOrder = (id?: number) => {
	return useQuery({
		enabled: Boolean(id),
		queryKey: ['seller-order', id],
		queryFn: async () => {
			const { data } = await axiosClient.post(ApiEndpoints.SellerOrderDetails, { id })
			return data as { statusCode: number; data: SellerOrder; message: string }
		},
		select: (res) => res.data,
	})
}

export const useUpdateOrderStatus = () => {
	return useMutation({
		mutationFn: async (payload: { id: number; status: 'PROCESSING' | 'SHIPPED' }) => {
			const { data } = await axiosClient.put(ApiEndpoints.SellerOrderUpdate, payload)
			return data as { statusCode: number; message: string }
		},
	})
}


