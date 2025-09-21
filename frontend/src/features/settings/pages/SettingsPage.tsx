import React from 'react'
import { useGetSettings } from '../hooks/useSettings'
// import { useAuthStore } from '../../auth/state/useAuthStore'
import StoreSettingsForm from '../components/StoreSettingsForm'
import MerchantSettingsForm from '../components/MerchantSettingsForm'
// import type { Settings } from '../types'

const SettingsPage: React.FC = () => {
  const { data: settings, isLoading, error } = useGetSettings()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Settings</h1>
          <p className="text-gray-600 mt-2">Failed to load your settings. Please try again.</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">No Settings Found</h1>
          <p className="text-gray-600 mt-2">Settings are only available for store and merchant accounts.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {settings.type === 'store' ? 'Store Settings' : 'Merchant Settings'}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your {settings.type === 'store' ? 'store' : 'merchant'} information and preferences.
          </p>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            {settings.type === 'store' ? (
              <StoreSettingsForm 
                settings={settings} 
                onSaved={() => {
                  // Optionally refresh data or show success message
                }}
              />
            ) : (
              <MerchantSettingsForm 
                settings={settings} 
                onSaved={() => {
                  // Optionally refresh data or show success message
                }}
              />
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            About {settings.type === 'store' ? 'Store' : 'Merchant'} Settings
          </h3>
          <div className="text-blue-800 space-y-2">
            {settings.type === 'store' ? (
              <>
                <p>• <strong>Store Name:</strong> This is the name customers will see when browsing your products</p>
                <p>• <strong>Address:</strong> Your store's physical location for customer reference</p>
                <p>• <strong>Logo:</strong> Your store's logo that appears on product pages and store listings</p>
                <p>• <strong>Rating:</strong> Your store's average rating based on customer reviews</p>
              </>
            ) : (
              <>
                <p>• <strong>Merchant Alias:</strong> Your unique identifier on the platform</p>
                <p>• <strong>Logo:</strong> Your merchant logo that appears on product pages</p>
                <p>• <strong>Rating:</strong> Your merchant rating based on customer reviews</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
