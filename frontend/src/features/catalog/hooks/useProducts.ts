import { useQuery } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import type { ApiResponse } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export type Product = {
	id: string
	name: string
	price: number
	imageUrl: string
}

type ProductsResponse = {
	items: Product[]
}

export const useProducts = () => {
	return useQuery({
		queryKey: ['catalog', 'products'],
		queryFn: async () => {
			const { data } = await axiosClient.get<ApiResponse<ProductsResponse>>(ApiEndpoints.Products)
			if (data.success) return data.data.items
			throw new Error(data.error)
		},
	})
}

