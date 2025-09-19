import React from 'react'
import { useCartCheckout } from '../../cart/hooks/useCart'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints, API_BASE_URL } from '../../../constants/api'
import { useListCards, useSaveCardNormal, useStartAddCardNormal } from '../../profile/hooks/usePaymentMethods'
import { loadStripe } from '@stripe/stripe-js'
import { STRIPE_PUBLISHABLE_KEY } from '../../../constants/thirdParty'

type Props = { cartId: number }

const CheckoutForm: React.FC<Props> = ({ cartId }) => {
  const checkout = useCartCheckout()
  const [address, setAddress] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [orderId, setOrderId] = React.useState<number | null>(null)
  const [status, setStatus] = React.useState<string | null>(null)
  const { data: cardsData, refetch: refetchCards } = useListCards()
  const startAdd = useStartAddCardNormal()
  const saveCard = useSaveCardNormal()
  const [selectedCardId, setSelectedCardId] = React.useState<string | 'new' | ''>('')
  const [stripeReady, setStripeReady] = React.useState(false)
  const cardRef = React.useRef<stripe.elements.Element | null>(null)
  const [stripeInstance, setStripeInstance] = React.useState<stripe.Stripe | null>(null)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const s = await loadStripe(STRIPE_PUBLISHABLE_KEY)
        if (!mounted || !s) return
        setStripeInstance(s)
        const elements = s.elements()
        const card = elements.create('card')
        card.mount('#checkout-card-element')
        cardRef.current = card
        setStripeReady(true)
      } catch (_) {}
    })()
    return () => {
      mounted = false
      cardRef.current?.unmount()
      cardRef.current = null
    }
  }, [])

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        let user_payment_id: number | undefined
        // If user selected a new card, first create setup intent and save card
        if (selectedCardId === 'new') {
          const { client_secret } = await startAdd.mutateAsync()
          if (!stripeInstance || !cardRef.current) throw new Error('STRIPE_NOT_READY')
          const result = await stripeInstance.confirmCardSetup(client_secret, { payment_method: { card: cardRef.current as any } })
          if (result.error) throw new Error(result.error.message || 'STRIPE_ERROR')
          const pmId = result.setupIntent?.payment_method as string
          const saved = await saveCard.mutateAsync(pmId)
          // saved may return id or ok; refresh list and pick the newest
          await refetchCards()
          const methods = (cardsData?.methods || [])
          const last = methods[0]
          if (last?.id) user_payment_id = Number(last.id)
        } else if (selectedCardId) {
          user_payment_id = Number(selectedCardId)
        }
        const res = await checkout.mutateAsync({ id: cartId, address, message: message || undefined, ...(user_payment_id ? { user_payment_id } : {}) } as any)
        setOrderId(res.order.id)
        // Poll payment status if present
        if (res.payment?.client_secret) {
          try {
            const { data } = await axiosClient.post(ApiEndpoints.PaymentStatus, { order_id: res.order.id })
            setStatus((data as any).data.status)
          } catch (_) {}
        }
      }}
      className="space-y-3"
    >
      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Shipping address" className="border p-2 w-full" required />
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message (optional)" className="border p-2 w-full" />
      <div className="space-y-2">
        <div className="text-sm text-gray-700">Payment method</div>
        <select value={selectedCardId} onChange={(e) => setSelectedCardId(e.target.value as any)} className="border p-2 w-full">
          <option value="">Use default card</option>
          {(cardsData?.methods || []).map((m) => (
            <option key={m.id} value={m.id}>{m.brand?.toUpperCase() || 'CARD'} •••• {m.last4}</option>
          ))}
          <option value="new">Add new card…</option>
        </select>
        {selectedCardId === 'new' && (
          <div id="checkout-card-element" className="p-3 rounded-md border" />
        )}
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Checkout</button>
      <button
        type="button"
        onClick={async () => {
          if (!orderId) {
            // create a lightweight order to pay via session: run checkout first without card
            const res = await checkout.mutateAsync({ id: cartId, address, message: message || undefined } as any)
            setOrderId(res.order.id)
          }
          const success = `${window.location.origin}/?session=success`
          const cancel = `${window.location.origin}/?session=cancel`
          const { data } = await axiosClient.post(ApiEndpoints.PaymentSessionCreate, { order_id: orderId ?? 0, success_url: success, cancel_url: cancel })
          const url = (data as any)?.data?.url
          if (typeof url === 'string') window.location.href = url
        }}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Pay with Stripe Checkout
      </button>
      {orderId && <div className="text-sm">Order #{orderId} created</div>}
      {status && <div className="text-sm">Payment: {status}</div>}
    </form>
  )
}

export default CheckoutForm


