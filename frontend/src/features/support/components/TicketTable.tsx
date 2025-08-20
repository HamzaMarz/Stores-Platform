import React from 'react'
import type { Ticket } from '../hooks/useSupport'

type Props = {
  items: Ticket[]
  onSelect: (t: Ticket) => void
}

const TicketTable: React.FC<Props> = ({ items, onSelect }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="p-2">ID</th>
            <th className="p-2">Topic</th>
            <th className="p-2">Status</th>
            <th className="p-2">Updated</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(t)}>
              <td className="p-2">{t.id}</td>
              <td className="p-2">{t.topic}</td>
              <td className="p-2">{t.status}</td>
              <td className="p-2">{t.updated_at ? new Date(t.updated_at).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TicketTable


