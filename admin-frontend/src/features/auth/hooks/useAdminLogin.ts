import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { ApiEndpoints } from '@/constants/api'
import { useToastStore } from '@/hooks/useToastStore'

type LoginInput = {
  username: string
  password: string
}

type LoginResponse = { token?: string }

export const useAdminLogin = () => {
  const show = useToastStore((s) => s.show)
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const res = await axiosInstance.post(ApiEndpoints.AdminLogin, input)
      return res.data as LoginResponse
    },
    onSuccess: () => {
      show('Logged in', 'success')
    }
  })
}


