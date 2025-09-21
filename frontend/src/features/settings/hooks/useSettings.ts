import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import type { Settings, StoreSettingsUpdateInput, MerchantSettingsUpdateInput } from '../types'

export const useGetSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async (): Promise<Settings> => {
      const { data } = await axiosClient.get(ApiEndpoints.SettingsGet)
      return data.data
    },
    enabled: true,
  })
}

export const useUpdateStoreSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (payload: StoreSettingsUpdateInput) => {
      const { data } = await axiosClient.put(ApiEndpoints.SettingsStore, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

export const useUpdateMerchantSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (payload: MerchantSettingsUpdateInput) => {
      const { data } = await axiosClient.put(ApiEndpoints.SettingsMerchant, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}
