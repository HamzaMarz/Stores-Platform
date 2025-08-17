import type React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorMessages } from '../../../constants/app'
import { useForgotPasswordRequest, type ForgotPasswordResponse } from '../hooks/useForgotPasswordRequest'

type Props = { open: boolean; onClose: () => void; onSent?: (email: string, createdAt?: string) => void; onError?: (message: string) => void }

const emailSchema = z.object({ email: z.string().email(ErrorMessages.InvalidEmail) })
type EmailForm = z.infer<typeof emailSchema>

const ForgotPasswordDialog: React.FC<Props> = ({ open, onClose, onSent, onError }) => {
    const stepEmail = useForm<EmailForm>({ resolver: zodResolver(emailSchema) })
    const reqForgot = useForgotPasswordRequest()

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <div className="flex items-start justify-between">
                    <h2 className="text-lg font-semibold">Reset password</h2>
                    <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800">✕</button>
                </div>

                <form
                    onSubmit={stepEmail.handleSubmit(async ({ email }) => {
                        try {
                            const data = await reqForgot.mutateAsync({ email }) as ForgotPasswordResponse
                            const createdAt = (data as any)?.created_at as string | undefined
                            onSent?.(email, createdAt)
                            onClose()
                        } catch (err) {
                            const raw = (err as Error).message || ''
                            const friendly = raw === 'OPERATION_IN_PROGRESS' ? 'opreation still in progress try again later' : 'Failed to send reset code'
                            onError?.(friendly)
                        }
                    })}
                    className="mt-4 space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" {...stepEmail.register('email')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="you@example.com" />
                        {stepEmail.formState.errors.email && (
                            <p className="mt-1 text-xs text-rose-600">{stepEmail.formState.errors.email.message}</p>
                        )}
                    </div>
                    <button type="submit" disabled={reqForgot.isPending} className="w-full rounded-md bg-gray-900 text-white py-2 hover:bg-gray-800 transition disabled:opacity-60">
                        {reqForgot.isPending ? 'Sending code…' : 'Send code'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPasswordDialog


