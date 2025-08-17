import type React from 'react'
import type { Product } from '../hooks/useProducts'

type Props = { product: Product }

const ProductCard: React.FC<Props> = ({ product }) => {
	return (
		<div className="group rounded-xl border bg-white p-3 shadow-sm transition hover:shadow-md animate-in fade-in duration-500">
			<div className="aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
				<img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
			</div>
			<div className="mt-3">
				<p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
				<p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
				<button className="mt-2 w-full rounded-md bg-gray-900 text-white py-2 hover:bg-gray-800 transition">
					Add to cart
				</button>
			</div>
		</div>
	)
}

export default ProductCard

