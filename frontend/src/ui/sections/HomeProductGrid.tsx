import React from 'react'
import { useProducts } from '../../features/catalog/hooks/useProducts'
import ProductCard from '../../features/catalog/components/ProductCard'
import Skeleton from '../../components/Skeleton'

const HomeProductGrid: React.FC = () => {
	const { data, isLoading } = useProducts()

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className="rounded-xl border bg-white p-3">
						<Skeleton className="aspect-[4/5]" />
						<Skeleton className="mt-3 h-4 w-3/4" />
						<Skeleton className="mt-2 h-3 w-1/2" />
						<Skeleton className="mt-3 h-9 w-full" />
					</div>
				))}
			</div>
		)
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			{data?.map((p) => (
				<ProductCard key={p.id} product={p} />
			))}
		</div>
	)
}

export default HomeProductGrid

