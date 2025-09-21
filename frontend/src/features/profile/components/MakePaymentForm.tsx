import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import type { ApiResponse } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

type Props = { orderId: number }

type CreatePaymentResponse = { client_secret: string; payment_intent_id: string }
type StatusResponse = { status: 'succeeded' | 'processing' | 'requires_payment_method' | string }

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: async (payload: { order_id: number; user_payment_id?: number }): Promise<CreatePaymentResponse> => {
      const { data } = await axiosClient.post<ApiResponse<CreatePaymentResponse>>(ApiEndpoints.PaymentCreate, payload)
      if ('success' in data && data.success) return data.data
      throw new Error((data as any).error || 'Failed to create payment')
    },
  })
}

export const usePaymentStatus = () => {
  return useMutation({
    mutationFn: async (payload: { order_id: number }): Promise<StatusResponse> => {
      const { data } = await axiosClient.post<ApiResponse<StatusResponse>>(ApiEndpoints.PaymentStatus, payload)
      if ('success' in data && data.success) return data.data
      throw new Error((data as any).error || 'Failed to get payment status')
    },
  })
}

const MakePaymentForm: React.FC<Props> = ({ orderId }) => {
  const createPayment = useCreatePayment()
  const getStatus = usePaymentStatus()
  const [result, setResult] = React.useState<string | null>(null)

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await createPayment.mutateAsync({ order_id: orderId })
        // For card on-file and automatic confirmation via backend/webhook, we just poll status
        const status = await getStatus.mutateAsync({ order_id: orderId })
        setResult(status.status)
      }}
      className="space-y-3"
    >
      <button type="submit" disabled={createPayment.isPending} className="rounded-md bg-gray-900 text-white px-4 py-2 disabled:opacity-60">
        {createPayment.isPending ? 'Processing…' : 'Pay now'}
      </button>
      {result && <div className="text-sm text-gray-700">Payment status: {result}</div>}
    </form>
  )
}

export default MakePaymentForm


