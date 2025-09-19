import React, { useMemo } from 'react'
import ProductGrid from '../components/ProductGrid'
import ProductFilter from '../components/ProductFilter'
import { useAllProducts } from '../hooks/useProducts'
import { motion } from "framer-motion";

const DEFAULT_LIMIT = 24

const ProductsPage: React.FC = () => {
    const { products, count, isLoading, isLoadingMore, error, hasMore, params, setParams, loadMore, reset } = useAllProducts({
        category: 'all',
        discount: false,
        offset: 0,
        limit: DEFAULT_LIMIT,
        order: { column: 'sell_count', direction: 'desc' },
    })

    const appliedFiltersCount = useMemo(() => {
        let n = 0
        if (params.category && params.category !== 'all') n++
        if (params.discount) n++
        return n
    }, [params])

    return (
        <div className="container px-4 py-6 mx-auto">
            <div className="flex flex-col items-center text-center">
                <motion.h1
                    whileTap={{ scale: 1.1 }}
                    className="text-5xl md:text-6xl font-extrabold mb-4 
                   inline-block px-6 py-3 rounded-2xl 
                   cursor-pointer transition-all duration-300
                   hover:scale-110 hover:[text-shadow:_0_0_20px_rgb(255_165_0_/_90%)]"
                >
                    Browse Products
                </motion.h1>

                <p className="mt-2 max-w-xl text-lg text-gray-600">
                    Discover amazing deals and the latest items just for you ✨
                </p>
            </div>

            <ProductFilter
                params={params}
                onChange={setParams}
                onReset={reset}
                total={count}
                appliedFiltersCount={appliedFiltersCount}
            />

            {error && (
                <div className="p-4 mt-4 text-rose-700 bg-rose-50 rounded-lg">{error}</div>
            )}

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

export default ProductsPage


