import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

type ProfileInfo = {
  first_name: string
  last_name: string
  phone: string
  bank_name: string
  bank_account: string
}

const pickData = <T,>(payload: unknown): T => {
  if (!payload || typeof payload !== 'object') return payload as T
  const anyData: any = payload
  if (anyData.success === true && 'data' in anyData) return anyData.data as T
  if ('statusCode' in anyData && 'data' in anyData) return anyData.data as T
  return anyData as T
}

export const useGetProfileInfo = () => {
  return useQuery({
    queryKey: ['profile', 'info'],
    queryFn: async (): Promise<ProfileInfo> => {
      const { data } = await axiosClient.get(ApiEndpoints.ProfileInfo)
      const d = pickData<ProfileInfo>(data)
      return {
        first_name: d.first_name || '',
        last_name: d.last_name || '',
        phone: d.phone || '',
        bank_name: d.bank_name || '',
        bank_account: d.bank_account || '',
      }
    },
    enabled: true,
  })
}

export const useSaveProfileInfo = () => {
  return useMutation({
    mutationFn: async (payload: ProfileInfo) => {
      const { data } = await axiosClient.put(ApiEndpoints.Profile, payload)
      return pickData<any>(data)
    },
  })
}


