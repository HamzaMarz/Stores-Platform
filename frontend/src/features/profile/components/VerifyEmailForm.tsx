import React from 'react'
import { useStartVerify } from '../hooks/useVerifyProfile'
import { useAuthStore } from '../../auth/state/useAuthStore'

type Props = { onStarted: (args: { email: string; createdAt?: string }) => void }

const VerifyEmailForm: React.FC<Props> = ({ onStarted }) => {
  const start = useStartVerify()
  const user = useAuthStore((s) => s.user)
  const email = user?.email || ''
  const [error, setError] = React.useState<string | null>(null)

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setError(null)
        try {
          const res = await start.mutateAsync({ step: 'start', email })
          onStarted({ email, createdAt: res.created_at })
        } catch (e) {
          const msg = (e as Error).message || 'Failed to send code'
          if (msg === 'OPERATION_IN_PROGRESS') {
            onStarted({ email })
            return
          }
          setError(msg)
        }
      }}
      className="space-y-4"
    >
      <div>
        <div className="text-sm text-gray-700">We will send a verification code to:</div>
        <div className="mt-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-800">{email}</div>
      </div>
      {error && <div className="text-xs text-rose-600">{error}</div>}
      <button type="submit" disabled={start.isPending} className="w-full rounded-md bg-gray-900 text-white py-2 hover:bg-gray-800 transition disabled:opacity-60">
        {start.isPending ? 'Sending…' : 'Send code'}
      </button>
    </form>
  )
}

export default VerifyEmailForm


