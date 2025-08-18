import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import type { CheckOtpPayload, SaveCardPayload, SetupIntentResponse, StartAddCardPayload, StartVerifyPayload } from '../types'

type StartResponse = { email?: string; created_at?: string }

const pickData = <T,>(payload: unknown): T => {
	if (!payload || typeof payload !== 'object') throw new Error('Malformed response')
	const anyData = payload as any
	if (anyData.success === true && 'data' in anyData) return anyData.data as T
	if ('statusCode' in anyData && 'data' in anyData) return anyData.data as T
	return anyData as T
}

export const useStartVerify = () => {
	return useMutation({
		mutationFn: async (payload: StartVerifyPayload): Promise<StartResponse> => {
			const { data } = await axiosClient.post(ApiEndpoints.ProfileVerify, payload)
			return pickData<StartResponse>(data)
		},
	})
}

export const useCheckVerifyOtp = () => {
	return useMutation({
		mutationFn: async (payload: CheckOtpPayload): Promise<{ ok: true }> => {
			const { data } = await axiosClient.post(ApiEndpoints.ProfileVerify, payload)
			return pickData<{ ok: true }>(data)
		},
	})
}

export const useStartAddCard = () => {
	return useMutation({
		mutationFn: async (payload: StartAddCardPayload): Promise<SetupIntentResponse> => {
			const { data } = await axiosClient.post(ApiEndpoints.ProfileVerify, payload)
			return pickData<SetupIntentResponse>(data)
		},
	})
}

export const useSaveFirstCard = () => {
	return useMutation({
		mutationFn: async (payload: SaveCardPayload): Promise<{ verified: boolean }> => {
			const { data } = await axiosClient.post(ApiEndpoints.ProfileVerify, payload)
			return pickData<{ verified: boolean }>(data)
		},
	})
}


