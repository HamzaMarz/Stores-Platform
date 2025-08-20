import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import type { ApiListResponse, UserSession } from '@/features/users/types'
import { useToastStore } from '@/hooks/useToastStore'

export const useUserSessions = (userId: number, offset: number, limit: number) => {
  return useQuery({
    queryKey: ['admin-user-sessions', userId, offset, limit],
    queryFn: async () => {
      const res = await axiosInstance.post(ApiEndpoints.AdminUserAllSessions, { user_id: userId, offset, limit })
      return res.data as ApiListResponse<UserSession>
    }
  })
}

export const useTerminateSession = () => {
  const qc = useQueryClient()
  const show = useToastStore((s) => s.show)
  return useMutation({
    mutationFn: async (sessionId: number) => {
      const res = await axiosInstance.put(ApiEndpoints.AdminUserTerminateSession, { session_id: sessionId })
      return res.data
    },
    onSuccess: () => {
      show('Session terminated', 'success')
      qc.invalidateQueries({ queryKey: ['admin-user-sessions'] })
    }
  })
}

export const useTerminateAllSessions = () => {
  const qc = useQueryClient()
  const show = useToastStore((s) => s.show)
  return useMutation({
    mutationFn: async (userId: number) => {
      const res = await axiosInstance.put(ApiEndpoints.AdminUserTerminateAllSessions, { user_id: userId })
      return res.data
    },
    onSuccess: () => {
      show('All sessions terminated', 'success')
      qc.invalidateQueries({ queryKey: ['admin-user-sessions'] })
    }
  })
}


