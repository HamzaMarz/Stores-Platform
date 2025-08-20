import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Toast from '@/components/Toast'
import { AppRoutes } from '@/constants/app'
import { useAdminLogout } from '@/features/auth/hooks/useAdminLogout'

const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const { mutate: logout, isPending } = useAdminLogout({ onSuccess: () => navigate(AppRoutes.Login) })

  return (
    <div className="min-h-full grid grid-rows-[auto,1fr]">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={AppRoutes.Dashboard} className="font-semibold">Admin Dashboard</Link>
          <button onClick={() => logout()} disabled={isPending} className="px-3 py-1.5 bg-slate-800 text-white rounded-md">
            {isPending ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </header>
      <div className="grid grid-cols-[220px,1fr]">
        <aside className="border-r bg-slate-50 p-3">
          <nav className="flex flex-col gap-1">
            <NavLink to={AppRoutes.OrdersPending} className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-slate-200' : 'hover:bg-slate-100'}`}>Pending Orders</NavLink>
            <NavLink to={AppRoutes.OrdersSearch} className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-slate-200' : 'hover:bg-slate-100'}`}>Search Orders</NavLink>
            <NavLink to={AppRoutes.Users} className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-slate-200' : 'hover:bg-slate-100'}`}>Users</NavLink>
            <NavLink to={AppRoutes.UpgradeOps} className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-slate-200' : 'hover:bg-slate-100'}`}>Upgrade Ops</NavLink>
            <NavLink to={AppRoutes.Support} className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-slate-200' : 'hover:bg-slate-100'}`}>Support</NavLink>
          </nav>
        </aside>
        <main className="p-4 bg-white">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  )
}

export default AdminLayout


