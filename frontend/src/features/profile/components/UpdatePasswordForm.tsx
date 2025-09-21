import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Spinner from '../../../components/Spinner'
import { useOutletContext } from 'react-router-dom'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import { useGetProfileInfo } from '../hooks/useProfileInfo'

const schema = z.object({
  old_pass: z.string().min(8).max(100),
  new_pass: z.string().min(8).max(100),
})
type FormValues = z.infer<typeof schema>

type OutletCtx = { toast: (t: { title: string; description?: string; tone?: 'success' | 'error' | 'info' }) => void }

const UpdatePasswordForm: React.FC = () => {
  const { toast } = useOutletContext<OutletCtx>()
  const profileInfo = useGetProfileInfo()
  
  // إنشاء schema ديناميكي حسب حالة المستخدم
  const dynamicSchema = React.useMemo(() => {
    return z.object({
      old_pass: profileInfo.data?.has_password 
        ? z.string().min(8).max(100) 
        : z.string().optional(),
      new_pass: z.string().min(8).max(100),
    })
  }, [profileInfo.data?.has_password])
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ 
    resolver: zodResolver(dynamicSchema) as any 
  })

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        try {
          // إرسال البيانات مع تجاهل old_pass إذا كان المستخدم لا يملك كلمة مرور
          const payload = profileInfo.data?.has_password 
            ? values 
            : { new_pass: values.new_pass }
          
          const { data } = await axiosClient.put(ApiEndpoints.ProfileChangePassword, payload)
          if (data && typeof data === 'object' && (data.statusCode === 200 || data.success === true)) {
            toast({ 
              title: profileInfo.data?.has_password ? 'Password changed' : 'Password created', 
              tone: 'success' 
            })
          } else {
            throw new Error('Failed')
          }
        } catch (e) {
          toast({ 
            title: profileInfo.data?.has_password ? 'Change failed' : 'Creation failed', 
            description: (e as Error).message, 
            tone: 'error' 
          })
        }
      })}
      className="space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Old password</label>
          <input 
            type="password" 
            {...register('old_pass')} 
            disabled={!profileInfo.data?.has_password}
            className={`mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900 ${
              !profileInfo.data?.has_password ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder={!profileInfo.data?.has_password ? "No password set (Google account)" : "Enter old password"}
          />
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
        <span>{profileInfo.data?.has_password ? 'Change password' : 'Set password'}</span>
      </button>
    </form>
  )
}

export default UpdatePasswordForm


