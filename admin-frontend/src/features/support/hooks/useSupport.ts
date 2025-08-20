import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import type { ApiListResponse } from '@/features/support/types'
import type { SupportTicket, SupportTicketDetails } from '@/features/support/types'
import { useToastStore } from '@/hooks/useToastStore'

export const useSupportTickets = (status: string | undefined, offset: number, limit: number) => {
  return useQuery({
    queryKey: ['admin-support-tickets', status, offset, limit],
    queryFn: async () => {
      const body: any = { offset, limit, order: { column: 'created_at', direction: 'desc' } }
      if (status) body.status = status
      const res = await axiosInstance.post(ApiEndpoints.AdminSupportAllTickets, body)
      return res.data as ApiListResponse<SupportTicket>
    }
  })
}

export const useSupportDetails = (ticketId: number) => {
  return useQuery({
    queryKey: ['admin-support-details', ticketId],
    queryFn: async () => {
      const res = await axiosInstance.post(ApiEndpoints.AdminSupportTicketDetails, { id: ticketId, messages_limit: 20, messages_offset: 0 })
      const raw = (res.data?.data ?? res.data) as any
      const ticket: SupportTicket = {
        id: raw.id,
        user_id: raw.user_id,
        status: raw.status,
        topic: raw.topic ?? raw.subject,
        created_at: raw.created_at,
      }
      const messages = (raw.messages ?? []).map((m: any) => ({
        id: m.id,
        ticket_id: m.support_ticket_id ?? m.ticket_id ?? raw.id,
        sender: m.admin_id ? 'admin' : 'user',
        message: m.message,
        created_at: m.created_at,
      }))
      return { ticket, messages } as SupportTicketDetails
    }
  })
}

export const useSupportSendMessage = () => {
  const qc = useQueryClient()
  const show = useToastStore((s) => s.show)
  return useMutation({
    mutationFn: async (args: { ticket_id: number; message: string }) => {
      const res = await axiosInstance.post(ApiEndpoints.AdminSupportSendMessage, args)
      return res.data
    },
    onSuccess: () => {
      show('Message sent', 'success')
      qc.invalidateQueries({ queryKey: ['admin-support-details'] })
    }
  })
}

export const useSupportUpdateStatus = () => {
  const qc = useQueryClient()
  const show = useToastStore((s) => s.show)
  return useMutation({
    mutationFn: async (args: { id: number; status: string; upgrade_message?: string }) => {
      const res = await axiosInstance.put(ApiEndpoints.AdminSupportUpdateStatus, args)
      return res.data
    },
    onSuccess: () => {
      show('Ticket updated', 'success')
      qc.invalidateQueries({ queryKey: ['admin-support-details'] })
      qc.invalidateQueries({ queryKey: ['admin-support-tickets'] })
    }
  })
}


