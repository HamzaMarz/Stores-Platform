export type ApiListResponse<T> = { data: T[]; count: number }
export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string }

export type SupportTicket = {
  id: number
  user_id: number
  status: string
  subject?: string
  topic?: string
  created_at: string
}

export type SupportMessage = {
  id: number
  ticket_id: number
  sender: 'user' | 'admin'
  message: string
  created_at: string
}

export type SupportTicketDetails = {
  ticket: SupportTicket
  messages: SupportMessage[]
}


