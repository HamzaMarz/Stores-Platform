import type React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegister } from '../hooks/useRegister'
import type { RegisterPayload } from '../hooks/useRegister'
import { ErrorMessages } from '../../../constants/app'

const schema = z.object({
	name: z.string().min(1, ErrorMessages.Required),
	email: z.string().email(ErrorMessages.InvalidEmail),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

type Props = { onSuccess?: () => void; onError?: (message: string) => void }

const RegisterForm: React.FC<Props> = ({ onSuccess, onError }) => {
	const { register, handleSubmit, formState: { errors } } = useForm<RegisterPayload>({ resolver: zodResolver(schema) })
	const mutation = useRegister()

	const onSubmit = handleSubmit(async (values) => {
		try {
			await mutation.mutateAsync(values)
			onSuccess?.()
		} catch (err) {
			onError?.((err as Error).message)
		}
	})

	return (
		<form onSubmit={onSubmit} className="space-y-4 animate-in fade-in duration-500">
			<div>
				<label className="block text-sm font-medium text-gray-700">Name</label>
				<input type="text" {...register('name')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="Jane Doe" />
				{errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
			</div>
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
			<button type="submit" disabled={mutation.isPending} className="w-full rounded-md bg-gray-900 text-white py-2 hover:bg-gray-800 transition disabled:opacity-60">
				{mutation.isPending ? 'Creating account…' : 'Create account'}
			</button>
		</form>
	)
}

export default RegisterForm

