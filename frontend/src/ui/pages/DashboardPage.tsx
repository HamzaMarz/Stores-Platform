import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/state/useAuthStore'

const DashboardPage: React.FC = () => {
	const user = useAuthStore((s) => s.user)
	return (
		<div className="container mx-auto px-4 py-12">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Seller Dashboard</h1>
					<p className="text-gray-600 mt-2">Welcome {user?.name || 'there'} 👋</p>
				</div>
			</div>
			<div className="mt-6 border-b">
				<nav className="flex gap-4 text-sm">
					<NavLink to="products" className={({isActive}) => isActive ? 'border-b-2 border-gray-900 pb-2' : 'text-gray-600 pb-2 hover:text-gray-900'}>Products</NavLink>
					<NavLink to="orders" className={({isActive}) => isActive ? 'border-b-2 border-gray-900 pb-2' : 'text-gray-600 pb-2 hover:text-gray-900'}>Orders</NavLink>
				</nav>
			</div>
			<div className="mt-6">
				<Outlet />
			</div>
		</div>
	)
}

export default DashboardPage

