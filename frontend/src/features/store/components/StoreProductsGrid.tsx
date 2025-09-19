import React from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../../catalog/components/ProductCard'
import type { StoreProduct } from '../types'

interface Props {
    products: StoreProduct[]
    isLoading: boolean
    sortBy: string
    sortDirection: 'asc' | 'desc'
    onSortChange: (column: string, direction: 'asc' | 'desc') => void
    hasMore?: boolean
    onLoadMore?: () => void
    totalProducts?: number
}

const StoreProductsGrid: React.FC<Props> = ({ 
    products, 
    isLoading, 
    sortBy, 
    sortDirection, 
    onSortChange,
    hasMore = false,
    onLoadMore,
    totalProducts = 0
}) => {
    const handleSort = (column: string) => {
        const newDirection = sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc'
        onSortChange(column, newDirection)
    }

    const SortButton: React.FC<{ column: string; label: string }> = ({ column, label }) => (
        <button
            onClick={() => handleSort(column)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                sortBy === column
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
        >
            {label}
            {sortBy === column && (
                <svg
                    className={`w-4 h-4 transition-transform ${
                        sortDirection === 'desc' ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            )}
        </button>
    )

    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Loading Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                        >
                            <div className="animate-pulse">
                                <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
            >
                <div className="w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No products found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your filters or search terms
                </p>
            </motion.div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Sort Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sort by:
                    </span>
                    <SortButton column="name" label="Name" />
                    <SortButton column="price" label="Price" />
                    <SortButton column="rating" label="Rating" />
                    <SortButton column="sell_count" label="Popularity" />
                    <SortButton column="id" label="Newest" />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {products.length} of {totalProducts} products
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && onLoadMore && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center pt-6"
                >
                    <motion.button
                        onClick={onLoadMore}
                        disabled={isLoading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Loading...
                            </div>
                        ) : (
                            'Load More Products'
                        )}
                    </motion.button>
                </motion.div>
            )}

            {/* End of products message */}
            {!hasMore && products.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6"
                >
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        🎉 You've reached the end! All {totalProducts} products are displayed.
                    </div>
                </motion.div>
            )}
        </div>
    )
}

export default StoreProductsGrid
