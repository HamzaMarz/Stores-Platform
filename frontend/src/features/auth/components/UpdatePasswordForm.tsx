import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

type Props = { email: string; otp: string; onSuccess: () => void }

const schema = z.object({ password: z.string().min(8, 'Password must be at least 8 characters') })
type FormValues = z.infer<typeof schema>

const UpdatePasswordForm: React.FC<Props> = ({ email, otp, onSuccess }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })
    
    const mutation = useMutation({
        mutationFn: async (password: string) => {
            try {
                const { data } = await axiosClient.post(ApiEndpoints.UpdatePassword, { email, otp, password })
                return data
            } catch (error) {
                console.error('Error updating password:', error)
                throw error
            }
        },
    })

    return (
        <form
            onSubmit={handleSubmit(async ({ password }) => {
                await mutation.mutateAsync(password)
                onSuccess()
            })}
            className="space-y-4"
        >
            <div>
                <label className="block text-sm font-medium text-gray-700">New password</label>
                <input type="password" {...register('password')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="••••••••" />
                {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={mutation.isPending} className="w-full rounded-md bg-gray-900 text-white py-2 hover:bg-gray-800 transition disabled:opacity-60">
                {mutation.isPending ? 'Updating…' : 'Update password'}
            </button>
        </form>
    )
}

export default UpdatePasswordForm


