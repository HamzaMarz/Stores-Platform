import React from 'react'
import type { UserBasic } from '@/features/users/types'
import { useRestrictUser, useResetUserPassword } from '@/features/users/hooks/useRestrictAndReset'

type Props = {
  user: UserBasic
}

const UserHeader: React.FC<Props> = ({ user }) => {
  const restrict = useRestrictUser()
  const reset = useResetUserPassword()

  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <div className="text-lg font-semibold">User #{user.id} {user.username ? `• ${user.username}` : ''}</div>
        <div className="text-slate-600 text-sm">{user.email}</div>
        <div className="text-slate-600 text-sm">Type: {user.type ?? 'N/A'}</div>
      </div>
      <div className="flex gap-2">
        <button
          className="px-3 py-1.5 rounded border"
          onClick={() => restrict.mutate({ user_id: user.id, restricted: !user.restricted })}
          disabled={restrict.isPending}
        >{user.restricted ? 'Unrestrict' : 'Restrict'}</button>
        <button
          className="px-3 py-1.5 rounded bg-slate-800 text-white"
          onClick={() => reset.mutate(user.id)}
          disabled={reset.isPending}
        >Reset Password</button>
      </div>
    </div>
  )
}

export default UserHeader


