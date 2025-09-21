import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUpdateStoreSettings } from '../hooks/useSettings'
import { useToast } from '../../../hooks/useToast'
import type { StoreSettings } from '../types'

const schema = z.object({
  store_name: z.string().min(2, 'Store name must be at least 2 characters'),
  logo: z.string().optional(),
  address1: z.string().min(5, 'Address must be at least 5 characters'),
  address2: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  settings: StoreSettings
  onSaved?: () => void
}

const StoreSettingsForm: React.FC<Props> = ({ settings, onSaved }) => {
  const updateSettings = useUpdateStoreSettings()
  const { show } = useToast()
  
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      store_name: settings.store_name || '',
      logo: settings.logo || '',
      address1: settings.address1 || '',
      address2: settings.address2 || '',
      city: settings.city || '',
      country: settings.country || '',
    }
  })

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        try {
          await updateSettings.mutateAsync(values)
          show({ title: 'Store settings updated successfully', tone: 'success' })
          onSaved?.()
        } catch (e: any) {
          show({ title: 'Failed to update settings', description: e?.message, tone: 'error' })
        }
      })}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Store Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Store Name *
          </label>
          <input
            {...register('store_name')}
            type="text"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter store name"
          />
          {errors.store_name && (
            <p className="mt-1 text-sm text-red-600">{errors.store_name.message}</p>
          )}
        </div>

        {/* Logo URL */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Logo URL
          </label>
          <input
            {...register('logo')}
            type="url"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/logo.png"
          />
          {errors.logo && (
            <p className="mt-1 text-sm text-red-600">{errors.logo.message}</p>
          )}
        </div>

        {/* Address 1 */}
        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Address Line 1 *
          </label>
          <input
            {...register('address1')}
            type="text"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter address"
          />
          {errors.address1 && (
            <p className="mt-1 text-sm text-red-600">{errors.address1.message}</p>
          )}
        </div>

        {/* Address 2 */}
        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Address Line 2
          </label>
          <input
            {...register('address2')}
            type="text"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Apartment, suite, etc. (optional)"
          />
          {errors.address2 && (
            <p className="mt-1 text-sm text-red-600">{errors.address2.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            City *
          </label>
          <input
            {...register('city')}
            type="text"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter city"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Country *
          </label>
          <input
            {...register('country')}
            type="text"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter country"
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
          )}
        </div>
      </div>

      {/* Rating Info */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="mb-2 text-sm font-medium text-gray-700">Store Statistics</h3>
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
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}

export default StoreSettingsForm
