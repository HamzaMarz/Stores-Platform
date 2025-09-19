import type React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '../hooks/useRegister';
import type { RegisterPayload } from '../hooks/useRegister';
import { ErrorMessages } from '../../../constants/app';
import { useState } from 'react';

const schema = z.object({
	name: z.string().min(1, ErrorMessages.Required),
	email: z.string().email(ErrorMessages.InvalidEmail),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

type Props = { onSuccess?: () => void; onError?: (message: string) => void };

const RegisterForm: React.FC<Props> = ({ onSuccess, onError }) => {
	const { register, handleSubmit, formState: { errors } } = useForm<RegisterPayload>({
		resolver: zodResolver(schema)
	});
	const mutation = useRegister();
	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = handleSubmit(async (values) => {
		try {
			await mutation.mutateAsync(values);
			onSuccess?.();
		} catch (err) {
			onError?.((err as Error).message);
		}
	});

	return (
		<form onSubmit={onSubmit} className="p-4 space-y-6 duration-500 animate-in fade-in">
			{/* Name */}
			<div>
				<label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
				<input
					type="text"
					{...register('name')}
					className={`w-full px-3 py-2 rounded-md border ${
						errors.name ? 'border-rose-500 animate-pulse' : 'border-gray-300'
					} focus:outline-none focus:ring-2 focus:ring-gray-900`}
					placeholder="Jane Doe"
				/>
				{errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
			</div>

			{/* Email */}
			<div>
				<label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
				<input
					type="email"
					{...register('email')}
					className={`w-full px-3 py-2 rounded-md border ${
						errors.email ? 'border-rose-500 animate-pulse' : 'border-gray-300'
					} focus:outline-none focus:ring-2 focus:ring-gray-900`}
					placeholder="you@example.com"
				/>
				{errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
			</div>

			{/* Password */}
			<div>
				<label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
				<div className="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						{...register('password')}
						className={`w-full px-3 py-2 pr-10 rounded-md border ${
							errors.password ? 'border-rose-500 animate-pulse' : 'border-gray-300'
						} focus:outline-none focus:ring-2 focus:ring-gray-900`}
						placeholder="••••••••"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="flex absolute inset-y-0 right-0 items-center px-3 text-gray-500 hover:text-gray-900"
					>
						{showPassword ? '🙈' : '👁️'}
					</button>
				</div>
				{errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}
			</div>

			{/* Submit */}
			<button
				type="submit"
				disabled={mutation.isPending}
				className="py-2 w-full text-white bg-gray-900 rounded-md transition hover:bg-gray-800 disabled:opacity-60"
			>
				{mutation.isPending ? 'Creating account…' : 'Create account'}
			</button>
		</form>
	);
};

export default RegisterForm;
