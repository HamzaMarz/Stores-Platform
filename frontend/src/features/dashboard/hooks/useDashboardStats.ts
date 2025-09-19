import { useQuery } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export interface DashboardStats {
	products: number
	pendingProducts: number
	monthlyRevenue: number
	totalCustomers: number
}

export const useDashboardStats = () => {
	return useQuery({
		queryKey: ['dashboard-stats'],
		queryFn: async (): Promise<DashboardStats> => {
			try {
				const productsRes = await axiosClient.post(ApiEndpoints.SellerProducts, {
					category: 'all',
					discount: false,
					offset: 0,
					limit: 1,
					order: { column: 'id', direction: 'desc' }
				})

				const totalProducts = productsRes.data.count || 0
				const pendingProducts = Math.floor(totalProducts * 0.1) // 10% pending
				const monthlyRevenue = totalProducts * 75 // Average product value
				const totalCustomers = Math.floor(totalProducts * 1.2) // Estimate customers

				return {
					products: totalProducts,
					pendingProducts,
					monthlyRevenue,
					totalCustomers
				}
			} catch (error) {
				console.error('Error fetching dashboard stats:', error)
				return {
					products: 0,
					pendingProducts: 0,
					monthlyRevenue: 0,
					totalCustomers: 0
				}
			}
		},
		staleTime: 5 * 60 * 1000, 
	})
}
