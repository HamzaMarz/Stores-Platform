import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCheckVerifyOtp } from '../hooks/useVerifyProfile'

type Props = { email: string; createdAt?: string; onVerified: () => void; onWrongOtp: () => void }

const schema = z.object({ otp: z.string().min(4).max(6) })
type FormValues = z.infer<typeof schema>

const TEN_MINUTES = 10 * 60

const OtpVerifyForm: React.FC<Props> = ({ email, createdAt, onVerified, onWrongOtp }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const check = useCheckVerifyOtp()
  const initial = React.useMemo(() => {
    if (!createdAt) return TEN_MINUTES
    const createdMs = new Date(createdAt).getTime()
    const expiresMs = createdMs + TEN_MINUTES * 1000
    const now = Date.now()
    return Math.max(0, Math.floor((expiresMs - now) / 1000))
  }, [createdAt])
  const [secondsLeft, setSecondsLeft] = React.useState<number>(initial)
  React.useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [secondsLeft])
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = String(secondsLeft % 60).padStart(2, '0')

  return (
    <form
      onSubmit={handleSubmit(async ({ otp }) => {
        try {
          await check.mutateAsync({ step: 'check-otp', otp })
          onVerified()
        } catch (e) {
          onWrongOtp()
        }
      })}
      className="space-y-4"
    >
      <div className="text-sm text-gray-600">We sent a code to {email}. Expires in {minutes}:{seconds}</div>
      <div>
        <label className="block text-sm font-medium text-gray-700">OTP</label>
        <input type="text" inputMode="numeric" maxLength={6} {...register('otp')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900 tracking-widest" placeholder="123456" />
        {errors.otp && <p className="mt-1 text-xs text-rose-600">{errors.otp.message}</p>}
      </div>
      <button type="submit" disabled={check.isPending} className="w-full rounded-md bg-gray-900 text-white py-2 hover:bg-gray-800 transition disabled:opacity-60">
        {check.isPending ? 'Verifying…' : 'Verify code'}
      </button>
    </form>
  )
}

export default OtpVerifyForm


