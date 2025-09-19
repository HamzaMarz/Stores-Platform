import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import styled from '@emotion/styled'
import { 
	Menu as MenuIcon, 
	Close as CloseIcon,
	ShoppingCart as CartIcon,
	Store as StoreIcon,
	Search as SearchIcon,
	Home as HomeIcon,
	Message as MessageIcon,
	Dashboard as DashboardIcon,
	Inventory as InventoryIcon,
	LocalOffer as OfferIcon,
	ReceiptLong as OrdersIcon,
	Person as PersonIcon,
	Settings as SettingsIcon,
	Logout as LogoutIcon
} from '@mui/icons-material'
import { AppRoutes, UiText } from '../../constants/app'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/Toast'
import { useAuthStore } from '../../features/auth/state/useAuthStore'
import { useLogout } from '../../features/auth/hooks/useLogout'
import { useBootstrapAuth } from '../../features/auth/hooks/useBootstrapAuth'
import Skeleton from '../../components/Skeleton'

// Styled Components using Emotion
const AppBar = styled(motion.header)`
	position: sticky;
	top: 0;
	z-index: 40;
	background: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(12px);
	border-bottom: 1px solid #e5e7eb;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`

const Drawer = styled(motion.div)<{ open: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 280px;
	height: 100vh;
	background: white;
	border-right: 1px solid #e5e7eb;
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
	z-index: 50;
	transform: ${props => props.open ? 'translateX(0)' : 'translateX(-100%)'};
	transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`

const DrawerHeader = styled.div`
	height: 64px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 16px;
	border-bottom: 1px solid #e5e7eb;
	background: #f8fafc;
`

const DrawerContent = styled.div`
	height: calc(100vh - 64px);
	overflow-y: auto;
	padding: 8px;
`

const NavSection = styled.div`
	margin-bottom: 16px;
`

const SectionTitle = styled.div`
	font-size: 12px;
	font-weight: 600;
	text-transform: uppercase;
	color: #6b7280;
	padding: 8px 12px;
	letter-spacing: 0.05em;
`

const NavItem = styled(NavLink)`
	display: flex;
	align-items: center;
	padding: 12px 16px;
	margin: 2px 0;
	border-radius: 8px;
	text-decoration: none;
	color: #374151;
	font-size: 14px;
	font-weight: 500;
	transition: all 0.2s ease;
	
	&:hover {
		background: #f3f4f6;
		color: #111827;
	}
	
	&.active {
		background: #dbeafe;
		color: #1d4ed8;
	}
`

const NavIcon = styled.div`
	margin-right: 12px;
	display: flex;
	align-items: center;
	color: inherit;
`

const AvatarButton = styled(motion.button)`
	display: flex;
	align-items: center;
	padding: 8px 12px;
	border-radius: 8px;
	border: 1px solid #e5e7eb;
	background: white;
	cursor: pointer;
	transition: all 0.2s ease;
	
	&:hover {
		background: #f9fafb;
		border-color: #d1d5db;
	}
`

const Avatar = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-weight: 600;
	font-size: 14px;
	margin-right: 8px;
`

const MenuButton = styled(motion.button)`
	display: flex;
	align-items: center;
	padding: 8px 16px;
	border-radius: 8px;
	border: 1px solid #e5e7eb;
	background: white;
	cursor: pointer;
	transition: all 0.2s ease;
	
	&:hover {
		background: #f9fafb;
		border-color: #d1d5db;
	}
`

const Overlay = styled(motion.div)<{ open: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 40;
	opacity: ${props => props.open ? 1 : 0};
	visibility: ${props => props.open ? 'visible' : 'hidden'};
	transition: all 0.3s ease;
`

const RootLayout: React.FC = () => {
	const { toasts, show, remove } = useToast()
	const user = useAuthStore((s) => s.user)
	const logout = useLogout()
	const isBootstrapped = useAuthStore((s) => s.isBootstrapped)
	useBootstrapAuth()
	const [drawerOpen, setDrawerOpen] = React.useState(false)
	const [profileMenuOpen, setProfileMenuOpen] = React.useState(false)
	const location = useLocation()

	const isSeller = !!user && (user.type === 'merchant' || user.type === 'store')

	// Navigation items configuration
	const getNavigationItems = () => {
		if (isSeller) {
			return {
				seller: [
					{ to: AppRoutes.SellerWelcome, label: 'Seller Welcome', icon: <HomeIcon /> },
					{ to: AppRoutes.Dashboard, label: 'Dashboard', icon: <DashboardIcon /> },
					{ to: AppRoutes.Dashboard + '/products', label: 'My Products', icon: <InventoryIcon /> },
					{ to: AppRoutes.Dashboard + '/products', label: 'Manage Products', icon: <InventoryIcon /> },
					{ to: AppRoutes.Dashboard + '/products', label: 'Search Products', icon: <SearchIcon /> },
				],
				customer: [
					{ to: AppRoutes.CustomerWelcome, label: 'Welcome', icon: <HomeIcon /> },
					{ to: AppRoutes.Products, label: 'Browse Products', icon: <InventoryIcon /> },
					{ to: AppRoutes.FeaturedProducts, label: 'Offers', icon: <OfferIcon /> },
					{ to: AppRoutes.AdvancedSearch, label: 'Advanced Search', icon: <SearchIcon /> },
					{ to: AppRoutes.Chat, label: 'Messages', icon: <MessageIcon /> },
					{ to: AppRoutes.StoreSearch, label: 'Browse Stores', icon: <StoreIcon /> },
					{ to: '/cart', label: 'Cart', icon: <CartIcon /> },
					{ to: '/orders', label: 'Orders', icon: <OrdersIcon /> },
				]
			}
		} else {
			return {
				customer: [
					{ to: AppRoutes.CustomerWelcome, label: 'Welcome', icon: <HomeIcon /> },
					{ to: AppRoutes.Products, label: 'Browse Products', icon: <InventoryIcon /> },
					{ to: AppRoutes.FeaturedProducts, label: 'Offers', icon: <OfferIcon /> },
					{ to: AppRoutes.AdvancedSearch, label: 'Advanced Search', icon: <SearchIcon /> },
					{ to: AppRoutes.Chat, label: 'Messages', icon: <MessageIcon /> },
					{ to: AppRoutes.StoreSearch, label: 'Browse Stores', icon: <StoreIcon /> },
					{ to: '/cart', label: 'Cart', icon: <CartIcon /> },
					{ to: '/orders', label: 'Orders', icon: <OrdersIcon /> },
				]
			}
		}
	}

	const navigationItems = getNavigationItems()

	return (
		<div className="min-h-dvh flex flex-col">
			<AppBar
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
					<div className="flex items-center gap-2">
						{user ? (
							<MenuButton
								onClick={() => setDrawerOpen((v) => !v)}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<MenuIcon className="w-4 h-4 mr-2" />
								Menu
							</MenuButton>
						) : null}
						<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
							<NavLink to={AppRoutes.Home} className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-colors">
								{UiText.AppName}
							</NavLink>
						</motion.div>
					</div>
					<nav className="flex items-center gap-4 text-sm">
						{!user ? (
							<>
								{location.pathname !== AppRoutes.VisitorWelcome && (
									<NavLink to={AppRoutes.Login} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
										Login
									</NavLink>
								)}
							</>
						) : (
							<>
								<AvatarButton
									onClick={() => setProfileMenuOpen((v) => !v)}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Avatar>
										{user.name?.[0]?.toUpperCase() || 'U'}
									</Avatar>
									<span className="text-sm font-medium text-gray-700">
										{user.name || 'User'}
									</span>
								</AvatarButton>
								{profileMenuOpen && (
									<div className="absolute right-4 top-14 w-56 bg-white border rounded-md shadow-lg py-1">
										<button onClick={() => { window.location.href = AppRoutes.Profile; setProfileMenuOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
											<PersonIcon className="w-4 h-4 text-gray-500" />
											<span>Profile</span>
										</button>
										{(user.type === 'merchant' || user.type === 'store') && (
											<button onClick={() => { window.location.href = AppRoutes.Settings; setProfileMenuOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
												<SettingsIcon className="w-4 h-4 text-gray-500" />
												<span>Settings</span>
											</button>
										)}
										<button onClick={async () => { try { await logout.mutateAsync(); } finally { setProfileMenuOpen(false) } }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
											<LogoutIcon className="w-4 h-4" />
											<span>Logout</span>
										</button>
									</div>
								)}
							</>
						)}
					</nav>
				</div>
			</AppBar>
			<main className="flex-1">
				{!isBootstrapped ? (
					<div className="container mx-auto px-4 py-10">
						<div className="max-w-3xl space-y-3">
							<Skeleton className="h-9 w-1/3" />
							<Skeleton className="h-6 w-1/2" />
							<div className="grid grid-cols-3 gap-3">
								{Array.from({ length: 6 }).map((_, i) => (
									<Skeleton key={i} className="aspect-[4/5]" />
								))}
							</div>
						</div>
					</div>
				) : (
					<Outlet context={{ toast: show }} />
				)}
			</main>
			<footer className="border-t bg-white">
				<div className="container mx-auto px-4 py-8 text-center text-sm text-gray-600">
					© {new Date().getFullYear()} {UiText.AppName}
				</div>
			</footer>
			<Toast toasts={toasts} onDismiss={remove} />
			{user && (
				<>
					<Overlay open={drawerOpen} onClick={() => setDrawerOpen(false)} />
					<Drawer open={drawerOpen}>
						<DrawerHeader>
							<div className="text-lg font-semibold text-gray-900">Menu</div>
							<button 
								onClick={() => setDrawerOpen(false)} 
								className="p-2 rounded-md hover:bg-gray-100 transition-colors"
							>
								<CloseIcon className="w-5 h-5 text-gray-500" />
							</button>
						</DrawerHeader>
						<DrawerContent>
							{isSeller ? (
								<>
									<NavSection>
										<SectionTitle>Seller</SectionTitle>
										{navigationItems.seller?.map((item) => (
											<NavItem key={item.to} to={item.to}>
												<NavIcon>{item.icon}</NavIcon>
												{item.label}
											</NavItem>
										))}
									</NavSection>
									<NavSection>
										<SectionTitle>Customer</SectionTitle>
										{navigationItems.customer?.map((item) => (
											<NavItem key={item.to} to={item.to}>
												<NavIcon>{item.icon}</NavIcon>
												{item.label}
											</NavItem>
										))}
										<div className="px-4 py-2 text-sm text-gray-400 cursor-not-allowed">3D Products (soon)</div>
										<div className="px-4 py-2 text-sm text-gray-400 cursor-not-allowed">Chatbot (soon)</div>
									</NavSection>
									<div className="mt-4 border-t pt-2 px-2">
										<button onClick={async () => { try { await logout.mutateAsync(); } finally { setDrawerOpen(false) } }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
											<LogoutIcon className="w-4 h-4" />
											<span>Logout</span>
										</button>
									</div>
								</>
							) : (
								<NavSection>
									<SectionTitle>Customer</SectionTitle>
									{navigationItems.customer?.map((item) => (
										<NavItem key={item.to} to={item.to}>
											<NavIcon>{item.icon}</NavIcon>
											{item.label}
										</NavItem>
									))}
									<div className="px-4 py-2 text-sm text-gray-400 cursor-not-allowed">3D Products (soon)</div>
									<div className="px-4 py-2 text-sm text-gray-400 cursor-not-allowed">Chatbot (soon)</div>
									<div className="mt-4 border-t pt-2 px-2">
										<button onClick={async () => { try { await logout.mutateAsync(); } finally { setDrawerOpen(false) } }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
											<LogoutIcon className="w-4 h-4" />
											<span>Logout</span>
										</button>
									</div>
								</NavSection>
							)}
						</DrawerContent>
					</Drawer>
				</>
			)}
		</div>
	)
}

export default RootLayout

