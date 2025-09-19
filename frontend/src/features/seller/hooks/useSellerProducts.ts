import { useQuery, useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export interface SellerProduct {
	id: number
	name: string
	description: string
	price: number
	discount: number
	rating: number
	rating_count: number
	sell_count: number
	category: string
	thumbnail_image: string
	images: string[]
	in_stock: boolean
	owner_id: number
	product_owner: {
		store_name: string
		merchant_alias: string
	}
}

export interface SellerProductsResponse {
	data: SellerProduct[]
	count: number
}

export interface SellerProductsParams {
	category?: string
	discount?: boolean
	offset: number
	limit: number
	order: {
		column: 'rating' | 'sell_count' | 'id' | 'price' | 'name'
		direction: 'asc' | 'desc'
	}
}

export interface SellerSearchParams {
	term?: string
	category?: string
	in_stock?: boolean
	price?: { min: number; max: number }
	discount?: { min: number; max: number }
	offset: number
	limit: number
	order: {
		column: 'rating' | 'sell_count' | 'id' | 'price' | 'name'
		direction: 'asc' | 'desc'
	}
}

export const useSellerProducts = (params: SellerProductsParams) => {
	return useQuery({
		queryKey: ['seller-products', params],
		queryFn: async (): Promise<SellerProductsResponse> => {
			const response = await axiosClient.post(ApiEndpoints.SellerProducts, params)
			return response.data
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

// List Seller Products Hook
export const useListSellerProducts = (params: SellerProductsParams) => {
	return useQuery({
		queryKey: ['list-seller-products', params],
		queryFn: async (): Promise<SellerProductsResponse> => {
			const response = await axiosClient.post(ApiEndpoints.SellerProducts, params)
			return response.data
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

// List Unlisted Seller Products Hook
export const useListUnlistedSellerProducts = (params: SellerProductsParams) => {
	return useQuery({
		queryKey: ['list-unlisted-seller-products', params],
		queryFn: async (): Promise<SellerProductsResponse> => {
			const response = await axiosClient.post(ApiEndpoints.SellerProductAllUnlisted, params)
			return response.data
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

// Search Seller Products Hook
export const useSearchSellerProducts = (params: SellerSearchParams, enabled: boolean = true) => {
	return useQuery({
		queryKey: ['search-seller-products', params],
		queryFn: async (): Promise<SellerProductsResponse> => {
			const response = await axiosClient.post(ApiEndpoints.SellerProductSearch, params)
			return response.data
		},
		enabled,
		staleTime: 2 * 60 * 1000, // 2 minutes
	})
}

export const useTopSellerProducts = () => {
	return useQuery({
		queryKey: ['top-seller-products'],
		queryFn: async (): Promise<SellerProductsResponse> => {
			const response = await axiosClient.post(ApiEndpoints.SellerProducts, {
				category: 'all',
				discount: false,
				offset: 0,
				limit: 5,
				order: {
					column: 'sell_count',
					direction: 'desc'
				}
			})
			return response.data
		},
		staleTime: 10 * 60 * 1000, // 10 minutes
	})
}

// Add Product Hook
export const useAddProduct = () => {
	return useMutation({
		mutationFn: async (payload: {
			name: string
			description: string
			thumbnail_image: File
			images: File[]
			category: string
			price: number
		}) => {
			const formData = new FormData()
			formData.append('name', payload.name)
			formData.append('description', payload.description)
			formData.append('thumbnail_image', payload.thumbnail_image)
			payload.images.forEach((img) => formData.append('images', img))
			formData.append('category', payload.category)
			formData.append('price', String(payload.price))
			
			const response = await axiosClient.put(ApiEndpoints.SellerProductAdd, formData, { 
				headers: { 'Content-Type': 'multipart/form-data' } 
			})
			return response.data
		},
	})
}

// Edit Product Hook
export const useEditProduct = () => {
	return useMutation({
		mutationFn: async (payload: {
			id: number
			name?: string
			description?: string
			thumbnail_image?: File
			images?: File[]
			category?: string
			price?: number
			discount?: number
			in_stock?: boolean
		}) => {
			const formData = new FormData()
			Object.entries(payload).forEach(([k, v]) => {
				if (v === undefined || v === null) return
				if (k === 'images' && Array.isArray(v)) {
					v.forEach((img) => formData.append('images', img as File))
				} else if (k === 'in_stock') {
					formData.append(k, (v as boolean) ? 'true' : 'false')
				} else {
					formData.append(k, v as any)
				}
			})
			
			const response = await axiosClient.put(ApiEndpoints.SellerProductEdit, formData, { 
				headers: { 'Content-Type': 'multipart/form-data' } 
			})
			return response.data
		},
	})
}

// Toggle Listing Hook
export const useToggleListing = () => {
	return {
		enlist: useMutation({
			mutationFn: async (id: number) => {
				const response = await axiosClient.put(ApiEndpoints.SellerProductEnlist, { id })
				return response.data
			},
		}),
		unlist: useMutation({
			mutationFn: async (id: number) => {
				const response = await axiosClient.put(ApiEndpoints.SellerProductUnlist, { id })
				return response.data
			},
		}),
	}
}


