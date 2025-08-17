import { useCallback, useState } from 'react'

export type Toast = { id: string; title: string; description?: string; tone?: 'success' | 'error' | 'info' }

export const useToast = () => {
	const [toasts, setToasts] = useState<Toast[]>([])

	const show = useCallback((toast: Omit<Toast, 'id'>) => {
		const id = crypto.randomUUID()
		setToasts((prev) => [...prev, { id, ...toast }])
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id))
		}, 3200)
	}, [])

	const remove = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id))
	}, [])

	return { toasts, show, remove }
}

