import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useGetProfileInfo, useSaveProfileInfo } from '../../profile/hooks/useProfileInfo'
import { useStartUpgrade, useUpgradeStatus } from '../hooks/useUpgrade'

const UpgradePage: React.FC = () => {
	const schema = z.object({
		first_name: z.string().min(2),
		last_name: z.string().min(2),
		phone: z.string().min(10),
		bank_name: z.string().min(2),
		bank_account: z.string().min(2),
	})
	type FormValues = z.infer<typeof schema>

	const infoQuery = useGetProfileInfo()
	const saveInfo = useSaveProfileInfo()
	const statusQuery = useUpgradeStatus()
	const startUpgrade = useStartUpgrade()

	const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

	React.useEffect(() => {
		infoQuery.refetch().then((res) => {
			const d = res.data as any
			if (!d) return
			;(['first_name','last_name','phone','bank_name','bank_account'] as const).forEach((k) => {
				if (d[k]) setValue(k, d[k] as any)
			})
		})
	}, [])

	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="text-2xl font-bold">Upgrade your account</h1>
			<p className="text-gray-600 mt-2">Become a Store or Merchant to start listing products and managing orders.</p>

			<div className="mt-8 grid md:grid-cols-2 gap-6">
				<form
					onSubmit={handleSubmit(async (values) => { await saveInfo.mutateAsync(values) })}
					className="rounded-xl border bg-white p-6 shadow-sm space-y-4"
				>
					<h2 className="font-semibold">Your information</h2>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">First name</label>
							<input {...register('first_name')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" />
							{errors.first_name && <p className="text-xs text-rose-600 mt-1">{errors.first_name.message}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Last name</label>
							<input {...register('last_name')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" />
							{errors.last_name && <p className="text-xs text-rose-600 mt-1">{errors.last_name.message}</p>}
						</div>
						<div className="col-span-2">
							<label className="block text-sm font-medium text-gray-700">Phone</label>
							<input {...register('phone')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" />
							{errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Bank name</label>
							<input {...register('bank_name')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" />
							{errors.bank_name && <p className="text-xs text-rose-600 mt-1">{errors.bank_name.message}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Bank account</label>
							<input {...register('bank_account')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" />
							{errors.bank_account && <p className="text-xs text-rose-600 mt-1">{errors.bank_account.message}</p>}
						</div>
					</div>
					<div className="flex gap-2">
						<button type="submit" disabled={saveInfo.isPending} className="rounded-md bg-gray-900 text-white px-4 py-2 disabled:opacity-60">Save info</button>
						{saveInfo.isSuccess && <span className="text-xs text-emerald-700">Saved</span>}
					</div>
				</form>

				<div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
					<h2 className="font-semibold">Upgrade</h2>
					{statusQuery.isSuccess && (
						<div className="text-sm text-gray-700">Status: {JSON.stringify(statusQuery.data)}</div>
					)}
					<div className="grid grid-cols-2 gap-3">
						<button
							onClick={async () => { await startUpgrade.mutateAsync('store'); statusQuery.refetch() }}
							className="rounded-md bg-gray-900 text-white px-4 py-2 disabled:opacity-60"
						>
							Upgrade to Store
						</button>
						<button
							onClick={async () => { await startUpgrade.mutateAsync('merchant'); statusQuery.refetch() }}
							className="rounded-md border px-4 py-2"
						>
							Upgrade to Merchant
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UpgradePage

