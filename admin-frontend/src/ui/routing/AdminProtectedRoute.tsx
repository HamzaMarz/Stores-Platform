import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AppRoutes } from '@/constants/app'
import { useAdminMe } from '@/features/auth/hooks/useAdminMe'

const AdminProtectedRoute: React.FC = () => {
  const { data, isLoading } = useAdminMe()

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!data?.success) {
    return <Navigate to={AppRoutes.Login} replace />
  }

  return <Outlet />
}

export default AdminProtectedRoute


