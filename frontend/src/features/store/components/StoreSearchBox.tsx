import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '../../../constants/app'
import { useStoreSearch } from '../hooks/useStoreSearch'

interface Props {
    mode: 'inline' | 'icon'
}

const StoreSearchBox: React.FC<Props> = ({ mode }) => {
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(mode === 'inline')
    const [term, setTerm] = React.useState('')
    const { stores, isLoading } = useStoreSearch({ term, offset: 0, limit: 7, order: { column: 'rating', direction: 'desc' } }, 200)

    const goFull = () => {
        if (!term.trim()) return
        navigate(AppRoutes.StoreSearch + `?q=${encodeURIComponent(term.trim())}`)
        setOpen(false)
    }

    return (
        <div className="relative">
            {mode === 'icon' && (
                <button onClick={() => setOpen(v => !v)} className="rounded-full border px-3 py-1.5 hover:bg-gray-50">Search stores</button>
            )}
            {open && (
                <div className={mode === 'inline' ? '' : 'absolute right-0 mt-2 w-80 p-3 bg-white rounded-xl border shadow-xl'}>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white/70 focus-within:ring-2 focus-within:ring-blue-200">
                        <input
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            placeholder="Search stores..."
                            className="bg-transparent outline-none text-sm flex-1"
                        />
                        <button className="text-blue-600 font-semibold text-sm" onClick={goFull}>Search</button>
                    </div>
                    {term.trim().length >= 2 && (
                        <div className="mt-2">
                            {isLoading ? (
                                <div className="px-3 py-2 text-gray-500 text-sm">Loading...</div>
                            ) : (
                                <ul className="max-h-80 overflow-auto divide-y">
                                    {stores.map(s => (
                                        <li key={s.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(AppRoutes.Store.replace(':id', String(s.id)))}>
                                            <img src={s.logo || '/logo/icon.ico'} alt={s.store_name} className="w-8 h-8 rounded-full object-cover" />
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium truncate">{s.store_name}</div>
                                                <div className="text-xs text-gray-500">{s.product_count} products • ⭐ {s.rating?.toFixed?.(1) || 0}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {stores.length === 7 && (
                                <button className="w-full mt-2 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg" onClick={goFull}>Show more</button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default StoreSearchBox


