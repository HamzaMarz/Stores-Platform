import { create } from 'zustand'

export type AuthUser = {
	id: string
	email: string
	name: string
}

type AuthState = {
	user: AuthUser | null
	isAuthenticated: boolean
	setUser: (user: AuthUser | null) => void
	accessToken: string | null
	setAccessToken: (token: string | null) => void
	isBootstrapped: boolean
	setBootstrapped: (v: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,
	setUser: (user) => set({ user, isAuthenticated: !!user }),
	accessToken: null,
	setAccessToken: (token) => set({ accessToken: token }),
	isBootstrapped: false,
	setBootstrapped: (v) => set({ isBootstrapped: v }),
}))

