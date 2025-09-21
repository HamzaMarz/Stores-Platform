import React from 'react'
import { useGetSettings } from '../hooks/useSettings'
// import { useAuthStore } from '../../auth/state/useAuthStore'
import StoreSettingsForm from './StoreSettingsForm'
import MerchantSettingsForm from './MerchantSettingsForm'
// import type { Settings } from '../types'

const SettingsSection: React.FC = () => {
  const { data: settings, isLoading, error } = useGetSettings()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load settings</p>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No settings available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {settings.type === 'store' ? (
        <StoreSettingsForm 
          settings={settings} 
          onSaved={() => {
            // Settings saved successfully
          }}
        />
      ) : (
        <MerchantSettingsForm 
          settings={settings} 
          onSaved={() => {
            // Settings saved successfully
          }}
        />
      )}
    </div>
  )
}

export default SettingsSection
