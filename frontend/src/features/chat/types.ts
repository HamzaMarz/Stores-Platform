export type ChatSummary = {
	id: number
	first: number
	second: number
	data: Record<string, unknown>
	created_at: string
	updated_at: string
	other_user_name: string
	other_user_pic: string | null
	other_user_id: number
	last_message?: {
		id: number
		message: string
		sender_id: number
		created_at: string
	}
}

export type ChatMessage = {
	id: number
	chat_id: number
	sender: number
	message: string
	attachment: string | null
	received: boolean
	read: boolean
	created_at: string
	updated_at: string
	sender_name?: string
	sender_pic?: string | null
}

export type ChatDetails = {
	id: number
	first: number
	second: number
	data: Record<string, unknown>
	created_at: string
	updated_at: string
	messages: ChatMessage[]
}

export type ChatsResponse = {
	data: ChatSummary[]
	count: number
}


