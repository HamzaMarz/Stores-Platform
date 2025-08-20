import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import { useAuthStore } from '../state/useAuthStore'

type MeResponse = {
	statusCode: number
	data: { id: number; email: string; user: 'customer' | 'merchant' | 'store'; first_name?: string; last_name?: string; profile_pic?: string; verified?: boolean }
}

export const useBootstrapAuth = () => {
	const setUser = useAuthStore((s) => s.setUser)
	const setBootstrapped = useAuthStore((s) => s.setBootstrapped)
	const isBootstrapped = useAuthStore((s) => s.isBootstrapped)

	const query = useQuery({
		queryKey: ['auth', 'me'],
		queryFn: async (): Promise<MeResponse['data']> => {
			const { data } = await axiosClient.get<MeResponse>(ApiEndpoints.Me)
			return data.data
		},
		enabled: !isBootstrapped,
		retry: false,
	})

	useEffect(() => {
		if (query.isSuccess) {
			const d = query.data
			const type = d.user
			const composedName = d.first_name || d.last_name ? `${d.first_name ?? ''} ${d.last_name ?? ''}`.trim() : d.email
			setUser({ id: String(d.id), email: d.email, name: composedName, verified: d.verified, type })
			setBootstrapped(true)
		}
		if (query.isError) {
			setUser(null)
			setBootstrapped(true)
		}
	}, [query.isSuccess, query.isError])

	return query
}


