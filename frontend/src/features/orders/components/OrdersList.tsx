import React from 'react'
import { useConfirmDelivery } from '../hooks/useOrders'

type Order = {
  id: number
  status: string
  delivery: boolean
}

type Props = {
  orders: Order[]
  onConfirmed?: (orderId: number) => void
}

const OrdersList: React.FC<Props> = ({ orders, onConfirmed }) => {
  const confirm = useConfirmDelivery()
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="p-3 rounded-md border flex items-center justify-between">
          <div className="text-sm text-gray-700">Order #{o.id} — {o.status}</div>
          {!o.delivery && o.status === 'DELIVERED' && (
            <button
              className="rounded-md bg-gray-900 text-white px-3 py-1.5 disabled:opacity-60"
              disabled={confirm.isPending}
              onClick={async () => {
                await confirm.mutateAsync({ id: o.id })
                onConfirmed?.(o.id)
              }}
            >
              Confirm Delivery
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default OrdersList


