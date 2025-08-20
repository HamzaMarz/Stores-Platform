import React from 'react'
import { useListTickets } from '../hooks/useSupport'
import TicketTable from './TicketTable'
import CreateTicketModal from './CreateTicketModal'
import TicketDetailsModal from './TicketDetailsModal'

const SupportSection: React.FC = () => {
  const [pagination, setPagination] = React.useState({ offset: 0, limit: 10 })
  const [order, setOrder] = React.useState<{ column: 'created_at' | 'updated_at' | 'status'; direction: 'asc' | 'desc' }>({ column: 'updated_at', direction: 'desc' })
  const list = useListTickets({ ...pagination, order })
  const [openCreate, setOpenCreate] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<number | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span>Order</span>
          <select value={order.column} onChange={(e) => setOrder((o) => ({ ...o, column: e.target.value as any }))} className="rounded-md border px-2 py-1.5">
            <option value="created_at">Created</option>
            <option value="updated_at">Updated</option>
            <option value="status">Status</option>
          </select>
          <select value={order.direction} onChange={(e) => setOrder((o) => ({ ...o, direction: e.target.value as any }))} className="rounded-md border px-2 py-1.5">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
        <button onClick={() => setOpenCreate(true)} className="rounded-md bg-gray-900 text-white px-4 py-2">Open ticket</button>
      </div>
      <TicketTable items={list.data?.items || []} onSelect={(t) => setSelectedId(t.id)} />
      <div className="flex justify-between items-center">
        <button disabled={pagination.offset === 0} onClick={() => setPagination((p) => ({ ...p, offset: Math.max(0, p.offset - p.limit) }))} className="rounded-md border px-3 py-1.5 disabled:opacity-60">Prev</button>
        <div className="text-xs text-gray-600">Total: {list.data?.count ?? 0}</div>
        <button onClick={() => setPagination((p) => ({ ...p, offset: p.offset + p.limit }))} className="rounded-md border px-3 py-1.5">Next</button>
      </div>
      <CreateTicketModal open={openCreate} onClose={() => setOpenCreate(false)} onCreated={async () => { await list.refetch() }} />
      <TicketDetailsModal id={selectedId} open={selectedId != null} onClose={() => setSelectedId(null)} />
    </div>
  )
}

export default SupportSection


