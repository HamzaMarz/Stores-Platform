// هان صار تعديل
import { createBrowserRouter } from 'react-router-dom'
import { AppRoutes } from '../constants/app'
import RootLayout from '../ui/layouts/RootLayout'
// HomePage removed; index now uses WelcomeEntry
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import DashboardPage from '../ui/pages/DashboardPage'
import SellerProductsPage from '../features/seller/pages/SellerProductsPage'
import NotFoundPage from '../ui/pages/NotFoundPage'
import ProtectedRoute from '../ui/routing/ProtectedRoute'
import GuestRoute from '../ui/routing/GuestRoute'

import ProfilePage from '../features/profile/pages/ProfilePage'
import UpgradePage from '../features/merchant/pages/UpgradePage'
import SettingsPage from '../features/settings/pages/SettingsPage'
// Welcome pages
import VisitorWelcomePage from '../ui/pages/welcome/VisitorWelcomePage'
import CustomerWelcomePage from '../ui/pages/welcome/CustomerWelcomePage'
import SellerWelcomePage from '../ui/pages/welcome/SellerWelcomePage'
import WelcomeEntry from '../ui/pages/welcome/WelcomeEntry'
// Product pages
import ProductsPage from '../features/catalog/pages/ProductsPage'
import FeaturedProductsPage from '../features/catalog/pages/FeaturedProductsPage'
import ProductDetailsPage from '../features/catalog/pages/ProductDetailsPage'
import AdvancedSearchPage from '../features/catalog/pages/AdvancedSearchPage'
import StorePage from '../features/store/pages/StorePage'
import StoreSearchPage from '../features/store/pages/StoreSearchPage'
import ChatPage from '../features/chat/pages/ChatPage'

const router = createBrowserRouter([
	{
		path: AppRoutes.Home,
		element: <RootLayout />,
		children: [
			{ index: true, element: <WelcomeEntry /> },
			{ path: AppRoutes.Login, element: <GuestRoute><LoginPage /></GuestRoute> },
			{ path: AppRoutes.Register, element: <GuestRoute><RegisterPage /></GuestRoute> },
			// Welcome pages
			{ path: AppRoutes.VisitorWelcome, element: <VisitorWelcomePage /> },
			{ path: AppRoutes.CustomerWelcome, element: <ProtectedRoute><CustomerWelcomePage /></ProtectedRoute> },
			{ path: AppRoutes.SellerWelcome, element: <ProtectedRoute><SellerWelcomePage /></ProtectedRoute> },
			// Product pages
			{ path: AppRoutes.Products, element: <ProductsPage /> },
			{ path: AppRoutes.FeaturedProducts, element: <FeaturedProductsPage /> },
			{ path: AppRoutes.AdvancedSearch, element: <AdvancedSearchPage /> },
			{ path: AppRoutes.ProductDetails, element: <ProductDetailsPage /> },
			{ path: AppRoutes.StoreSearch, element: <StoreSearchPage /> },
			{ path: AppRoutes.Store, element: <StorePage /> },
			{ path: AppRoutes.Chat, element: <ProtectedRoute><ChatPage /></ProtectedRoute> },
			{
				path: AppRoutes.Dashboard,
				element: (
					<ProtectedRoute>
						<DashboardPage />
					</ProtectedRoute>
				),
				children: [
					{ index: true, element: <SellerProductsPage /> },
					{ path: 'products', element: <SellerProductsPage /> },
				],
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
			{
				path: AppRoutes.Settings,
				element: (
					<ProtectedRoute>
						<SettingsPage />
					</ProtectedRoute>
				),
			},
			{ path: AppRoutes.NotFound, element: <NotFoundPage /> },
		],
	},
])

export default router

