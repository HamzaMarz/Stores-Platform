export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string }
export type ApiListResponse<T> = { data: T[]; count: number }

export type UserBasic = {
  id: number
  email?: string
  username?: string
  type?: string
  restricted?: boolean
}

export type UserDetails = {
  user: UserBasic
  counts: {
    sessions: number
    payment_methods: number
    open_tickets: number
    ratings: number
    orders: number
    total_paid: number
  }
}

export type UserSession = {
  id: number
  created_at?: string
  ip?: string
  user_agent?: string
}

export type UserPaymentMethod = {
  id: number
  brand?: string
  last4?: string
  type?: string
  created_at?: string
  deleted?: boolean
}

export type UserTransaction = {
  id: number
  amount?: number
  currency?: string
  status?: string
  created_at?: string
}

export type UserSupportTicket = {
  id: number
  status?: string
  subject?: string
  created_at?: string
}

export type UserRating = {
  id: number
  product_id?: number
  stars?: number
  comment?: string
  created_at?: string
}

export type UserOrder = {
  id: number
  status?: string
  total?: number
  created_at?: string
}

export type UpgradeOperation = {
  id: number
  user_id: number
  status?: string
  target_type?: string
  created_at?: string
}


