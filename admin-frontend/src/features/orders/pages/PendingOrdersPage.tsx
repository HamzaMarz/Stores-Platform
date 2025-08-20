import React from 'react'
import { usePendingOrders } from '@/features/orders/hooks/usePendingOrders'
import PendingOrdersTable from '@/features/orders/components/PendingOrdersTable'
import Pagination from '@/components/Pagination'

const PAGE_SIZE = 10

const PendingOrdersPage: React.FC = () => {
  const [page, setPage] = React.useState(1)
  const offset = (page - 1) * PAGE_SIZE
  const { data, isLoading } = usePendingOrders(offset, PAGE_SIZE)

  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">Pending Refund Requests</h1>
      {isLoading && <div>Loading...</div>}
      {!!data && (
        <>
          <PendingOrdersTable rows={data.data} />
          <Pagination page={page} pageSize={PAGE_SIZE} total={data.count} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}

export default PendingOrdersPage


