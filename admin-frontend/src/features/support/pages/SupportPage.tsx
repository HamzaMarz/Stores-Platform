import React from 'react'
import Pagination from '@/components/Pagination'
import { useSupportTickets } from '@/features/support/hooks/useSupport'
import { Link } from 'react-router-dom'

const PAGE = 10

const SupportPage: React.FC = () => {
  const [status, setStatus] = React.useState('OPEN')
  const [page, setPage] = React.useState(1)
  const offset = (page - 1) * PAGE
  const { data, isLoading } = useSupportTickets(status || undefined, offset, PAGE)

  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">Support Tickets</h1>
      <div className="flex items-end gap-2 mb-3">
        <div>
          <label className="block text-sm mb-1">Status</label>
          <input className="border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="OPEN/CLOSED" />
        </div>
      </div>
      {isLoading && <div>Loading...</div>}
      {data && (
        <>
          <table className="min-w-full border">
            <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left border-b">ID</th><th className="px-3 py-2 text-left border-b">User</th><th className="px-3 py-2 text-left border-b">Subject</th><th className="px-3 py-2 text-left border-b">Status</th><th className="px-3 py-2 text-left border-b">Created</th><th className="px-3 py-2 text-left border-b">Actions</th></tr></thead>
            <tbody>
              {data.data.map(t => (
                <tr key={t.id} className="odd:bg-white even:bg-slate-50/50">
                  <td className="px-3 py-2 border-b">{t.id}</td>
                  <td className="px-3 py-2 border-b">{t.user_id}</td>
                  <td className="px-3 py-2 border-b">{t.subject}</td>
                  <td className="px-3 py-2 border-b">{t.status}</td>
                  <td className="px-3 py-2 border-b">{t.created_at && new Date(t.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2 border-b">
                    <Link to={`/support/${t.id}`} className="px-2 py-1 rounded bg-slate-800 text-white">Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} pageSize={PAGE} total={data.count} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}

export default SupportPage


