import React, { useMemo } from 'react'
import ProductGrid from '../components/ProductGrid'
import ProductFilter from '../components/ProductFilter'
import { useAllProducts } from '../hooks/useProducts'

const DEFAULT_LIMIT = 24

const FeaturedProductsPage: React.FC = () => {
    const { products, count, isLoading, isLoadingMore, hasMore, params, setParams, loadMore, reset } = useAllProducts({
        category: 'all',
        discount: true,
        offset: 0,
        limit: DEFAULT_LIMIT,
        order: { column: 'sell_count', direction: 'desc' },
    })

    const appliedFiltersCount = useMemo(() => {
        let n = 0
        if (params.category && params.category !== 'all') n++
        // if (params.discount) n++
        return n
    }, [params])

    return (
        <div className="container px-4 py-6 mx-auto text-center">
            <h1
                className="inline-block relative mb-2 text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-transparent hover:from-blue-500 hover:via-green-500 hover:to-yellow-500 hover:border-b-4 hover:border-gradient-to-r hover:border-pink-500"
            >
                Featured Products
            </h1>

            <p className="mt-3 text-lg text-gray-600">
                Discover the best deals and top-rated products just for you ✨
            </p>
            <ProductFilter
                params={params}
                onChange={setParams}
                onReset={reset}
                total={count}
                appliedFiltersCount={appliedFiltersCount}
                isFeaturedPage={true}
            />

            <div className="mt-6">
                <ProductGrid
                    products={products}
                    isLoading={isLoading}
                    hasMore={hasMore}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={loadMore}
                />
            </div>
        </div>
    )
}

export default FeaturedProductsPage


