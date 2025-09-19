import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import ProductGrid from '../components/ProductGrid'
import { useSearchProducts, type ProductOrder } from '../hooks/useProducts'
import { Categories, CategoryLabels } from '../../../constants/categories'

const DEFAULT_LIMIT = 24

const orders: { label: string; value: ProductOrder }[] = [
    { label: 'Most Popular', value: { column: 'sell_count', direction: 'desc' } },
    { label: 'Top Rated', value: { column: 'rating', direction: 'desc' } },
    { label: 'Newest', value: { column: 'id', direction: 'desc' } },
    { label: 'Price: Low to High', value: { column: 'price', direction: 'asc' } },
    { label: 'Price: High to Low', value: { column: 'price', direction: 'desc' } },
]

const AdvancedSearchPage: React.FC = () => {
    const categories = useMemo(() => ['all', ...Categories], [])

    const { products, isLoading, isLoadingMore, error, hasMore, params, setParams, loadMore, reset } = useSearchProducts({
        category: 'all',
        in_stock: undefined,
        discount: { min: 0, max: 100 },
        price: { min: 0, max: 1000000000 },
        offset: 0,
        limit: DEFAULT_LIMIT,
        order: { column: 'sell_count', direction: 'desc' },
        term: '',
    })

    const appliedFiltersCount = useMemo(() => {
        let n = 0
        if (params.category && params.category !== 'all') n++
        if (params.in_stock !== undefined) n++
        if (params.discount) n++
        if (params.price) n++
        if (params.term && params.term.trim().length >= 3) n++
        return n
    }, [params])

    return (
        <div className="container px-4 py-10 mx-auto bg-gradient-to-b from-white to-blue-50/40">
            <div className="flex flex-col items-center text-center">
                <motion.h1
                    whileTap={{ scale: 1.05 }}
                    className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent"
                >
                    Advanced Product Search
                </motion.h1>
                <p className="mt-1 max-w-2xl text-base md:text-lg text-gray-600">
                    Find exactly what you need using smart filters and live results.
                </p>
            </div>

            <div className="mt-8 rounded-2xl border border-white/60 bg-white/70 backdrop-blur shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-semibold">Search term</label>
                        <input
                            type="text"
                            value={params.term}
                            onChange={e => setParams(prev => ({ ...prev, term: e.target.value }))}
                            placeholder="Type at least 3 characters"
                            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-semibold">Category</label>
                        <select
                            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                            value={params.category}
                            onChange={e => setParams(prev => ({ ...prev, category: e.target.value }))}
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>
                                    {CategoryLabels[c as keyof typeof CategoryLabels]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-semibold">Sort By</label>
                        <select
                            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                            value={`${params.order.column}:${params.order.direction}`}
                            onChange={e => {
                                const [column, direction] = e.target.value.split(':') as [ProductOrder['column'], ProductOrder['direction']]
                                setParams(prev => ({ ...prev, order: { column, direction } }))
                            }}
                        >
                            {orders.map(o => (
                                <option key={`${o.value.column}:${o.value.direction}`} value={`${o.value.column}:${o.value.direction}`}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mt-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-semibold">In Stock</label>
                        <select
                            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                            value={String(params.in_stock)}
                            onChange={e => {
                                const v = e.target.value
                                setParams(prev => ({ ...prev, in_stock: v === 'undefined' ? undefined : v === 'true' }))
                            }}
                        >
                            <option value="undefined">Any</option>
                            <option value="true">In stock</option>
                            <option value="false">Out of stock</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-semibold">Discount range (%)</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Min"
                                value={params.discount?.min ?? ''}
                                onChange={e => {
                                    const min = e.target.value === '' ? undefined : Number(e.target.value)
                                    setParams(prev => ({ ...prev, discount: min === undefined && prev.discount?.max === undefined ? undefined : { min: min ?? 0, max: prev.discount?.max ?? 100 } }))
                                }}
                                className="px-4 py-2.5 w-full rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                            />
                            <input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Max"
                                value={params.discount?.max ?? ''}
                                onChange={e => {
                                    const max = e.target.value === '' ? undefined : Number(e.target.value)
                                    setParams(prev => ({ ...prev, discount: max === undefined && prev.discount?.min === undefined ? undefined : { min: prev.discount?.min ?? 0, max: max ?? 100 } }))
                                }}
                                className="px-4 py-2.5 w-full rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-semibold">Price range</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min={0}
                                placeholder="Min"
                                value={params.price?.min ?? ''}
                                onChange={e => {
                                    const min = e.target.value === '' ? undefined : Number(e.target.value)
                                    setParams(prev => ({ ...prev, price: min === undefined && prev.price?.max === undefined ? undefined : { min: min ?? 0, max: prev.price?.max ?? 0 } }))
                                }}
                                className="px-4 py-2.5 w-full rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                            />
                            <input
                                type="number"
                                min={0}
                                placeholder="Max"
                                value={params.price?.max ?? ''}
                                onChange={e => {
                                    const max = e.target.value === '' ? undefined : Number(e.target.value)
                                    setParams(prev => ({ ...prev, price: max === undefined && prev.price?.min === undefined ? undefined : { min: prev.price?.min ?? 0, max: max ?? 0 } }))
                                }}
                                className="px-4 py-2.5 w-full rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 items-center">
                    {appliedFiltersCount > 0 && (
                        <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-50 border border-blue-100 rounded-full shadow-sm">
                            {appliedFiltersCount} filters applied
                        </span>
                    )}
                    <button
                        onClick={reset}
                        className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 transition hover:shadow-blue-500/30 hover:translate-y-[-1px]"
                    >
                        Reset filters
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 mt-4 text-rose-700 bg-rose-50 rounded-lg">{error}</div>
            )}

            {/* Show a friendly hint instead of empty state when term is too short */}
            {!isLoading && (!params.term || params.term.trim().length < 3) ? (
                <div className="px-[20%] py-20 text-center">
                    <p className="text-2xl font-semibold text-gray-500">Start typing to search</p>
                    <p className="mt-2 text-gray-400">Please type at least 3 characters to begin searching.</p>
                </div>
            ) : (
                <div className="mt-6">
                    <ProductGrid
                        products={products}
                        isLoading={isLoading}
                        hasMore={hasMore}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={loadMore}
                    />
                </div>
            )}
        </div>
    )
}

export default AdvancedSearchPage


