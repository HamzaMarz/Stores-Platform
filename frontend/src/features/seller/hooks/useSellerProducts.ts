import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import type { SellerProduct } from '../types'

type ListRequest = {
	category: string
	discount?: boolean
	offset: number
	limit: number
	order: { column: 'rating' | 'sell_count' | 'id' | 'price' | 'name'; direction: 'asc' | 'desc' }
}

export const useListSellerProducts = (params: ListRequest) => {
	return useQuery({
		queryKey: ['seller-products', params],
		queryFn: async () => {
			const { data } = await axiosClient.post(ApiEndpoints.SellerProductAll, params)
			return data as { statusCode: number; data: SellerProduct[]; count: number; message: string }
		},
		select: (res) => ({ items: res.data, count: res.count }),
	})
}

export const useListUnlistedSellerProducts = (params: ListRequest) => {
	return useQuery({
		queryKey: ['seller-unlisted-products', params],
		queryFn: async () => {
			const { data } = await axiosClient.post(ApiEndpoints.SellerProductAllUnlisted, params)
			return data as { statusCode: number; data: SellerProduct[]; count: number; message: string }
		},
		select: (res) => ({ items: res.data, count: res.count }),
	})
}

type SearchRequest = {
	term?: string
	category: string
	in_stock?: boolean
	discount?: { min: number; max: number }
	price?: { min: number; max: number }
	offset: number
	limit: number
	order: { column: 'rating' | 'sell_count' | 'id' | 'price' | 'name'; direction: 'asc' | 'desc' }
}

export const useSearchSellerProducts = (params: SearchRequest, enabled: boolean) => {
	return useQuery({
		enabled,
		queryKey: ['seller-products-search', params],
		queryFn: async () => {
			const body: any = {
				category: params.category,
				offset: Number.isFinite(params.offset) ? params.offset : 0,
				limit: Number.isFinite(params.limit) ? params.limit : 10,
				order: params.order,
			}
			const t = (params.term || '').trim()
			if (t.length > 0) body.term = t
			if (typeof params.in_stock === 'boolean') body.in_stock = params.in_stock
			if (params.discount && Number.isFinite(params.discount.min) && Number.isFinite(params.discount.max)) {
				body.discount = { min: params.discount.min, max: params.discount.max }
			}
			if (params.price && Number.isFinite(params.price.min) && Number.isFinite(params.price.max)) {
				body.price = { min: params.price.min, max: params.price.max }
			}
			const { data } = await axiosClient.post(ApiEndpoints.SellerProductSearch, body)
			return data as { statusCode: number; data: SellerProduct[]; count: number; message: string }
		},
		select: (res) => ({ items: res.data, count: res.count }),
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	})
}

type AddProductPayload = {
	name: string
	description: string
	thumbnail_image: File
	images: File[]
	category: string
	price: number
}

export const useAddProduct = () => {
	return useMutation({
		mutationFn: async (payload: AddProductPayload) => {
			const formData = new FormData()
			formData.append('name', payload.name)
			formData.append('description', payload.description)
			formData.append('thumbnail_image', payload.thumbnail_image)
			payload.images.forEach((img) => formData.append('images', img))
			formData.append('category', payload.category)
			formData.append('price', String(payload.price))
			const { data } = await axiosClient.put(ApiEndpoints.SellerProductAdd, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
			return data as { statusCode: number; message: string }
		},
	})
}

type EditProductPayload = {
	id: number
	name?: string
	description?: string
	thumbnail_image?: File
	images?: File[]
	category?: string
	price?: number
	discount?: number
	in_stock?: boolean
}

export const useEditProduct = () => {
	return useMutation({
		mutationFn: async (payload: EditProductPayload) => {
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
			const { data } = await axiosClient.put(ApiEndpoints.SellerProductEdit, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
			return data as { statusCode: number; message: string }
		},
	})
}

export const useToggleListing = () => {
	return {
		enlist: useMutation({
			mutationFn: async (id: number) => {
				const { data } = await axiosClient.put(`${ApiEndpoints.SellerProductEnlist}?id=${id}`)
				return data as { statusCode: number; message: string }
			},
		}),
		unlist: useMutation({
			mutationFn: async (id: number) => {
				const { data } = await axiosClient.put(`${ApiEndpoints.SellerProductUnlist}?id=${id}`)
				return data as { statusCode: number; message: string }
			},
		}),
	}
}


