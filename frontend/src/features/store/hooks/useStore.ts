import { useQuery } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import type { StoreDetails, StoreProductsParams, StoreProductsResponse } from '../types'

// Get Store Details Hook
export const useGetStoreDetails = (storeId: number) => {
    return useQuery({
        queryKey: ['store-details', storeId],
        queryFn: async (): Promise<StoreDetails> => {
            const response = await axiosClient.get(ApiEndpoints.StoreDetails, {
                params: { id: storeId }
            })
            return response.data.data
        },
        enabled: !!storeId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    })
}

// Get Store Products Hook
export const useGetStoreProducts = (params: StoreProductsParams) => {
    return useQuery({
        queryKey: ['store-products', params],
        queryFn: async (): Promise<StoreProductsResponse> => {
            const response = await axiosClient.post(ApiEndpoints.StoreProducts, params)
            return response.data
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}
