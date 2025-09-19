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
		// <form onSubmit={onSubmit} className="space-y-4 duration-500 animate-in fade-in">
		// 	<div>
		// 		<label className="block text-sm font-medium text-gray-700">Email</label>
		// 		<input type="email" {...register('email')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="you@example.com" />
		// 		{errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
		// 	</div>
		// 	<div>
		// 		<label className="block text-sm font-medium text-gray-700">Password</label>
		// 		<input type="password" {...register('password')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="••••••••" />
		// 		{errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}
		// 	</div>
		// 	<button type="submit" disabled={login.isPending} className="py-2 w-full text-white bg-gray-900 rounded-md transition hover:bg-gray-800 disabled:opacity-60">
		// 		{login.isPending ? 'Signing in…' : 'Sign in'}
		// 	</button>
		// 	<div className="text-sm text-center text-gray-600">
		// 		<button type="button" className="underline underline-offset-4" onClick={onForgotPasswordClick}>
		// 			Forgot your password?
		// 		</button>
		// 	</div>
		// </form>

		<form onSubmit={onSubmit} className="p-6 space-y-5 bg-white rounded-2xl shadow-md duration-500 animate-in fade-in">
			<div className="space-y-1">
				<label className="block text-sm font-semibold text-gray-800">Email</label>
				<input
					type="email"
					{...register('email')}
					className="px-3 py-2 w-full rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-900"
					placeholder="you@example.com"
				/>
				{errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
			</div>

			<div className="space-y-1">
				<label className="block text-sm font-semibold text-gray-800">Password</label>
				<input
					type="password"
					{...register('password')}
					className="px-3 py-2 w-full rounded-lg border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-900"
					placeholder="••••••••"
				/>
				{errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
			</div>

			<button
				type="submit"
				disabled={login.isPending}
				className="py-2 w-full font-medium text-white bg-gray-900 rounded-lg transition hover:bg-gray-800 disabled:opacity-60"
			>
				{login.isPending ? 'Signing in…' : 'Sign in'}
			</button>

			<div className="text-sm text-center text-gray-600">
				<button
					type="button"
					className="text-gray-700 underline hover:text-gray-900 underline-offset-4"
					onClick={onForgotPasswordClick}
				>
					Forgot your password?
				</button>
			</div>
		</form>
	)
}

export default LoginForm

