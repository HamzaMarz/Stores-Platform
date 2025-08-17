import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin } from '../hooks/useLogin'
import type { LoginPayload } from '../hooks/useLogin'
import { ErrorMessages } from '../../../constants/app'

const schema = z.object({
	email: z.string().email(ErrorMessages.InvalidEmail),
	password: z.string().min(1, ErrorMessages.Required),
})

type Props = { onSuccess?: () => void; onError?: (message: string) => void; onForgotPasswordClick?: () => void }

const LoginForm: React.FC<Props> = ({ onSuccess, onError, onForgotPasswordClick }) => {
	const { register, handleSubmit, formState: { errors } } = useForm<LoginPayload>({ resolver: zodResolver(schema) })
	const login = useLogin()

	const onSubmit = handleSubmit(async (values) => {
		try {
			await login.mutateAsync(values)
			onSuccess?.()
		} catch (err) {
			onError?.((err as Error).message)
		}
	})

	return (
		<form onSubmit={onSubmit} className="space-y-4 animate-in fade-in duration-500">
			<div>
				<label className="block text-sm font-medium text-gray-700">Email</label>
				<input type="email" {...register('email')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="you@example.com" />
				{errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">Password</label>
				<input type="password" {...register('password')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="••••••••" />
				{errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}
			</div>
			<button type="submit" disabled={login.isPending} className="w-full rounded-md bg-gray-900 text-white py-2 hover:bg-gray-800 transition disabled:opacity-60">
				{login.isPending ? 'Signing in…' : 'Sign in'}
			</button>
			<div className="text-sm text-gray-600 text-center">
				<button type="button" className="underline underline-offset-4" onClick={onForgotPasswordClick}>
					Forgot your password?
				</button>
			</div>
		</form>
	)
}

export default LoginForm

