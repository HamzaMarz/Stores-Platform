import type React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorMessages } from '../../../constants/app'
import { useForgotPasswordRequest } from '../hooks/useForgotPasswordRequest'
import { useCheckOtp } from '../hooks/useCheckOtp'
import { useUpdatePassword } from '../hooks/useUpdatePassword'

type Props = {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

const emailSchema = z.object({ email: z.string().email(ErrorMessages.InvalidEmail) })
type EmailForm = z.infer<typeof emailSchema>

const otpSchema = z.object({ email: z.string().email(), otp: z.string().length(4, 'Enter the 4-digit code') })
type OtpForm = z.infer<typeof otpSchema>

const updateSchema = z.object({ email: z.string().email(), otp: z.string().length(4), password: z.string().min(8, 'Password must be at least 8 characters') })
type UpdateForm = z.infer<typeof updateSchema>

const ForgotPasswordDialog: React.FC<Props> = ({ open, onClose, onSuccess }) => {
    const stepEmail = useForm<EmailForm>({ resolver: zodResolver(emailSchema) })
    const stepOtp = useForm<OtpForm>({ resolver: zodResolver(otpSchema) })
    const stepUpdate = useForm<UpdateForm>({ resolver: zodResolver(updateSchema) })

    const reqForgot = useForgotPasswordRequest()
    const reqOtp = useCheckOtp()
    const reqUpdate = useUpdatePassword()

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <div className="flex items-start justify-between">
                    <h2 className="text-lg font-semibold">Reset password</h2>
                    <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800">✕</button>
                </div>

                {/* Step 1: email */}
                {!reqForgot.isSuccess && (
                    <form
                        onSubmit={stepEmail.handleSubmit(async ({ email }) => {
                            await reqForgot.mutateAsync({ email })
                            stepOtp.reset({ email, otp: '' })
                            stepUpdate.reset({ email, otp: '', password: '' })
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
                )}

                {/* Step 2: verify otp */}
                {reqForgot.isSuccess && !reqOtp.isSuccess && (
                    <form
                        onSubmit={stepOtp.handleSubmit(async (values) => {
                            await reqOtp.mutateAsync(values)
                            stepUpdate.reset({ email: values.email, otp: values.otp, password: '' })
                        })}
                        className="mt-4 space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" {...stepOtp.register('email')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">OTP</label>
                            <input type="text" inputMode="numeric" maxLength={4} {...stepOtp.register('otp')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900 tracking-widest" placeholder="1234" />
                            {stepOtp.formState.errors.otp && (
                                <p className="mt-1 text-xs text-rose-600">{stepOtp.formState.errors.otp.message}</p>
                            )}
                        </div>
                        <button type="submit" disabled={reqOtp.isPending} className="w-full rounded-md bg-gray-900 text-white py-2 hover:bg-gray-800 transition disabled:opacity-60">
                            {reqOtp.isPending ? 'Verifying…' : 'Verify code'}
                        </button>
                    </form>
                )}

                {/* Step 3: update password */}
                {reqForgot.isSuccess && reqOtp.isSuccess && (
                    <form
                        onSubmit={stepUpdate.handleSubmit(async (values) => {
                            await reqUpdate.mutateAsync(values)
                            onSuccess?.()
                            onClose()
                        })}
                        className="mt-4 space-y-4"
                    >
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" {...stepUpdate.register('email')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">OTP</label>
                                <input type="text" inputMode="numeric" maxLength={4} {...stepUpdate.register('otp')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900 tracking-widest" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New password</label>
                                <input type="password" {...stepUpdate.register('password')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="••••••••" />
                                {stepUpdate.formState.errors.password && (
                                    <p className="mt-1 text-xs text-rose-600">{stepUpdate.formState.errors.password.message}</p>
                                )}
                            </div>
                        </div>
                        <button type="submit" disabled={reqUpdate.isPending} className="w-full rounded-md bg-gray-900 text-white py-2 hover:bg-gray-800 transition disabled:opacity-60">
                            {reqUpdate.isPending ? 'Updating…' : 'Update password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ForgotPasswordDialog


