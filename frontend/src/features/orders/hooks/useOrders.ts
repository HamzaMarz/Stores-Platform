import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export const useConfirmDelivery = () => {
  return useMutation({
    mutationFn: async (payload: { id: number }) => {
      const { data } = await axiosClient.post(ApiEndpoints.OrderConfirmDelivery as any, payload)
      return (data as any).data
    },
  })
}


