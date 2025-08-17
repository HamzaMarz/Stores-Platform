import type React from 'react'
import type { Toast as ToastType } from '../hooks/useToast'

type Props = {
	toasts: ToastType[]
	onDismiss: (id: string) => void
}

const Toast: React.FC<Props> = ({ toasts, onDismiss }) => {
	return (
		<div className="toast-viewport">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={
						`rounded-lg shadow-lg px-4 py-3 border bg-white animate-in fade-in slide-in-from-top-4 duration-300 ` +
						(toast.tone === 'success'
							? 'border-emerald-200'
							: toast.tone === 'error'
							? 'border-rose-200'
							: 'border-gray-200')
					}
				>
					<div className="flex items-start gap-3">
						<div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-current text-transparent">
							{/* decorative dot */}
						</div>
						<div className="flex-1">
							<p className="text-sm font-semibold text-gray-900">{toast.title}</p>
							{toast.description && (
								<p className="text-xs text-gray-600 mt-0.5">{toast.description}</p>
							)}
						</div>
						<button
							aria-label="Dismiss"
							className="text-xs text-gray-500 hover:text-gray-800"
							onClick={() => onDismiss(toast.id)}
						>
							✕
						</button>
					</div>
				</div>
			))}
		</div>
	)
}

export default Toast

