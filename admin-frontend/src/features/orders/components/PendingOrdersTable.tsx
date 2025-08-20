import React from 'react'
import type { OrderSummary } from '@/features/orders/types'
import { useRefundOrder } from '@/features/orders/hooks/useRefundOrder'
import { useRejectRefund } from '@/features/orders/hooks/useRejectRefund'

type Props = {
  rows: OrderSummary[]
}

const PendingOrdersTable: React.FC<Props> = ({ rows }) => {
  const refund = useRefundOrder()
  const reject = useRejectRefund()

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left px-3 py-2 border-b">ID</th>
            <th className="text-left px-3 py-2 border-b">User</th>
            <th className="text-left px-3 py-2 border-b">Total</th>
            <th className="text-left px-3 py-2 border-b">Status</th>
            <th className="text-left px-3 py-2 border-b">Created</th>
            <th className="text-left px-3 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="odd:bg-white even:bg-slate-50/50">
              <td className="px-3 py-2 border-b">{r.id}</td>
              <td className="px-3 py-2 border-b">{r.user_id}</td>
              <td className="px-3 py-2 border-b">{(r.total ?? 0).toFixed(2)}</td>
              <td className="px-3 py-2 border-b">{r.status}</td>
              <td className="px-3 py-2 border-b">{new Date(r.created_at).toLocaleString()}</td>
              <td className="px-3 py-2 border-b">
                <div className="flex gap-2">
                  <button
                    onClick={() => refund.mutate(r.id)}
                    disabled={refund.isPending}
                    className="px-2 py-1 rounded bg-green-600 text-white"
                  >Approve refund</button>
                  <button
                    onClick={() => reject.mutate(r.id)}
                    disabled={reject.isPending}
                    className="px-2 py-1 rounded bg-red-600 text-white"
                  >Reject</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PendingOrdersTable


