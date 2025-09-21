import { create } from 'zustand'
import type { ChatMessage, ChatSummary } from '../types'

type ChatState = {
  activeChatId: number | null
  setActiveChatId: (id: number | null) => void
  chats: Record<number, ChatSummary>
  setChats: (list: ChatSummary[]) => void
  upsertChat: (chat: ChatSummary) => void
  messages: Record<number, ChatMessage[]>
  setMessages: (chatId: number, msgs: ChatMessage[]) => void
  appendMessage: (chatId: number, msg: ChatMessage) => void
  updateMessage: (chatId: number, tempId: number | string, next: Partial<ChatMessage>) => void
}

export const useChatStore = create<ChatState>((set) => ({
  activeChatId: null,
  setActiveChatId: (id) => set({ activeChatId: id }),
  chats: {},
  setChats: (list) => set(() => ({
    chats: list.reduce<Record<number, ChatSummary>>((acc, c) => { acc[c.id] = c; return acc }, {})
  })),
  upsertChat: (chat) => set((s) => ({ chats: { ...s.chats, [chat.id]: chat } })),
  messages: {},
  setMessages: (chatId, msgs) => set((s) => ({ messages: { ...s.messages, [chatId]: msgs } })),
  appendMessage: (chatId, msg) => set((s) => ({ messages: { ...s.messages, [chatId]: [msg, ...(s.messages[chatId] || [])] } })),
  updateMessage: (chatId, tempId, next) => set((s) => ({
    messages: {
      ...s.messages,
      [chatId]: (s.messages[chatId] || []).map((m) => (m.id === tempId ? { ...m, ...next } : m)),
    },
  })),
}))


