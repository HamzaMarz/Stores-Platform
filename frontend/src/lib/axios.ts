import axios, { AxiosError } from 'axios'
import { API_BASE_URL } from '../constants/api'
import { tokenService } from './authToken'

export const axiosClient = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
})

axiosClient.interceptors.request.use((config) => {
	const token = tokenService.getAccessToken()
	if (token) {
		config.headers = config.headers || {}
		config.headers['Authorization'] = `Bearer ${token}`
	}
	return config
})

axiosClient.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		// Treat canceled requests as AbortError so hooks can ignore them cleanly
		if ((error as any).code === 'ERR_CANCELED') {
			const abortErr = new Error('canceled')
			;(abortErr as any).name = 'AbortError'
			return Promise.reject(abortErr)
		}
		// Normalize backend errors
		const message = (error.response?.data as { message?: string } | undefined)?.message || error.message || 'Request failed'
		return Promise.reject(new Error(message))
	}
)

export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string }

