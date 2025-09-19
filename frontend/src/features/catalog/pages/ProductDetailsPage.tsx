import React from 'react'
import { useParams } from 'react-router-dom'
import { useProductDetails } from '../hooks/useProducts'
import ProductGallery from '../components/ProductGallery'
import ProductInfo from '../components/ProductInfo'
import Skeleton from '../../../components/Skeleton'

const ProductDetailsPage: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const productId = id ? parseInt(id) : 0
	
	const { data, isLoading, error } = useProductDetails(productId)

	if (isLoading) {
		return (
			<div className="container p-4 mx-auto lg:p-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
					<div className="p-4 bg-white rounded-lg shadow-lg">
						<Skeleton className="w-full h-[400px] mb-3" />
						<div className="flex gap-3">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className="w-20 h-20" />
							))}
						</div>
					</div>
					<div className="p-6 bg-white rounded-lg shadow-lg">
						<Skeleton className="mb-4 w-3/4 h-8" />
						<Skeleton className="mb-6 w-1/2 h-6" />
						<Skeleton className="mb-2 w-full h-4" />
						<Skeleton className="mb-2 w-full h-4" />
						<Skeleton className="mb-6 w-2/3 h-4" />
						<Skeleton className="mb-6 w-1/3 h-12" />
						<Skeleton className="mb-6 w-full h-20" />
						<Skeleton className="w-full h-12" />
					</div>
				</div>
			</div>
		)
	}

	if (error || !data?.data) {
		return (
			<div className="container p-4 mx-auto lg:p-8">
				<div className="py-8 text-center">
					<div className="mb-4">
						<svg className="mx-auto w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
						</svg>
					</div>
					<p className="mb-2 text-xl font-semibold text-red-500">
						{error || 'Error loading product details'}
					</p>
					<p className="mt-2 text-gray-600">
						{error?.includes('invalid') 
							? 'Please check the product ID in the URL'
							: 'Product not found or has been deleted'
						}
					</p>
					<div className="mt-6">
						<button 
							onClick={() => window.history.back()}
							className="px-6 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		)
	}

	const product = data.data

	return (
		<div className="container p-4 mx-auto lg:p-8">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
				<ProductGallery 
					images={product.images} 
					productName={product.name}
					discount={product.discount}
					inStock={product.in_stock}
				/>

				<ProductInfo product={product} />
			</div>
		</div>
	)
}

export default ProductDetailsPage
