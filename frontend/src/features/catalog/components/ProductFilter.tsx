import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Categories, CategoryLabels } from '../../../constants/categories'
import type { Category } from '../../../constants/categories'
import type { ProductsAllParams, ProductOrder } from '../hooks/useProducts'
import { FiFilter, FiX, FiCheck } from 'react-icons/fi'

interface Props {
    params: ProductsAllParams
    onChange: (updater: (prev: ProductsAllParams) => ProductsAllParams) => void
    onReset: () => void
    total: number
    appliedFiltersCount: number
    isFeaturedPage?: boolean
}

const orders: { label: string; value: ProductOrder }[] = [
    { label: 'Most Popular', value: { column: 'sell_count', direction: 'desc' } },
    { label: 'Top Rated', value: { column: 'rating', direction: 'desc' } },
    { label: 'Newest', value: { column: 'id', direction: 'desc' } },
    { label: 'Price: Low to High', value: { column: 'price', direction: 'asc' } },
    { label: 'Price: High to Low', value: { column: 'price', direction: 'desc' } },
]

const ProductFilter: React.FC<Props> = ({
    params,
    onChange,
    onReset,
    total,
    appliedFiltersCount,
    isFeaturedPage = false,
}) => {
    const categories = useMemo(() => ['all', ...Categories] as Category[], [])
    const [showFilters, setShowFilters] = useState(true)

    const toggleFilters = () => setShowFilters(prev => !prev)

    return (
        <div className="container relative px-4 py-4 mx-auto">
            {/* Filter Icon in top-left */}
            <div className="absolute top-0 left-0 z-20 mt-4 ml-4">
                <div className="relative cursor-pointer group" onClick={toggleFilters}>
                    <FiFilter
                        className={`text-2xl transition-transform duration-300 ${showFilters ? 'text-red-500 scale-110' : 'text-gray-700 scale-100'
                            }`}
                    />
                    {showFilters && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-[2px] bg-black"></div>
                    )}
                    {appliedFiltersCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {appliedFiltersCount}
                        </span>
                    )}
                    {/* Tooltip info */}
                    <div className="absolute -top-8 left-12 px-2 py-1 w-36 text-xs text-white bg-gray-400 rounded opacity-0 transition-opacity -translate-x-1/2 group-hover:opacity-100">
                        {showFilters ? 'Click to hide filters' : 'Click to show filters'}
                    </div>
                </div>
            </div>

            {/* Filters Section with animation */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex gap-6 mt-8 w-full origin-top"
                    >
                        {/* Left: Filters */}
                        <div className="flex flex-wrap flex-1 gap-4 p-4 rounded-xl shadow-md backdrop-blur-md bg-white/30">
                            {/* Category */}
                            <div className="flex flex-col w-full md:w-auto">
                                <label className="mb-1 text-sm font-semibold">Category</label>
                                <select
                                    className="px-4 py-2 w-full rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:w-60"
                                    value={params.category}
                                    onChange={e =>
                                        onChange(prev => ({ ...prev, category: e.target.value }))
                                    }
                                >
                                    {categories.map(c => (
                                        <option key={c} value={c}>
                                            {CategoryLabels[c]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Discount */}
                            <div className="flex gap-2 items-center">
                                <label
                                    className={`flex gap-2 items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${isFeaturedPage
                                            ? 'opacity-60 cursor-not-allowed bg-gray-200'
                                            : params.discount
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100'
                                        } cursor-pointer`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={Boolean(params.discount)}
                                        disabled={isFeaturedPage}
                                        className="hidden"
                                        onChange={e => {
                                            if (!isFeaturedPage) {
                                                onChange(prev => ({ ...prev, discount: e.target.checked }))
                                            }
                                        }}
                                    />
                                    {params.discount && <FiCheck />}
                                    {isFeaturedPage ? 'Featured Products' : 'Discount only'}
                                </label>
                            </div>

                            {/* Order */}
                            <div className="flex flex-col w-full md:w-auto">
                                <label className="mb-1 text-sm font-semibold">Sort By</label>
                                <select
                                    className="px-4 py-2 w-full rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:w-60"
                                    value={`${params.order.column}:${params.order.direction}`}
                                    onChange={e => {
                                        const [column, direction] = e.target.value.split(
                                            ':'
                                        ) as [ProductOrder['column'], ProductOrder['direction']]
                                        onChange(prev => ({ ...prev, order: { column, direction } }))
                                    }}
                                >
                                    {orders.map(o => (
                                        <option
                                            key={`${o.value.column}:${o.value.direction}`}
                                            value={`${o.value.column}:${o.value.direction}`}
                                        >
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Right: Active Filters + Reset + Total */}
                        <div className="flex flex-col gap-2 w-1/3">
                            {/* Active Filters */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {params.category && params.category !== 'all' && (
                                    <div className="flex gap-1 items-center px-3 py-1 text-xs text-blue-800 bg-blue-100 rounded-full shadow-sm cursor-pointer">
                                        Category: {CategoryLabels[params.category as Category]}{' '}
                                        <FiX onClick={() => onChange(prev => ({ ...prev, category: 'all' }))} />
                                    </div>
                                )}
                                {params.discount && (
                                    <div className="flex gap-1 items-center px-3 py-1 text-xs text-blue-800 bg-blue-100 rounded-full shadow-sm cursor-pointer">
                                        Discount: Yes{' '}
                                        <FiX onClick={() => onChange(prev => ({ ...prev, discount: false }))} />
                                    </div>
                                )}
                            </div>

                            {/* Products Count */}
                            <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full shadow-sm">
                                {total} products shown
                            </span>

                            {/* Reset Button */}
                            <button
                                onClick={onReset}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-full border border-gray-300 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ProductFilter
