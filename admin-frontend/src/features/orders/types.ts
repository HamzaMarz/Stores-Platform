export type ApiListResponse<T> = { data: T[]; count: number }

export enum OrderStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  CANCELLING = 'CANCELLING',
  BLOCKED = 'BLOCKED',
}

export type OrderSummary = {
  id: number
  user_id: number
  total: number
  status: string
  created_at: string
}

export type SearchOrdersInput = {
  user_id: number
  status?: string
  offset: number
  limit: number
}


