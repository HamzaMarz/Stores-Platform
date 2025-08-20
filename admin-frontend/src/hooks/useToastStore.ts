import { create } from 'zustand'

type ToastKind = 'success' | 'error' | 'info'

type ToastState = {
  message: string | null
  kind: ToastKind
  show: (message: string, kind?: ToastKind) => void
  clear: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  kind: 'info',
  show: (message, kind = 'info') => set({ message, kind }),
  clear: () => set({ message: null })
}))


