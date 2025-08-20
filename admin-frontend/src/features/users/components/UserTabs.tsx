import React from 'react'
import Pagination from '@/components/Pagination'
import { useUserSessions, useTerminateSession, useTerminateAllSessions } from '@/features/users/hooks/useUserSessions'
import { useUserPaymentMethods, useUserTransactions } from '@/features/users/hooks/useUserPayments'
import { useUserSupport } from '@/features/users/hooks/useUserSupport'
import { useUserRatings, useDeleteRating } from '@/features/users/hooks/useUserRatings'
import { useUserOrders } from '@/features/users/hooks/useUserOrders'

type Props = { userId: number }

const PAGE = 10

const UserTabs: React.FC<Props> = ({ userId }) => {
  const [tab, setTab] = React.useState<'sessions' | 'payments' | 'transactions' | 'support' | 'ratings' | 'orders'>('sessions')

  const [page, setPage] = React.useState(1)
  const offset = (page - 1) * PAGE

  const sessions = useUserSessions(userId, offset, PAGE)
  const terminateSession = useTerminateSession()
  const terminateAll = useTerminateAllSessions()

  const payments = useUserPaymentMethods(userId, offset, PAGE)
  const transactions = useUserTransactions(userId, offset, PAGE)

  const [supportStatus, setSupportStatus] = React.useState<string>('')
  const support = useUserSupport(userId, supportStatus || undefined, offset, PAGE)

  const ratings = useUserRatings(userId, offset, PAGE)
  const deleteRating = useDeleteRating()

  const [orderStatus, setOrderStatus] = React.useState<string>('')
  const orders = useUserOrders(userId, orderStatus || undefined, offset, PAGE)

  React.useEffect(() => { setPage(1) }, [tab])

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {['sessions','payments','transactions','support','ratings','orders'].map((t) => (
          <button key={t} onClick={() => setTab(t as any)} className={`px-3 py-1.5 rounded border ${tab===t ? 'bg-slate-100' : ''}`}>{t}</button>
        ))}
      </div>

      {tab === 'sessions' && (
        <div>
          <div className="flex justify-end mb-2">
            <button className="px-3 py-1.5 rounded border" onClick={() => terminateAll.mutate(userId)} disabled={terminateAll.isPending}>Terminate all</button>
          </div>
          <table className="min-w-full border">
            <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left border-b">ID</th><th className="px-3 py-2 text-left border-b">IP</th><th className="px-3 py-2 text-left border-b">Agent</th><th className="px-3 py-2 text-left border-b">Created</th><th className="px-3 py-2 text-left border-b">Actions</th></tr></thead>
            <tbody>
            {sessions.data?.data.map(s => (
              <tr key={s.id} className="odd:bg-white even:bg-slate-50/50">
                <td className="px-3 py-2 border-b">{s.id}</td>
                <td className="px-3 py-2 border-b">{s.ip}</td>
                <td className="px-3 py-2 border-b">{s.user_agent}</td>
                <td className="px-3 py-2 border-b">{s.created_at && new Date(s.created_at).toLocaleString()}</td>
                <td className="px-3 py-2 border-b"><button className="px-2 py-1 rounded border" onClick={() => terminateSession.mutate(s.id)} disabled={terminateSession.isPending}>Terminate</button></td>
              </tr>
            ))}
            </tbody>
          </table>
          {sessions.data && <Pagination page={page} pageSize={PAGE} total={sessions.data.count} onPageChange={setPage} />}
        </div>
      )}

      {tab === 'payments' && (
        <div>
          <table className="min-w-full border">
            <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left border-b">ID</th><th className="px-3 py-2 text-left border-b">Brand</th><th className="px-3 py-2 text-left border-b">Last4</th><th className="px-3 py-2 text-left border-b">Type</th><th className="px-3 py-2 text-left border-b">Deleted</th><th className="px-3 py-2 text-left border-b">Created</th></tr></thead>
            <tbody>
            {payments.data?.data.map(pm => (
              <tr key={pm.id} className="odd:bg-white even:bg-slate-50/50">
                <td className="px-3 py-2 border-b">{pm.id}</td>
                <td className="px-3 py-2 border-b">{pm.brand}</td>
                <td className="px-3 py-2 border-b">{pm.last4}</td>
                <td className="px-3 py-2 border-b">{pm.type}</td>
                <td className="px-3 py-2 border-b">{pm.deleted ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2 border-b">{pm.created_at && new Date(pm.created_at).toLocaleString()}</td>
              </tr>
            ))}
            </tbody>
          </table>
          {payments.data && <Pagination page={page} pageSize={PAGE} total={payments.data.count} onPageChange={setPage} />}
        </div>
      )}

      {tab === 'transactions' && (
        <div>
          <table className="min-w-full border">
            <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left border-b">ID</th><th className="px-3 py-2 text-left border-b">Amount</th><th className="px-3 py-2 text-left border-b">Currency</th><th className="px-3 py-2 text-left border-b">Status</th><th className="px-3 py-2 text-left border-b">Created</th></tr></thead>
            <tbody>
            {transactions.data?.data.map(tx => (
              <tr key={tx.id} className="odd:bg-white even:bg-slate-50/50">
                <td className="px-3 py-2 border-b">{tx.id}</td>
                <td className="px-3 py-2 border-b">{(tx.amount ?? 0).toFixed(2)}</td>
                <td className="px-3 py-2 border-b">{tx.currency}</td>
                <td className="px-3 py-2 border-b">{tx.status}</td>
                <td className="px-3 py-2 border-b">{tx.created_at && new Date(tx.created_at).toLocaleString()}</td>
              </tr>
            ))}
            </tbody>
          </table>
          {transactions.data && <Pagination page={page} pageSize={PAGE} total={transactions.data.count} onPageChange={setPage} />}
        </div>
      )}

      {tab === 'support' && (
        <div>
          <div className="flex items-end gap-2 mb-2">
            <div>
              <label className="block text-sm mb-1">Status</label>
              <input className="border rounded px-3 py-2" value={supportStatus} onChange={(e) => setSupportStatus(e.target.value)} placeholder="e.g. OPEN" />
            </div>
          </div>
          <table className="min-w-full border">
            <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left border-b">ID</th><th className="px-3 py-2 text-left border-b">Subject</th><th className="px-3 py-2 text-left border-b">Status</th><th className="px-3 py-2 text-left border-b">Created</th></tr></thead>
            <tbody>
            {support.data?.data.map(t => (
              <tr key={t.id} className="odd:bg-white even:bg-slate-50/50">
                <td className="px-3 py-2 border-b">{t.id}</td>
                <td className="px-3 py-2 border-b">{t.subject}</td>
                <td className="px-3 py-2 border-b">{t.status}</td>
                <td className="px-3 py-2 border-b">{t.created_at && new Date(t.created_at).toLocaleString()}</td>
              </tr>
            ))}
            </tbody>
          </table>
          {support.data && <Pagination page={page} pageSize={PAGE} total={support.data.count} onPageChange={setPage} />}
        </div>
      )}

      {tab === 'ratings' && (
        <div>
          <table className="min-w-full border">
            <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left border-b">ID</th><th className="px-3 py-2 text-left border-b">Product</th><th className="px-3 py-2 text-left border-b">Stars</th><th className="px-3 py-2 text-left border-b">Comment</th><th className="px-3 py-2 text-left border-b">Created</th><th className="px-3 py-2 text-left border-b">Actions</th></tr></thead>
            <tbody>
            {ratings.data?.data.map(r => (
              <tr key={r.id} className="odd:bg-white even:bg-slate-50/50">
                <td className="px-3 py-2 border-b">{r.id}</td>
                <td className="px-3 py-2 border-b">{r.product_id}</td>
                <td className="px-3 py-2 border-b">{r.stars}</td>
                <td className="px-3 py-2 border-b">{r.comment}</td>
                <td className="px-3 py-2 border-b">{r.created_at && new Date(r.created_at).toLocaleString()}</td>
                <td className="px-3 py-2 border-b"><button className="px-2 py-1 rounded border" onClick={() => deleteRating.mutate(r.id)} disabled={deleteRating.isPending}>Delete</button></td>
              </tr>
            ))}
            </tbody>
          </table>
          {ratings.data && <Pagination page={page} pageSize={PAGE} total={ratings.data.count} onPageChange={setPage} />}
        </div>
      )}

      {tab === 'orders' && (
        <div>
          <div className="flex items-end gap-2 mb-2">
            <div>
              <label className="block text-sm mb-1">Status</label>
              <input className="border rounded px-3 py-2" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} placeholder="e.g. CONFIRMED" />
            </div>
          </div>
          <table className="min-w-full border">
            <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left border-b">ID</th><th className="px-3 py-2 text-left border-b">Total</th><th className="px-3 py-2 text-left border-b">Status</th><th className="px-3 py-2 text-left border-b">Created</th></tr></thead>
            <tbody>
            {orders.data?.data.map(o => (
              <tr key={o.id} className="odd:bg-white even:bg-slate-50/50">
                <td className="px-3 py-2 border-b">{o.id}</td>
                <td className="px-3 py-2 border-b">{(o.total ?? 0).toFixed(2)}</td>
                <td className="px-3 py-2 border-b">{o.status}</td>
                <td className="px-3 py-2 border-b">{o.created_at && new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))}
            </tbody>
          </table>
          {orders.data && <Pagination page={page} pageSize={PAGE} total={orders.data.count} onPageChange={setPage} />}
        </div>
      )}
    </div>
  )
}

export default UserTabs


