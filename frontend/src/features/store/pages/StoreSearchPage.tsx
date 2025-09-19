import React, { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useStoreSearch, type StoreOrder } from '../hooks/useStoreSearch'
import { AppRoutes } from '../../../constants/app'

const DEFAULT_LIMIT = 24

const orders: { label: string; value: StoreOrder }[] = [
    { label: 'Top Rated', value: { column: 'rating', direction: 'desc' } },
    { label: 'A → Z', value: { column: 'store_name', direction: 'asc' } },
    { label: 'Most Products', value: { column: 'product_count', direction: 'desc' } },
]

const StoreSearchPage: React.FC = () => {
    const [sp, setSp] = useSearchParams()
    const q = sp.get('q') || ''
    const { stores, isLoading, isLoadingMore, hasMore, error, params, setParams, loadMore } = useStoreSearch({ term: q, offset: 0, limit: DEFAULT_LIMIT, order: { column: 'rating', direction: 'desc' } })

    const applied = useMemo(() => (q.trim().length >= 2 ? 1 : 0), [q])

    return (
        <div className="container px-4 py-10 mx-auto">
            <h1 className="text-3xl font-bold">Search Stores</h1>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                    <input
                        value={params.term}
                        onChange={(e) => { setParams(prev => ({ ...prev, term: e.target.value })); setSp({ q: e.target.value }) }}
                        placeholder="Search stores by name"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                    />
                </div>
                <div className="flex">
                    <select
                        className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                        value={`${params.order.column}:${params.order.direction}`}
                        onChange={e => {
                            const [column, direction] = e.target.value.split(':') as [StoreOrder['column'], StoreOrder['direction']]
                            setParams(prev => ({ ...prev, order: { column, direction } }))
                        }}
                    >
                        {orders.map(o => (
                            <option key={`${o.value.column}:${o.value.direction}`} value={`${o.value.column}:${o.value.direction}`}>{o.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {(!params.term || params.term.trim().length < 2) && (
                <div className="px-[20%] py-20 text-center">
                    <p className="text-2xl font-semibold text-gray-500">Start typing to search stores</p>
                    <p className="mt-2 text-gray-400">Please type at least 2 characters to begin searching.</p>
                </div>
            )}

            {error && <div className="p-4 mt-4 text-rose-700 bg-rose-50 rounded-lg">{error}</div>}

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map(s => (
                    <Link key={s.id} to={AppRoutes.Store.replace(':id', String(s.id))} className="p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <img src={s.logo || '/logo/icon.ico'} alt={s.store_name} className="w-14 h-14 rounded-full object-cover" />
                            <div className="min-w-0">
                                <div className="font-semibold truncate">{s.store_name}</div>
                                <div className="text-sm text-gray-500">{s.product_count} products • ⭐ {s.rating?.toFixed?.(1) || 0} ({s.rating_count})</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-8">
                    <button className="px-5 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700" onClick={loadMore} disabled={isLoadingMore}>
                        {isLoadingMore ? 'Loading...' : 'Load more stores'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default StoreSearchPage


