import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

type UpgradeTarget = 'merchant' | 'store'
type UpgradeStartPayload = { step: 'start'; target: UpgradeTarget }
type UpgradeStatusPayload = { step: 'status' }

const pickData = <T,>(payload: unknown): T => {
  if (!payload || typeof payload !== 'object') return payload as T
  const anyData: any = payload
  if (anyData.success === true && 'data' in anyData) return anyData.data as T
  if ('statusCode' in anyData && 'data' in anyData) return anyData.data as T
  return anyData as T
}

export const useUpgradeStatus = () => {
  return useQuery({
    queryKey: ['profile', 'upgrade', 'status'],
    queryFn: async (): Promise<{ status: string; target?: UpgradeTarget } | any> => {
      const { data } = await axiosClient.post(ApiEndpoints.ProfileUpgrade, { step: 'status' } as UpgradeStatusPayload)
      return pickData<any>(data)
    },
  })
}

export const useStartUpgrade = () => {
  return useMutation({
    mutationFn: async (target: UpgradeTarget) => {
      const { data } = await axiosClient.post(ApiEndpoints.ProfileUpgrade, { step: 'start', target } as UpgradeStartPayload)
      return pickData<any>(data)
    },
  })
}


