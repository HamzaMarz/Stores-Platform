import { createBrowserRouter } from 'react-router-dom'
import { AppRoutes } from '../constants/app'
import RootLayout from '../ui/layouts/RootLayout'
import HomePage from '../ui/pages/HomePage'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import DashboardPage from '../ui/pages/DashboardPage'
import NotFoundPage from '../ui/pages/NotFoundPage'
import ProtectedRoute from '../ui/routing/ProtectedRoute'
import LandingPage from '../ui/pages/LandingPage'
import ProfilePage from '../features/profile/pages/ProfilePage'
import UpgradePage from '../features/merchant/pages/UpgradePage'

const router = createBrowserRouter([
	{
		path: AppRoutes.Home,
		element: <RootLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: AppRoutes.Login, element: <LoginPage /> },
			{ path: AppRoutes.Register, element: <RegisterPage /> },
			{
				path: AppRoutes.Dashboard,
				element: (
					<ProtectedRoute>
						<DashboardPage />
					</ProtectedRoute>
				),
			},
			{
				path: AppRoutes.Landing,
				element: (
					<ProtectedRoute>
						<LandingPage />
					</ProtectedRoute>
				),
			},
			{
				path: AppRoutes.Profile,
				element: (
					<ProtectedRoute>
						<ProfilePage />
					</ProtectedRoute>
				),
			},
			{
				path: AppRoutes.Upgrade,
				element: (
					<ProtectedRoute>
						<UpgradePage />
					</ProtectedRoute>
				),
			},
			{ path: AppRoutes.NotFound, element: <NotFoundPage /> },
		],
	},
])

export default router

