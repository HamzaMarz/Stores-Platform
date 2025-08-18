import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useGetProfileInfo, useSaveProfileInfo } from '../hooks/useProfileInfo'
import Spinner from '../../../components/Spinner'
import { useOutletContext } from 'react-router-dom'

const schema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  phone: z.string().min(10),
  bank_name: z.string().min(2),
  bank_account: z.string().min(2),
})
type FormValues = z.infer<typeof schema>

type Props = { onSaved?: () => void }
type OutletCtx = { toast: (t: { title: string; description?: string; tone?: 'success' | 'error' | 'info' }) => void }

const ProfileInfoForm: React.FC<Props> = ({ onSaved }) => {
  const infoQuery = useGetProfileInfo()
  const saveInfo = useSaveProfileInfo()
  const { toast } = useOutletContext<OutletCtx>()
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  React.useEffect(() => {
    if (!infoQuery.data) return
    const d = infoQuery.data as any
    reset({
      first_name: d.first_name || '',
      last_name: d.last_name || '',
      phone: d.phone || '',
      bank_name: d.bank_name || '',
      bank_account: d.bank_account || '',
    })
  }, [infoQuery.data, reset])

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        try {
          await saveInfo.mutateAsync(values)
          toast({ title: 'Profile updated', tone: 'success' })
          onSaved?.()
        } catch (e) {
          toast({ title: 'Update failed', description: (e as Error).message, tone: 'error' })
        }
      })}
      className="space-y-4"
    >
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
      <button type="submit" disabled={!isDirty || saveInfo.isPending} className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-4 py-2 disabled:opacity-60">
        {saveInfo.isPending && <Spinner size={16} />}
        <span>Save info</span>
      </button>
    </form>
  )
}

export default ProfileInfoForm


