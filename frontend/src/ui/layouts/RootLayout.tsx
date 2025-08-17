import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { AppRoutes, UiText } from '../../constants/app'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/Toast'
import { useAuthStore } from '../../features/auth/state/useAuthStore'
import { useLogout } from '../../features/auth/hooks/useLogout'
import { useBootstrapAuth } from '../../features/auth/hooks/useBootstrapAuth'
import Skeleton from '../../components/Skeleton'

const RootLayout: React.FC = () => {
	const { toasts, show, remove } = useToast()
	const user = useAuthStore((s) => s.user)
	const logout = useLogout()
	const isBootstrapped = useAuthStore((s) => s.isBootstrapped)
	useBootstrapAuth()

	return (
		<div className="min-h-dvh flex flex-col">
			<header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
				<div className="container mx-auto px-4 h-16 flex items-center justify-between">
					<NavLink to={AppRoutes.Home} className="text-lg font-bold tracking-tight">
						{UiText.AppName}
					</NavLink>
					<nav className="flex items-center gap-4 text-sm">
						{!user ? (
							<>
								<NavLink to={AppRoutes.Login} className={({ isActive }) => isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}>
									Login
								</NavLink>
								<NavLink to={AppRoutes.Register} className={({ isActive }) => isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}>
									Register
								</NavLink>
							</>
						) : (
							<>
								<span className="text-gray-700">Hi, {user.name}</span>
								<button
									className="rounded-md border px-3 py-1.5 hover:bg-gray-50"
									onClick={async () => {
										try {
											await logout.mutateAsync()
											show({ title: 'Signed out', tone: 'success' })
										} catch (err) {
											show({ title: 'Failed to sign out', description: (err as Error).message, tone: 'error' })
										}
									}}
								>
									Sign out
								</button>
							</>
						)}
					</nav>
				</div>
			</header>
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
		</div>
	)
}

export default RootLayout

