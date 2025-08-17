import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '../../constants/app'
import HomeProductGrid from '../sections/HomeProductGrid'

const HomePage: React.FC = () => {
	const navigate = useNavigate()
	return (
		<div className="relative overflow-hidden">
			<section className="container mx-auto px-4 py-20">
				<div className="grid md:grid-cols-2 gap-10 items-center">
					<div className="space-y-6">
						<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
							Modern ecommerce for ambitious brands
						</h1>
						<p className="text-gray-600 text-lg">
							Build and scale your storefront with blazing-fast experiences and delightful animations.
						</p>
						<div className="flex gap-3">
							<button onClick={() => navigate(AppRoutes.Register)} className="rounded-md bg-gray-900 text-white px-5 py-2.5 hover:bg-gray-800 transition">
								Get started
							</button>
							<button onClick={() => navigate(AppRoutes.Login)} className="rounded-md border px-5 py-2.5 hover:bg-gray-50 transition">
								Sign in
							</button>
						</div>
					</div>
					<div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-right-8 duration-700">
						<HomeProductGrid />
					</div>
				</div>
			</section>
		</div>
	)
}

export default HomePage

