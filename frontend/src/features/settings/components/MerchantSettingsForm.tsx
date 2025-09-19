import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUpdateMerchantSettings } from '../hooks/useSettings'
import { useToast } from '../../../hooks/useToast'
import type { MerchantSettings, MerchantSettingsForm } from '../types'

const schema = z.object({
  alias: z.string().min(3, 'Alias must be at least 3 characters').max(50, 'Alias must be less than 50 characters'),
  logo: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  settings: MerchantSettings
  onSaved?: () => void
}

const MerchantSettingsForm: React.FC<Props> = ({ settings, onSaved }) => {
  const updateSettings = useUpdateMerchantSettings()
  const { show } = useToast()
  
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      alias: settings.alias || '',
      logo: settings.logo || '',
    }
  })

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        try {
          await updateSettings.mutateAsync(values)
          show({ title: 'Merchant settings updated successfully', tone: 'success' })
          onSaved?.()
        } catch (e: any) {
          show({ title: 'Failed to update settings', description: e?.message, tone: 'error' })
        }
      })}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Merchant Alias */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Merchant Alias *
          </label>
          <input
            {...register('alias')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter merchant alias"
          />
          {errors.alias && (
            <p className="mt-1 text-sm text-red-600">{errors.alias.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            This will be your unique identifier on the platform
          </p>
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo URL
          </label>
          <input
            {...register('logo')}
            type="url"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/logo.png"
          />
          {errors.logo && (
            <p className="mt-1 text-sm text-red-600">{errors.logo.message}</p>
          )}
        </div>
      </div>

      {/* Rating Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Merchant Statistics</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Rating:</span>
            <span className="ml-2 font-medium">{(settings.rating || 0).toFixed(1)} ⭐</span>
          </div>
          <div>
            <span className="text-gray-500">Reviews:</span>
            <span className="ml-2 font-medium">{settings.rating_count || 0}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={updateSettings.isPending || !isDirty}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}

export default MerchantSettingsForm
