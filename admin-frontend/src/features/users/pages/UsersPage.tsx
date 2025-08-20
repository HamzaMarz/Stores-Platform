import React from 'react'
import { useNavigate } from 'react-router-dom'
import UserSearchForm from '@/features/users/components/UserSearchForm'

const UsersPage: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">Users</h1>
      <UserSearchForm onSearch={(id) => navigate(`/users/${id}`)} />
    </div>
  )
}

export default UsersPage


