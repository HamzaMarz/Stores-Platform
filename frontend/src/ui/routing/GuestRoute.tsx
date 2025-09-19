import React from 'react'
import { Navigate } from 'react-router-dom'
import { AppRoutes } from '../../constants/app'
import { useAuthStore } from '../../features/auth/state/useAuthStore'
import Skeleton from '../../components/Skeleton'

type Props = { children: React.ReactNode }

const GuestRoute: React.FC<Props> = ({ children }) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const isBootstrapped = useAuthStore((s) => s.isBootstrapped)
    const user = useAuthStore((s) => s.user)

    if (!isBootstrapped) {
        return (
            <div className="container mx-auto px-4 py-10">
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="mt-2 h-6 w-1/2" />
            </div>
        )
    }

    if (isAuthenticated && user) {
        // Route by user type regardless of verification status
        if (user.type === 'merchant' || user.type === 'store') return <Navigate to={AppRoutes.SellerWelcome} replace />
        return <Navigate to={AppRoutes.CustomerWelcome} replace />
    }

    return <>{children}</>
}

export default GuestRoute



