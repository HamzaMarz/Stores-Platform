import React from 'react'
import { useAdminLogin } from '@/features/auth/hooks/useAdminLogin'

type Props = {
  onSuccess: () => void
}

const LoginForm: React.FC<Props> = ({ onSuccess }) => {
  const { mutate, isPending } = useAdminLogin()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) return
    mutate({ username, password }, { onSuccess })
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-sm space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          className="w-full border rounded-md px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isPending} className="w-full bg-slate-800 text-white rounded-md px-3 py-2">
        {isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}

export default LoginForm


