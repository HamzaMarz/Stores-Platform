import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppRoutes } from '@/constants/app'
import LoginPage from '@/features/auth/pages/LoginPage'
import AdminLayout from '@/ui/layouts/AdminLayout'
import AdminProtectedRoute from '@/ui/routing/AdminProtectedRoute'
import DashboardPage from '@/ui/pages/DashboardPage'
import PendingOrdersPage from '@/features/orders/pages/PendingOrdersPage'
import SearchOrdersPage from '@/features/orders/pages/SearchOrdersPage'
import UsersPage from '@/features/users/pages/UsersPage'
import UserDetailsPage from '@/features/users/pages/UserDetailsPage'
import UpgradeOpsPage from '@/features/users/pages/UpgradeOpsPage'
import SupportPage from '@/features/support/pages/SupportPage'
import SupportDetailsPage from '@/features/support/pages/SupportDetailsPage'

export const router = createBrowserRouter([
  { path: AppRoutes.Login, element: <LoginPage /> },
  {
    element: <AdminProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: AppRoutes.OrdersPending, element: <PendingOrdersPage /> },
          { path: AppRoutes.OrdersSearch, element: <SearchOrdersPage /> },
          { path: AppRoutes.Users, element: <UsersPage /> },
          { path: AppRoutes.UserDetails, element: <UserDetailsPage /> },
          { path: AppRoutes.UpgradeOps, element: <UpgradeOpsPage /> },
          { path: AppRoutes.Support, element: <SupportPage /> },
          { path: AppRoutes.SupportDetails, element: <SupportDetailsPage /> },
        ]
      }
    ]
  }
])


