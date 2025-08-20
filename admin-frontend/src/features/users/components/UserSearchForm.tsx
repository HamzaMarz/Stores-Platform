import React from 'react'

type Props = {
  onSearch: (userId: number) => void
}

const UserSearchForm: React.FC<Props> = ({ onSearch }) => {
  const [userId, setUserId] = React.useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    onSearch(Number(userId))
  }

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2">
      <div>
        <label className="block text-sm mb-1">User ID</label>
        <input className="border rounded px-3 py-2" value={userId} onChange={(e) => setUserId(e.target.value)} required />
      </div>
      <button type="submit" className="px-4 py-2 rounded bg-slate-800 text-white">Open</button>
    </form>
  )
}

export default UserSearchForm


