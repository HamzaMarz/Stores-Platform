import React from 'react'
import { useDeleteCard, useListCards } from '../hooks/usePaymentMethods'
import AddCardForm from './AddCardForm'
import { useAuthStore } from '../../auth/state/useAuthStore'
import { STRIPE_PUBLISHABLE_KEY } from '../../../constants/thirdParty'
import { loadStripe } from '@stripe/stripe-js'
import { useSaveCardNormal, useStartAddCardNormal } from '../hooks/usePaymentMethods'
import Spinner from '../../../components/Spinner'
import { useOutletContext } from 'react-router-dom'

type Props = { onDeleted?: () => void }

const CardList: React.FC<Props> = ({ onDeleted }) => {
  const { data, isLoading, isError, refetch } = useListCards()
  const del = useDeleteCard()
  const [showAdd, setShowAdd] = React.useState(false)
  const verified = useAuthStore((s) => s.user?.verified)
  const startAddNormal = useStartAddCardNormal()
  const saveCardNormal = useSaveCardNormal()
  const [addError, setAddError] = React.useState<string | null>(null)
  const { toast } = useOutletContext<{ toast: (t: { title: string; description?: string; tone?: 'success' | 'error' | 'info' }) => void }>()

  if (isLoading) return <div className="text-sm text-gray-500">Loading cards…</div>
  if (isError) return <div className="text-sm text-rose-600">Failed to load cards</div>
  const methods = data?.methods || []

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">Your saved payment methods</div>
        <button className="rounded-md bg-gray-900 text-white px-3 py-1.5 hover:bg-gray-800" onClick={() => setShowAdd(true)}>Add card</button>
      </div>
      {showAdd && (
        <div className="rounded-md border p-3">
          {!verified ? (
            <AddCardForm onCompleted={() => { setShowAdd(false); refetch() }} />
          ) : (
            <NormalAddCardInline onClose={() => { setShowAdd(false); refetch(); toast({ title: 'Card saved', tone: 'success' }) }} onError={(m) => { setAddError(m); if (m) toast({ title: 'Add card failed', description: m, tone: 'error' }) }} startAdd={startAddNormal.mutateAsync} saveCard={saveCardNormal.mutateAsync} />
          )}
          {addError && <p className="mt-2 text-xs text-rose-600">{addError}</p>}
        </div>
      )}
      {methods.length === 0 && <div className="text-sm text-gray-600">No cards saved.</div>}
      {methods.map((m) => (
        <div key={m.id} className="flex items-center justify-between rounded-md border p-3">
          <div className="text-sm text-gray-700">{m.brand?.toUpperCase() || 'CARD'} •••• {m.last4} {m.exp_month && m.exp_year ? `(exp ${m.exp_month}/${m.exp_year})` : ''}</div>
          <button
            className="text-xs text-rose-600 hover:underline disabled:opacity-50"
            disabled={del.isPending}
            onClick={async () => { await del.mutateAsync(m.id); await refetch(); onDeleted?.() }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default CardList

type NormalAddCardInlineProps = {
  onClose: () => void
  onError: (m: string | null) => void
  startAdd: () => Promise<{ client_secret: string }>
  saveCard: (payment_method_id: string) => Promise<any>
}

const NormalAddCardInline: React.FC<NormalAddCardInlineProps> = ({ onClose, onError, startAdd, saveCard }) => {
  const cardRef = React.useRef<stripe.elements.Element | null>(null)
  const [stripeInstance, setStripeInstance] = React.useState<stripe.Stripe | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      const s = await loadStripe(STRIPE_PUBLISHABLE_KEY)
      if (!mounted || !s) return
      setStripeInstance(s)
      const elements = s.elements()
      const card = elements.create('card')
      card.mount('#sp-card-element-inline')
      cardRef.current = card
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
        onError(null)
        try {
          setIsSubmitting(true)
          const { client_secret } = await startAdd()
          if (!stripeInstance || !cardRef.current) throw new Error('STRIPE_NOT_READY')
          const result = await stripeInstance.confirmCardSetup(client_secret, { payment_method: { card: cardRef.current as any } })
          if (result.error) throw new Error(result.error.message || 'STRIPE_ERROR')
          const pmId = result.setupIntent?.payment_method as string
          await saveCard(pmId)
          onClose()
        } catch (e) {
          onError((e as Error).message)
        } finally {
          setIsSubmitting(false)
        }
      }}
      className="space-y-3"
    >
      <div id="sp-card-element-inline" className="rounded-md border p-3" />
      <div className="flex gap-2">
        <button type="submit" disabled={!stripeInstance || isSubmitting} className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-1.5 disabled:opacity-60">
          {isSubmitting && <Spinner size={16} />}
          <span>Save card</span>
        </button>
        <button type="button" onClick={onClose} className="rounded-md border px-3 py-1.5">Cancel</button>
      </div>
    </form>
  )
}


