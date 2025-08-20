import React from 'react'
import { useStartUpgrade, useUpgradeStatus } from '../hooks/useUpgrade'
import { useAuthStore } from '../../auth/state/useAuthStore'
import Spinner from '../../../components/Spinner'

const InlineUpgradePanel: React.FC = () => {
  const status = useUpgradeStatus()
  const start = useStartUpgrade()
  const type = useAuthStore((s) => s.user?.type)
  const isCustomer = type === 'customer' || !type

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-700">
        {status.isLoading ? 'Loading status…' : (
          (() => {
            const data = (status.data as any) || {}
            const active = data.active
            const rejected: any[] = data.rejected || []
            if (active) {
              return (
                <div>
                  <div className="font-medium">Active request</div>
                  <table className="mt-2 w-full text-left text-xs">
                    <thead className="text-gray-500">
                      <tr><th className="py-1 pr-3">ID</th><th className="py-1 pr-3">Status</th><th className="py-1 pr-3">Target</th><th className="py-1">Created</th></tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="py-1 pr-3">{active.id}</td>
                        <td className="py-1 pr-3">{active.status}</td>
                        <td className="py-1 pr-3">{active.target || '-'}</td>
                        <td className="py-1">{active.created_at ? new Date(active.created_at).toLocaleString() : '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            }
            return (
              <div>
                <div className="font-medium">Rejected requests</div>
                {rejected.length === 0 ? (
                  <div className="text-gray-500 mt-1">No rejected requests.</div>
                ) : (
                  <table className="mt-2 w-full text-left text-xs">
                    <thead className="text-gray-500">
                      <tr><th className="py-1 pr-3">ID</th><th className="py-1 pr-3">Status</th><th className="py-1 pr-3">Target</th><th className="py-1">Created</th></tr>
                    </thead>
                    <tbody>
                      {rejected.map((r) => (
                        <tr key={r.id} className="border-t">
                          <td className="py-1 pr-3">{r.id}</td>
                          <td className="py-1 pr-3">{r.status}</td>
                          <td className="py-1 pr-3">{r.target || '-'}</td>
                          <td className="py-1">{r.created_at ? new Date(r.created_at).toLocaleString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )
          })()
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={async () => { await start.mutateAsync('store'); status.refetch() }}
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-4 py-2 disabled:opacity-60"
          disabled={start.isPending || !isCustomer || Boolean((status.data as any)?.active)}
        >
          {start.isPending && <Spinner size={16} />}
          <span>Upgrade to Store</span>
        </button>
        <button
          onClick={async () => { await start.mutateAsync('merchant'); status.refetch() }}
          className="rounded-md border px-4 py-2 disabled:opacity-60"
          disabled={start.isPending || !isCustomer || Boolean((status.data as any)?.active)}
        >
          Upgrade to Merchant
        </button>
      </div>
    </div>
  )
}

export default InlineUpgradePanel


