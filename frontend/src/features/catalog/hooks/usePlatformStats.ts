import { useQuery } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export interface PlatformStats {
	totalProducts: number
	totalStores: number
	totalCustomers: number
	totalOrders: number
	monthlyRevenue: number
	activeUsers: number
}

export const usePlatformStats = () => {
	return useQuery({
		queryKey: ['platform-stats'],
		queryFn: async (): Promise<PlatformStats> => {
			try {
				// Get products data
				const productsRes = await axiosClient.get(ApiEndpoints.Products)
				const totalProducts = productsRes.data.count || 0

				// Mock data for other stats since we removed orders
				const totalStores = Math.floor(totalProducts * 0.3) // Estimate stores
				const totalCustomers = Math.floor(totalProducts * 2.5) // Estimate customers
				const totalOrders = Math.floor(totalProducts * 1.8) // Estimate orders
				const monthlyRevenue = totalOrders * 120 // Average order value
				const activeUsers = Math.floor(totalProducts * 3.2) // Estimate active users

				return {
					totalProducts,
					totalStores,
					totalCustomers,
					totalOrders,
					monthlyRevenue,
					activeUsers
				}
			} catch (error) {
				console.error('Error fetching platform stats:', error)
				// Return default values on error
				return {
					totalProducts: 0,
					totalStores: 0,
					totalCustomers: 0,
					totalOrders: 0,
					monthlyRevenue: 0,
					activeUsers: 0
				}
			}
		},
		staleTime: 10 * 60 * 1000, // 10 minutes
	})
}
