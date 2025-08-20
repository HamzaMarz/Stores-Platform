import React from 'react'
import Pagination from '@/components/Pagination'
import { useUpgradeOps, useApproveUpgrade, useRejectUpgrade } from '@/features/users/hooks/useUpgradeOps'

const PAGE = 10

const UpgradeOpsPage: React.FC = () => {
  const [page, setPage] = React.useState(1)
  const offset = (page - 1) * PAGE
  const { data, isLoading } = useUpgradeOps(offset, PAGE)
  const approve = useApproveUpgrade()
  const reject = useRejectUpgrade()

  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">Upgrade Operations</h1>
      {isLoading && <div>Loading...</div>}
      {data && (
        <>
          <table className="min-w-full border">
            <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left border-b">ID</th><th className="px-3 py-2 text-left border-b">User</th><th className="px-3 py-2 text-left border-b">Target</th><th className="px-3 py-2 text-left border-b">Status</th><th className="px-3 py-2 text-left border-b">Created</th><th className="px-3 py-2 text-left border-b">Actions</th></tr></thead>
            <tbody>
              {data.data.map(op => (
                <tr key={op.id} className="odd:bg-white even:bg-slate-50/50">
                  <td className="px-3 py-2 border-b">{op.id}</td>
                  <td className="px-3 py-2 border-b">{op.user_id}</td>
                  <td className="px-3 py-2 border-b">{op.target_type}</td>
                  <td className="px-3 py-2 border-b">{op.status}</td>
                  <td className="px-3 py-2 border-b">{op.created_at && new Date(op.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2 border-b">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 rounded bg-green-600 text-white" onClick={() => approve.mutate(op.id)} disabled={approve.isPending}>Approve</button>
                      <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={() => reject.mutate(op.id)} disabled={reject.isPending}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} pageSize={PAGE} total={data.count} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}

export default UpgradeOpsPage


