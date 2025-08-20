import React from 'react'
import { useParams } from 'react-router-dom'
import { useUserDetails } from '@/features/users/hooks/useUserDetails'
import UserHeader from '@/features/users/components/UserHeader'
import UserTabs from '@/features/users/components/UserTabs'

const UserDetailsPage: React.FC = () => {
  const params = useParams()
  const userId = Number(params.id)
  const { data, isLoading } = useUserDetails(userId)

  if (Number.isNaN(userId)) return <div className="p-4">Invalid user id</div>
  if (isLoading) return <div>Loading...</div>
  if (!data || !data.success) return <div>Not found</div>

  return (
    <div>
      <UserHeader user={data.data.user} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="border rounded p-3"><div className="text-sm text-slate-600">Sessions</div><div className="text-xl font-semibold">{data.data.counts.sessions}</div></div>
        <div className="border rounded p-3"><div className="text-sm text-slate-600">Payment methods</div><div className="text-xl font-semibold">{data.data.counts.payment_methods}</div></div>
        <div className="border rounded p-3"><div className="text-sm text-slate-600">Open tickets</div><div className="text-xl font-semibold">{data.data.counts.open_tickets}</div></div>
        <div className="border rounded p-3"><div className="text-sm text-slate-600">Ratings</div><div className="text-xl font-semibold">{data.data.counts.ratings}</div></div>
        <div className="border rounded p-3"><div className="text-sm text-slate-600">Orders</div><div className="text-xl font-semibold">{data.data.counts.orders}</div></div>
        <div className="border rounded p-3"><div className="text-sm text-slate-600">Total paid</div><div className="text-xl font-semibold">{(data.data.counts.total_paid ?? 0).toFixed(2)}</div></div>
      </div>
      <UserTabs userId={userId} />
    </div>
  )
}

export default UserDetailsPage


