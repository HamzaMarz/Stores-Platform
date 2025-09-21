import React from 'react'
import { loadStripe, type Stripe, type StripeCardElement } from '@stripe/stripe-js'
import { useStartAddCard, useSaveFirstCard } from '../hooks/useVerifyProfile'
import { STRIPE_PUBLISHABLE_KEY } from '../../../constants/thirdParty'
import Spinner from '../../../components/Spinner'
import { useOutletContext } from 'react-router-dom'

type Props = { onCompleted: () => void }

// const cardElementOptions = {
//   style: {
//     base: {
//       fontSize: '16px',
//       color: '#1f2937',
//       '::placeholder': { color: '#9ca3af' },
//     },
//     invalid: { color: '#ef4444' },
//   },
// }

type OutletCtx = { toast: (t: { title: string; description?: string; tone?: 'success' | 'error' | 'info' }) => void }

const AddCardForm: React.FC<Props> = ({ onCompleted }) => {
  const [stripe, setStripe] = React.useState<Stripe | null>(null)
  const cardElementRef = React.useRef<StripeCardElement | null>(null)
  const startAdd = useStartAddCard()
  const saveCard = useSaveFirstCard()
  const [error, setError] = React.useState<string | null>(null)
  const { toast } = useOutletContext<OutletCtx>()

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const s = await loadStripe(STRIPE_PUBLISHABLE_KEY)
        if (!mounted || !s) return
        setStripe(s)
        const elements = s.elements()
        const card = elements.create('card', {
          style: {
            base: { fontSize: '16px', color: '#1f2937', '::placeholder': { color: '#9ca3af' } },
            invalid: { color: '#ef4444' },
          },
        })
        card.mount('#sp-card-element')
        cardElementRef.current = card
      } catch (error) {
        console.warn('Stripe initialization failed:', error)
        // Continue without Stripe if it fails to load
      }
    })()
    return () => {
      mounted = false
      cardElementRef.current?.unmount()
      cardElementRef.current = null
    }
  }, [])

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setError(null)
        if (!stripe || !cardElementRef.current) return
        try {
          const setup = await startAdd.mutateAsync({ step: 'start-add-card' })
          const clientSecret = (setup as any)?.client_secret || (setup as any)?.clientSecret
          if (!clientSecret || typeof clientSecret !== 'string') {
            throw new Error('SETUP_INTENT_SECRET_MISSING')
          }
          const result = await stripe.confirmCardSetup(clientSecret, { payment_method: { card: cardElementRef.current } })
          if (result.error) throw new Error(result.error.message || 'STRIPE_ERROR')
          const paymentMethodId = result.setupIntent?.payment_method as string
          await saveCard.mutateAsync({ step: 'save-card', payment_method_id: paymentMethodId })
          toast({ title: 'Card saved', tone: 'success' })
          onCompleted()
        } catch (e) {
          const msg = (e as Error).message
          setError(msg)
          toast({ title: 'Add card failed', description: msg, tone: 'error' })
        }
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Card details</label>
        <div id="sp-card-element" className="mt-1 rounded-md border p-3" />
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      <button type="submit" disabled={!stripe || startAdd.isPending || saveCard.isPending} className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 text-white py-2 hover:bg-gray-800 transition disabled:opacity-60">
        {(startAdd.isPending || saveCard.isPending) && <Spinner size={16} />}
        <span>{startAdd.isPending || saveCard.isPending ? 'Saving…' : 'Save card'}</span>
      </button>
    </form>
  )
}

export default AddCardForm


