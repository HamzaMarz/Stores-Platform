import React from 'react'
import { useListSellerOrders, useUpdateOrderStatus } from '../hooks/useSellerOrders'

const SellerOrdersPage: React.FC = () => {
	const [pagination, setPagination] = React.useState({ offset: 0, limit: 10 })
	const ordersQuery = useListSellerOrders(pagination)
	const updateStatus = useUpdateOrderStatus()

	return (
		<div className="space-y-6">
			<h2 className="text-lg font-semibold">Orders</h2>
			<div className="rounded-xl border bg-white p-4 shadow-sm">
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="text-left text-gray-600">
								<th className="p-2">ID</th>
								<th className="p-2">Date</th>
								<th className="p-2">Items</th>
								<th className="p-2">Total</th>
								<th className="p-2">Status</th>
								<th className="p-2 text-right">Actions</th>
							</tr>
						</thead>
						<tbody>
							{(ordersQuery.data?.items ?? []).map((o) => (
								<tr key={o.id} className="border-t">
									<td className="p-2">{o.id}</td>
									<td className="p-2">{o.created_at ? new Date(o.created_at).toLocaleString() : '-'}</td>
									<td className="p-2">{o.products.length}</td>
									<td className="p-2">${o.total.toFixed(2)}</td>
									<td className="p-2">{o.status}</td>
									<td className="p-2 text-right">
										<div className="flex justify-end gap-2">
											{o.status === 'CONFIRMED' && (
												<button onClick={async () => { await updateStatus.mutateAsync({ id: o.id, status: 'PROCESSING' }); await ordersQuery.refetch() }} className="rounded-md border px-3 py-1.5">Mark Processing</button>
											)}
											{o.status === 'PROCESSING' && (
												<button onClick={async () => { await updateStatus.mutateAsync({ id: o.id, status: 'SHIPPED' }); await ordersQuery.refetch() }} className="rounded-md border px-3 py-1.5">Mark Shipped</button>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="flex justify-between items-center mt-4">
					<button disabled={pagination.offset === 0} onClick={() => setPagination((p) => ({ ...p, offset: Math.max(0, p.offset - p.limit) }))} className="rounded-md border px-3 py-1.5 disabled:opacity-60">Prev</button>
					<div className="text-xs text-gray-600">Total: {ordersQuery.data?.count ?? 0}</div>
					<button onClick={() => setPagination((p) => ({ ...p, offset: p.offset + p.limit }))} className="rounded-md border px-3 py-1.5">Next</button>
				</div>
			</div>
		</div>
	)
}

export default SellerOrdersPage


