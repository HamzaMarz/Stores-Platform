import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export type Ticket = {
  id: number
  user_id: number
  topic: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  created_at?: string
  updated_at?: string
  rating?: number | null
}

export type TicketMessage = {
  id: number
  ticket_id: number
  user_id: number
  message: string
  attachment?: string | null
  created_at?: string
}

export const useCreateTicket = () => {
  return useMutation({
    mutationFn: async (payload: { topic: string; description: string }) => {
      const { data } = await axiosClient.put(ApiEndpoints.SupportCreateTicket, payload)
      return data as { statusCode: number; data: Ticket; message: string }
    },
  })
}

export const useListTickets = (params: { offset: number; limit: number; order: { column: 'created_at' | 'updated_at' | 'status'; direction: 'asc' | 'desc' } }) => {
  return useQuery({
    queryKey: ['support', 'tickets', params],
    queryFn: async () => {
      const { data } = await axiosClient.post(ApiEndpoints.SupportAllTickets, params)
      return data as { statusCode: number; data: Ticket[]; count: number; message: string }
    },
    select: (res) => ({ items: res.data, count: res.count }),
  })
}

export const useTicketDetails = (id?: number, page: { messages_offset: number; messages_limit: number } = { messages_offset: 0, messages_limit: 20 }) => {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ['support', 'ticket', id, page],
    queryFn: async () => {
      const { data } = await axiosClient.post(ApiEndpoints.SupportTicketDetails, { id, ...page })
      return data as { statusCode: number; data: Ticket & { messages: TicketMessage[] }; message: string }
    },
    select: (res) => res.data,
  })
}

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (payload: { ticket_id: number; message: string; attachment?: string }) => {
      const { data } = await axiosClient.put(ApiEndpoints.SupportSendMessage, payload)
      return data as { statusCode: number; data: TicketMessage; message: string }
    },
  })
}

export const useCloseTicket = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosClient.put(ApiEndpoints.SupportCloseTicket, { id })
      return data as { statusCode: number; message: string }
    },
  })
}

export const useRateTicket = () => {
  return useMutation({
    mutationFn: async (payload: { id: number; rating: number; review?: string }) => {
      const { data } = await axiosClient.put(ApiEndpoints.SupportRateTicket, payload)
      return data as { statusCode: number; message: string }
    },
  })
}


