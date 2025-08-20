import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import LoginForm from '@/features/auth/components/LoginForm'
import { AppRoutes } from '@/constants/app'
import { useAdminMe } from '@/features/auth/hooks/useAdminMe'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useAdminMe()

  if (isLoading) return <div className="p-6">Loading...</div>
  if (data?.success) return <Navigate to={AppRoutes.Dashboard} replace />

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white border rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-4 text-center">Admin Sign in</h1>
        <LoginForm onSuccess={() => navigate(AppRoutes.Dashboard)} />
      </div>
    </div>
  )
}

export default LoginPage


