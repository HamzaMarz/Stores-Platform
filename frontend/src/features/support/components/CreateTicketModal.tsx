import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useCreateTicket } from '../hooks/useSupport'

type Props = { open: boolean; onClose: () => void; onCreated: () => Promise<void> | void }

const schema = z.object({ topic: z.string().min(3), description: z.string().min(10) })
type FormValues = z.infer<typeof schema>

const CreateTicketModal: React.FC<Props> = ({ open, onClose, onCreated }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const createTicket = useCreateTicket()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Open a ticket</h3>
          <button onClick={onClose} className="rounded-md border px-3 py-1.5">Close</button>
        </div>
        <form
          onSubmit={handleSubmit(async (v) => {
            await createTicket.mutateAsync(v)
            reset()
            await onCreated()
            onClose()
          })}
          className="p-4 space-y-3"
        >
          <div>
            <label className="text-sm font-medium text-gray-700">Topic</label>
            <input {...register('topic')} className="mt-1 w-full rounded-md border px-3 py-2" />
            {errors.topic && <p className="text-xs text-rose-600 mt-1">{errors.topic.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea rows={5} {...register('description')} className="mt-1 w-full rounded-md border px-3 py-2" />
            {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>}
          </div>
          <div className="flex items-center justify-end gap-2 border-t pt-3">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2">Discard</button>
            <button type="submit" disabled={createTicket.isPending} className="rounded-md bg-gray-900 text-white px-4 py-2 disabled:opacity-60">
              {createTicket.isPending ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTicketModal


