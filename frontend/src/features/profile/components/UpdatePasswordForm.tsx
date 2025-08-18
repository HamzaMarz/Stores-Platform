import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Spinner from '../../../components/Spinner'
import { useOutletContext } from 'react-router-dom'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

const schema = z.object({
  old_pass: z.string().min(8).max(100),
  new_pass: z.string().min(8).max(100),
})
type FormValues = z.infer<typeof schema>

type OutletCtx = { toast: (t: { title: string; description?: string; tone?: 'success' | 'error' | 'info' }) => void }

const UpdatePasswordForm: React.FC = () => {
  const { toast } = useOutletContext<OutletCtx>()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        try {
          const { data } = await axiosClient.put(ApiEndpoints.ProfileChangePassword, values)
          if (data && typeof data === 'object' && (data.statusCode === 200 || data.success === true)) {
            toast({ title: 'Password changed', tone: 'success' })
          } else {
            throw new Error('Failed')
          }
        } catch (e) {
          toast({ title: 'Change failed', description: (e as Error).message, tone: 'error' })
        }
      })}
      className="space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Old password</label>
          <input type="password" {...register('old_pass')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" />
          {errors.old_pass && <p className="text-xs text-rose-600 mt-1">{errors.old_pass.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New password</label>
          <input type="password" {...register('new_pass')} className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" />
          {errors.new_pass && <p className="text-xs text-rose-600 mt-1">{errors.new_pass.message}</p>}
        </div>
      </div>
      <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-4 py-2 disabled:opacity-60">
        {isSubmitting && <Spinner size={16} />}
        <span>Change password</span>
      </button>
    </form>
  )
}

export default UpdatePasswordForm


