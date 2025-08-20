import axios from 'axios'
import { API_BASE_URL } from '@/constants/api'
import { useToastStore } from '@/hooks/useToastStore'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: string = error?.response?.data?.message || error?.message || 'Request failed'
    useToastStore.getState().show(message, 'error')
    return Promise.reject(error)
  }
)


