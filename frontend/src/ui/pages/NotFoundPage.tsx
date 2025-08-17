import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '../../constants/app'

const NotFoundPage: React.FC = () => {
	const navigate = useNavigate()
	return (
		<div className="min-h-dvh grid place-items-center bg-gradient-to-b from-white to-gray-50">
			<div className="text-center p-8">
				<div className="relative mx-auto h-40 w-40">
					<div className="absolute inset-0 rounded-full bg-gray-100 animate-pulse" />
					<div className="absolute inset-2 rounded-full bg-white shadow-inner" />
					<div className="absolute inset-4 rounded-full bg-gray-50 shadow" />
					<div className="absolute inset-0 flex items-center justify-center text-4xl font-black tracking-tighter select-none">
						404
					</div>
				</div>
				<h1 className="mt-6 text-2xl font-bold">Page not found</h1>
				<p className="mt-2 text-gray-600 max-w-md">
					Looks like you took a wrong turn. Let’s guide you back to delightful shopping.
				</p>
				<div className="mt-6 flex items-center justify-center gap-3">
					<button onClick={() => navigate(AppRoutes.Home)} className="rounded-md bg-gray-900 text-white px-5 py-2.5 hover:bg-gray-800 transition">
						Go home
					</button>
					<button onClick={() => navigate(AppRoutes.Login)} className="rounded-md border px-5 py-2.5 hover:bg-gray-50 transition">
						Sign in
					</button>
				</div>
			</div>
		</div>
	)
}

export default NotFoundPage

