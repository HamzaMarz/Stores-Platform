import React from 'react'
import { useAuthStore } from '../../features/auth/state/useAuthStore'

const DashboardPage: React.FC = () => {
	const user = useAuthStore((s) => s.user)
	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="text-2xl font-bold">Dashboard</h1>
			<p className="text-gray-600 mt-2">Welcome {user?.name || 'there'} 👋</p>
			<div className="mt-8 grid gap-4 md:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="rounded-xl border bg-white p-6 shadow-sm animate-in fade-in duration-500">
						<div className="h-24 bg-gradient-to-br from-gray-100 to-white rounded-md" />
						<p className="mt-3 text-sm text-gray-700">Placeholder card {i + 1}</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default DashboardPage

