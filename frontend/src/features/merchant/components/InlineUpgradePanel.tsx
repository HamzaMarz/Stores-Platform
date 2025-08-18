import React from 'react'
import { useStartUpgrade, useUpgradeStatus } from '../hooks/useUpgrade'
import Spinner from '../../../components/Spinner'

const InlineUpgradePanel: React.FC = () => {
  const status = useUpgradeStatus()
  const start = useStartUpgrade()

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-700">
        {status.isLoading ? 'Loading status…' : `Status: ${JSON.stringify(status.data || {})}`}
      </div>
      <div className="flex gap-2">
        <button
          onClick={async () => { await start.mutateAsync('store'); status.refetch() }}
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-4 py-2 disabled:opacity-60"
          disabled={start.isPending}
        >
          {start.isPending && <Spinner size={16} />}
          <span>Upgrade to Store</span>
        </button>
        <button
          onClick={async () => { await start.mutateAsync('merchant'); status.refetch() }}
          className="rounded-md border px-4 py-2"
          disabled={start.isPending}
        >
          Upgrade to Merchant
        </button>
      </div>
    </div>
  )
}

export default InlineUpgradePanel


