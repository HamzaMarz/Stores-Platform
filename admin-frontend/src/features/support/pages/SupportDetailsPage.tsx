import React from 'react'
import { useParams } from 'react-router-dom'
import { useSupportDetails, useSupportSendMessage, useSupportUpdateStatus } from '@/features/support/hooks/useSupport'

const SupportDetailsPage: React.FC = () => {
  const params = useParams()
  const id = Number(params.id)
  const { data, isLoading } = useSupportDetails(id)
  const send = useSupportSendMessage()
  const update = useSupportUpdateStatus()
  const [message, setMessage] = React.useState('')
  const [newStatus, setNewStatus] = React.useState('CLOSED')

  if (Number.isNaN(id)) return <div className="p-4">Invalid ticket id</div>
  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Not found</div>

  const onSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message) return
    send.mutate({ ticket_id: id, message })
    setMessage('')
  }

  const onClose = () => {
    update.mutate({ id, status: newStatus })
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-lg font-semibold">Ticket #{data.ticket.id} • User {data.ticket.user_id}</div>
        <div className="text-slate-600">Status: {data.ticket.status}</div>
        <div className="text-slate-600">Subject: {data.ticket.subject}</div>
      </div>
      <div className="space-y-2">
        {data.messages.map(m => (
          <div key={m.id} className={`border rounded p-2 ${m.sender === 'admin' ? 'bg-slate-50' : ''}`}>
            <div className="text-xs text-slate-500">{m.sender} • {new Date(m.created_at).toLocaleString()}</div>
            <div>{m.message}</div>
          </div>
        ))}
      </div>
      <form onSubmit={onSend} className="flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-sm mb-1">Message</label>
          <textarea className="w-full border rounded px-3 py-2" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <button className="px-4 py-2 rounded bg-slate-800 text-white" disabled={send.isPending}>Send</button>
      </form>
      <div className="flex items-center gap-2">
        <select className="border rounded px-3 py-2" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="CLOSED">CLOSED</option>
          <option value="PENDING">PENDING</option>
          <option value="OPEN">OPEN</option>
        </select>
        <button className="px-4 py-2 rounded border" onClick={onClose} disabled={update.isPending}>Update Status</button>
      </div>
    </div>
  )
}

export default SupportDetailsPage


