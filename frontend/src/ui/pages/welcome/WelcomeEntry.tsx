import React from 'react'
import { Navigate } from 'react-router-dom'
import { AppRoutes } from '../../../constants/app'
import { useAuthStore } from '../../../features/auth/state/useAuthStore'
import VisitorWelcomePage from './VisitorWelcomePage'

const WelcomeEntry: React.FC = () => {
    const isBootstrapped = useAuthStore((s) => s.isBootstrapped)
    const user = useAuthStore((s) => s.user)

    if (!isBootstrapped) {
        // Keep blank to let RootLayout skeleton render
        return null
    }

    if (!user) return <VisitorWelcomePage />

    // All authenticated users (verified or not) go to CustomerWelcome
    // The page will handle showing appropriate content based on verification status
    if (user.type === 'merchant' || user.type === 'store') {
        return <Navigate to={AppRoutes.SellerWelcome} replace />
    }
    return <Navigate to={AppRoutes.CustomerWelcome} replace />
}

export default WelcomeEntry


