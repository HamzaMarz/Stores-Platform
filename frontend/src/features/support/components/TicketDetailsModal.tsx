import React from 'react'
import { useCloseTicket, useRateTicket, useSendMessage, useTicketDetails } from '../hooks/useSupport'

type Props = { id: number | null; open: boolean; onClose: () => void }

const TicketDetailsModal: React.FC<Props> = ({ id, open, onClose }) => {
  const details = useTicketDetails(id || undefined, { messages_offset: 0, messages_limit: 50 })
  const send = useSendMessage()
  const closeTicket = useCloseTicket()
  const rate = useRateTicket()
  const [message, setMessage] = React.useState('')
  const [rating, setRating] = React.useState<number>(5)
  const [review, setReview] = React.useState('')

  React.useEffect(() => { if (!open) { setMessage(''); setRating(5); setReview('') } }, [open])
  if (!open || !id) return null

  const t = details.data

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Ticket #{id}</h3>
          <button onClick={onClose} className="rounded-md border px-3 py-1.5">Close</button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Topic</div>
            <div className="font-medium">{t?.topic}</div>
            <div className="text-sm text-gray-600">Description</div>
            <div className="text-gray-800 whitespace-pre-wrap">{t?.description}</div>
            <div className="text-sm text-gray-600">Status</div>
            <div>{t?.status}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Messages</div>
            <div className="h-64 overflow-y-auto border rounded p-2 bg-gray-50">
              {(t?.messages || []).map((m) => (
                <div key={m.id} className="mb-2">
                  <div className="text-xs text-gray-500">{m.created_at ? new Date(m.created_at).toLocaleString() : ''}</div>
                  <div className="text-sm">{m.message}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" className="flex-1 rounded-md border px-3 py-2" />
              <button
                disabled={send.isPending || !message.trim()}
                onClick={async () => { await send.mutateAsync({ ticket_id: id, message }); setMessage(''); await details.refetch() }}
                className="rounded-md border px-3 py-2 disabled:opacity-60"
              >Send</button>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={async () => { await closeTicket.mutateAsync(id); await details.refetch() }}
              className="rounded-md border px-3 py-1.5"
            >Close ticket</button>
            <div className="ml-auto flex items-center gap-2">
              <label className="text-sm">Rate</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded-md border px-2 py-1.5">
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <input value={review} onChange={(e) => setReview(e.target.value)} placeholder="Review (optional)" className="rounded-md border px-3 py-1.5" />
              <button
                disabled={rate.isPending}
                onClick={async () => { await rate.mutateAsync({ id, rating, review: review || undefined }); await details.refetch() }}
                className="rounded-md bg-gray-900 text-white px-3 py-1.5 disabled:opacity-60"
              >Save rating</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetailsModal


