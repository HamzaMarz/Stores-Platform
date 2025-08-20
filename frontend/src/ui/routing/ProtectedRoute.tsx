import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AppRoutes } from '../../constants/app'
import { useAuthStore } from '../../features/auth/state/useAuthStore'
import Skeleton from '../../components/Skeleton'

type Props = { children: React.ReactNode }

const ProtectedRoute: React.FC<Props> = ({ children }) => {
	const location = useLocation()
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
	const isBootstrapped = useAuthStore((s) => s.isBootstrapped)
	const userType = useAuthStore((s) => s.user?.type)

	if (!isBootstrapped) {
		return (
			<div className="container mx-auto px-4 py-10">
				<Skeleton className="h-9 w-1/3" />
				<Skeleton className="mt-2 h-6 w-1/2" />
			</div>
		)
	}

	if (!isAuthenticated) {
		return <Navigate to={AppRoutes.Login} replace state={{ from: location }} />
	}

	// Prevent non-customer users from accessing the upgrade route
	if (location.pathname === AppRoutes.Upgrade && userType && userType !== 'customer') {
		return <Navigate to={AppRoutes.Dashboard} replace />
	}

	return <>{children}</>
}

export default ProtectedRoute

