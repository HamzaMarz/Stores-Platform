import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import type { ChatDetails, ChatsResponse, ChatMessage, ChatSummary } from '../types'
import { useChatStore } from '../state/useChatStore'
import { useAuthStore } from '../../auth/state/useAuthStore'

const CHATS_QK = ['chats'] as const
const CHAT_QK = (id: number) => ['chat', id] as const

export function useChatsList(offset = 0, limit = 20) {
  const query = useQuery({
    queryKey: [...CHATS_QK, offset, limit],
    queryFn: async () => {
      const { data } = await axiosClient.post<{ statusCode: number; data: ChatSummary[]; count: number }>(ApiEndpoints.ChatAll, { offset, limit })
      return { data: data.data, count: data.count } as ChatsResponse
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000, // Poll every 30 seconds
  })
  return query
}

export function useChatDetails(id: number | null, messages_limit = 30, messages_offset = 0) {
  const enabled = !!id
  return useQuery({
    queryKey: id ? [...CHAT_QK(id), messages_limit, messages_offset] : ['chat', 'idle'],
    enabled,
    queryFn: async () => {
      const { data } = await axiosClient.post<{ statusCode: number; data: ChatDetails }>(ApiEndpoints.ChatDetails, {
        id,
        messages_limit,
        messages_offset,
      })
      return data.data
    },
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const { appendMessage, updateMessage, upsertChat } = useChatStore()
  
  return useMutation({
    mutationFn: async (payload: { chat_id: number; message: string; attachment?: string | null }) => {
      const { data } = await axiosClient.put<{ statusCode: number; data: ChatMessage }>(ApiEndpoints.ChatSendMessage, payload)
      return data.data
    },
    onMutate: async (payload) => {
      if (!user) return
      
      // Create optimistic message
      const tempId = `temp-${Date.now()}`
      const optimisticMessage: ChatMessage = {
        id: tempId as any,
        chat_id: payload.chat_id,
        sender: Number(user.id),
        message: payload.message,
        attachment: payload.attachment || null,
        received: false,
        read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender_name: user.name,
        sender_pic: null,
      }
      
      // Add optimistic message immediately
      appendMessage(payload.chat_id, optimisticMessage)
      
      // Update chat's updated_at to move it to top
      const chats = qc.getQueryData<ChatsResponse>([...CHATS_QK, 0, 20])
      if (chats) {
        const updatedChats = chats.data.map(chat => 
          chat.id === payload.chat_id 
            ? { ...chat, updated_at: new Date().toISOString() }
            : chat
        ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        
        qc.setQueryData([...CHATS_QK, 0, 20], { ...chats, data: updatedChats })
      }
      
      return { tempId, optimisticMessage }
    },
    onSuccess: (msg, variables, context) => {
      if (context) {
        // Replace optimistic message with real one
        updateMessage(variables.chat_id, context.tempId, {
          id: msg.id,
          created_at: msg.created_at,
          updated_at: msg.updated_at,
        })
      }
      
      qc.invalidateQueries({ queryKey: CHAT_QK(msg.chat_id) })
      qc.invalidateQueries({ queryKey: CHATS_QK })
    },
    onError: (error, variables, context) => {
      if (context) {
        // Mark optimistic message as failed
        updateMessage(variables.chat_id, context.tempId, {
          message: `${context.optimisticMessage.message} (Failed to send)`,
        })
      }
    },
  })
}

export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { chat_id: number }) => {
      await axiosClient.put(ApiEndpoints.ChatMarkRead, payload)
    },
    onSuccess: (_, { chat_id }) => {
      qc.invalidateQueries({ queryKey: CHAT_QK(chat_id) })
      qc.invalidateQueries({ queryKey: CHATS_QK })
    },
  })
}

export function useCreateChat() {
  const qc = useQueryClient()
  const { upsertChat } = useChatStore()
  
  return useMutation({
    mutationFn: async (payload: { user_id: number }) => {
      const { data } = await axiosClient.put<{ statusCode: number; data: ChatSummary }>(ApiEndpoints.ChatCreate, payload)
      return data.data
    },
    onSuccess: (chat) => {
      upsertChat(chat)
      qc.invalidateQueries({ queryKey: CHATS_QK })
    },
  })
}

export const chatQueryKeys = { CHATS_QK, CHAT_QK }


