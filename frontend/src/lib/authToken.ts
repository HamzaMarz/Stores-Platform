let inMemoryAccessToken: string | null = null

const ACCESS_TOKEN_COOKIE = 'sp_at'

const setCookie = (name: string, value: string, days = 1) => {
	const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
	document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

const getCookie = (name: string): string | null => {
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
	return match ? decodeURIComponent(match[2]) : null
}

const deleteCookie = (name: string) => {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export const tokenService = {
	setAccessToken(token: string) {
		inMemoryAccessToken = token
		setCookie(ACCESS_TOKEN_COOKIE, token)
	},
	getAccessToken(): string | null {
		return inMemoryAccessToken
	},
	initFromCookie() {
		const existing = getCookie(ACCESS_TOKEN_COOKIE)
		if (existing) inMemoryAccessToken = existing
	},
	clear() {
		inMemoryAccessToken = null
		deleteCookie(ACCESS_TOKEN_COOKIE)
	},
}

export default tokenService

