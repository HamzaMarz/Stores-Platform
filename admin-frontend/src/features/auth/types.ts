export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string }

export type AdminMe = {
  id: number
  username: string
}


