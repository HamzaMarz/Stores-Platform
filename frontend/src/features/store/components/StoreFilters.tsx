import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORY } from '../../../constants/category'

interface FilterState {
    category: string
    in_stock?: boolean
    price?: { min: number; max: number }
    discount?: { min: number; max: number }
    term?: string
}

interface Props {
    filters: FilterState
    onFiltersChange: (filters: FilterState) => void
    totalProducts: number
}

const StoreFilters: React.FC<Props> = ({ filters, onFiltersChange, totalProducts }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        onFiltersChange({
            ...filters,
            [key]: value
        })
    }

    const clearFilters = () => {
        onFiltersChange({
            category: 'all'
        })
    }

    const hasActiveFilters = filters.category !== 'all' || 
        filters.in_stock !== undefined || 
        filters.price || 
        filters.discount || 
        filters.term

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Filters
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {totalProducts} products
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Clear all
                            </button>
                        )}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={filters.term || ''}
                        onChange={(e) => handleFilterChange('term', e.target.value || undefined)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category
                                </label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">All Categories</option>
                                    {Object.entries(CATEGORY).map(([key, value]) => (
                                        <option key={key} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Stock Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Stock Status
                                </label>
                                <select
                                    value={filters.in_stock === undefined ? 'all' : filters.in_stock.toString()}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        handleFilterChange('in_stock', value === 'all' ? undefined : value === 'true')
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">All Products</option>
                                    <option value="true">In Stock</option>
                                    <option value="false">Out of Stock</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Price Range
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.price?.min || ''}
                                        onChange={(e) => {
                                            const min = e.target.value ? Number(e.target.value) : undefined
                                            handleFilterChange('price', {
                                                min: min || 0,
                                                max: filters.price?.max || 1000
                                            })
                                        }}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.price?.max || ''}
                                        onChange={(e) => {
                                            const max = e.target.value ? Number(e.target.value) : undefined
                                            handleFilterChange('price', {
                                                min: filters.price?.min || 0,
                                                max: max || 1000
                                            })
                                        }}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Discount Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Discount Range (%)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        min="0"
                                        max="100"
                                        value={filters.discount?.min || ''}
                                        onChange={(e) => {
                                            const min = e.target.value ? Number(e.target.value) : undefined
                                            handleFilterChange('discount', {
                                                min: min || 0,
                                                max: filters.discount?.max || 100
                                            })
                                        }}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        min="0"
                                        max="100"
                                        value={filters.discount?.max || ''}
                                        onChange={(e) => {
                                            const max = e.target.value ? Number(e.target.value) : undefined
                                            handleFilterChange('discount', {
                                                min: filters.discount?.min || 0,
                                                max: max || 100
                                            })
                                        }}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default StoreFilters
