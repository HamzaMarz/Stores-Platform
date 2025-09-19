import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Product } from '../hooks/useProducts'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '../../../constants/app'
import QuickMessageModal from '../../chat/components/QuickMessageModal'

interface ProductInfoProps {
	product: Product
}


const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
	const [quantity, setQuantity] = useState(1)
	const [showQuickMessage, setShowQuickMessage] = useState(false)
	const navigate = useNavigate()
	
	const priceNum = typeof product.price === 'number' ? product.price : null
	const discountNum = typeof product.discount === 'number' ? product.discount : 0
	const discountedPrice = priceNum != null ? priceNum * (1 - (discountNum || 0) / 100) : null
	const hasDiscount = priceNum != null && discountNum > 0

	const availableStock = product.in_stock ? 10 : 0

	const handleQuantityChange = (value: number) => {
		const newQuantity = Math.max(1, Math.min(value, availableStock)) // Limit based on available stock
		setQuantity(newQuantity)
	}

	const handleAddToCart = () => {
		// TODO: Add to cart functionality
		console.log('Add to cart:', { productId: product.id, quantity })
	}

	const handleShare = async () => {
		try {
			if (navigator.share) {
				await navigator.share({
					title: product.name,
					text: `Check out this amazing product: ${product.name}`,
					url: window.location.href,
				})
			} else {
				await navigator.clipboard.writeText(window.location.href)
				alert('Link copied to clipboard!')
			}
		} catch (error) {
			console.error('Error sharing:', error)
		}
	}

	const handleStoreClick = () => {
		const storeId = product?.product_owner?.store_id as number | undefined
		if (!storeId) return
		navigate(AppRoutes.Store.replace(':id', String(storeId)))
	}

	const handleNavigateToChat = () => {
		navigate(AppRoutes.Chat)
	}

	return (
		<motion.div 
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col p-6 bg-white rounded-lg shadow-lg"
		>
			{/* Product Title */}
			<motion.h1 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="mb-2 text-3xl font-extrabold text-gray-900 lg:text-4xl"
			>
				{product.name}
			</motion.h1>
			
			{/* Rating */}
			<motion.div 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
				className="flex items-center mb-4"
			>
				<div className="flex items-center">
					{[...Array(5)].map((_, i) => (
						<motion.svg 
							key={i} 
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.4 + i * 0.1 }}
							className={`w-5 h-5 ${i < Math.round(product.rating as number) ? 'text-yellow-400' : 'text-gray-300'}`} 
							fill="currentColor" 
							viewBox="0 0 20 20"
						>
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
						</motion.svg>
					))}
				</div>
				<p className="ml-2 text-sm text-gray-500">
					{typeof product.rating === 'number' ? product.rating.toFixed(1) : '—'} ({product.rating_count} reviews)
				</p>
			</motion.div>

			<motion.p 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
				className="mb-6 leading-relaxed text-gray-600"
			>
				{product.description}
			</motion.p>
			
			<motion.div 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
				className="mb-6"
			>
				<div className="flex gap-3 items-center">
					<span className="text-4xl font-bold text-blue-600">
						${discountedPrice != null ? discountedPrice.toFixed(2) : '—'}
					</span>
					{hasDiscount && (
						<motion.span 
							initial={{ scale: 0, rotate: -180 }}
							animate={{ scale: 1, rotate: 0 }}
							transition={{ 
								delay: 0.6, 
								type: "spring", 
								stiffness: 200 
							}}
							className="flex gap-1 items-center px-3 py-1 text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg"
						>
							<span>🎉</span> -{discountNum}%
						</motion.span>
					)}
				</div>
				{hasDiscount && (
					<span className="text-xl text-gray-400 line-through">
						${priceNum != null ? priceNum.toFixed(2) : '—'}
					</span>
				)}
			</motion.div>

			<motion.div 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.6 }}
				className="py-4 mb-6 border-t border-b border-gray-200"
			>
				<div className="flex justify-between items-center mb-3">
					<span className="font-bold text-gray-700">Store:</span>
					{product?.product_owner?.store_id ? (
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleStoreClick}
							className="flex gap-2 items-center px-3 py-2 rounded-lg transition-colors hover:bg-gray-100"
						>
							<div className="flex justify-center items-center w-8 h-8 text-sm font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 rounded-full">
								S
							</div>
							<span className="font-medium text-gray-600">
								Store
							</span>
							<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
							</svg>
						</motion.button>
					) : (
						<span className="font-medium text-gray-500 cursor-not-allowed">This seller has no store</span>
					)}
				</div>
				<div className="flex justify-between items-center mb-2">
					<span className="font-bold text-gray-700">Category:</span>
					<span className="text-gray-600">{product.category}</span>
				</div>
				<div className="flex justify-between items-center mb-3">
					<span className="font-bold text-gray-700">Sales:</span>
					<span className="text-gray-600">{product.sell_count} items</span>
				</div>
				
				{/* Quick Message Button */}
				<div className="pt-3 border-t border-gray-100">
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => setShowQuickMessage(true)}
						className="w-full flex gap-2 justify-center items-center px-4 py-3 font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg transition-all hover:from-green-600 hover:to-green-700 shadow-md"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
						</svg>
						Quick Message to Seller
					</motion.button>
				</div>
			</motion.div>

			<motion.div 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.7 }}
				className="py-4 mb-6 border-t border-b border-gray-200"
			>
				<div className="flex gap-2 items-center mb-2">
					<label className="font-bold text-gray-700">Quantity:</label>
					<div className="flex items-center rounded-md border border-gray-300">
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => handleQuantityChange(quantity - 1)}
							className="px-3 py-1 transition-colors hover:bg-gray-100"
							disabled={quantity <= 1 || !product.in_stock}
						>
							-
						</motion.button>
						<input 
							type="number" 
							value={quantity}
							onChange={(e) => handleQuantityChange(Number(e.target.value))}
							className="py-1 w-16 text-center border-gray-300 border-x"
							min="1"
							max={availableStock}
							disabled={!product.in_stock}
						/>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => handleQuantityChange(quantity + 1)}
							className="px-3 py-1 transition-colors hover:bg-gray-100"
							disabled={quantity >= availableStock || !product.in_stock}
						>
							+
						</motion.button>
					</div>
				</div>
				<div className="flex gap-2 items-center">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.8 }}
						className={`w-3 h-3 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`}
					/>
					<p className={`text-sm font-semibold ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
						{product.in_stock ? `In Stock (${availableStock} available)` : 'Out of Stock'}
					</p>
				</div>
			</motion.div>

			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.8 }}
				className="flex flex-col gap-3 sm:flex-row"
			>
				<motion.button 
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					disabled={!product.in_stock} 
					onClick={handleAddToCart}
					className="flex flex-grow gap-2 justify-center items-center px-6 py-3 w-full font-bold text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					<svg className="w-6 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
					</svg>
					Add to Cart
				</motion.button>
				
				<motion.button 
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleShare}
					className="p-3 rounded-lg border border-gray-300 transition-colors hover:bg-gray-100 hover:text-blue-500"
					title="Share Product"
				>
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
					</svg>
				</motion.button>
			</motion.div>
			
			{/* Quick Message Modal */}
			<QuickMessageModal
				isOpen={showQuickMessage}
				onClose={() => setShowQuickMessage(false)}
				product={product}
				onNavigateToChat={handleNavigateToChat}
			/>
		</motion.div>
	)
}

export default ProductInfo
