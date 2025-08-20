import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '../../constants/app'
import { useAuthStore } from '../../features/auth/state/useAuthStore'

const LandingPage: React.FC = () => {
	const navigate = useNavigate()
	const type = useAuthStore((s) => s.user?.type)
	const isCustomer = type === 'customer' || !type
	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mx-auto max-w-3xl">
				<h1 className="text-3xl font-extrabold tracking-tight">Welcome to your new account</h1>
				<p className="text-gray-600 mt-2">Choose one of the following to get started.</p>
				<div className="mt-8 grid md:grid-cols-2 gap-4">
					<div className="rounded-xl border bg-white p-6 shadow-sm animate-in fade-in">
						<h2 className="text-lg font-semibold">Verify your profile</h2>
						<p className="text-sm text-gray-600 mt-1">Complete verification to unlock all features.</p>
						<button onClick={() => navigate(AppRoutes.Profile)} className="mt-4 rounded-md bg-gray-900 text-white px-4 py-2 hover:bg-gray-800">Go to profile</button>
					</div>
					{isCustomer && (
						<div className="rounded-xl border bg-white p-6 shadow-sm animate-in fade-in">
							<h2 className="text-lg font-semibold">Upgrade to a store or merchant</h2>
							<p className="text-sm text-gray-600 mt-1">Start selling with our marketplace tools.</p>
							<button onClick={() => navigate(AppRoutes.Upgrade)} className="mt-4 rounded-md border px-4 py-2 hover:bg-gray-50">Explore upgrades</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default LandingPage

