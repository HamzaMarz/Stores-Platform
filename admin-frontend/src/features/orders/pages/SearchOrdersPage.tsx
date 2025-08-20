import React from 'react'
import Pagination from '@/components/Pagination'
import { useSearchOrders } from '@/features/orders/hooks/useSearchOrders'

const PAGE_SIZE = 10

const SearchOrdersPage: React.FC = () => {
  const [userId, setUserId] = React.useState('')
  const [status, setStatus] = React.useState('')
  const [page, setPage] = React.useState(1)
  const { result, loading, search } = useSearchOrders()

  const fetchPage = async (pageToLoad: number) => {
    if (!userId) return
    const offset = (pageToLoad - 1) * PAGE_SIZE
    await search(Number(userId), status || undefined, offset, PAGE_SIZE)
    setPage(pageToLoad)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPage(1)
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">Search Orders</h1>
      <form onSubmit={onSubmit} className="flex gap-2 items-end mb-4">
        <div>
          <label className="block text-sm mb-1">User ID</label>
          <input className="border rounded px-3 py-2" value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Status (optional)</label>
          <input className="border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="e.g. CONFIRMED" />
        </div>
        <button type="submit" className="px-4 py-2 rounded bg-slate-800 text-white" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
      </form>

      {result && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-3 py-2 border-b">ID</th>
                  <th className="text-left px-3 py-2 border-b">User</th>
                  <th className="text-left px-3 py-2 border-b">Total</th>
                  <th className="text-left px-3 py-2 border-b">Status</th>
                  <th className="text-left px-3 py-2 border-b">Created</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((r) => (
                  <tr key={r.id} className="odd:bg-white even:bg-slate-50/50">
                    <td className="px-3 py-2 border-b">{r.id}</td>
                    <td className="px-3 py-2 border-b">{r.user_id}</td>
                    <td className="px-3 py-2 border-b">{(r.total ?? 0).toFixed(2)}</td>
                    <td className="px-3 py-2 border-b">{r.status}</td>
                    <td className="px-3 py-2 border-b">{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={PAGE_SIZE} total={result.count} onPageChange={fetchPage} />
        </>
      )}
    </div>
  )
}

export default SearchOrdersPage


