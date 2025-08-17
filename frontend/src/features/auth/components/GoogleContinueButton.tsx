import React from 'react'

type Props = {
	onClick: () => void
	isLoading?: boolean
	disabled?: boolean
	className?: string
}

const GoogleContinueButton: React.FC<Props> = ({ onClick, isLoading = false, disabled = false, className }) => {
	const isDisabled = disabled || isLoading
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			className={`w-full rounded-md border bg-white text-gray-900 px-5 py-2.5 hover:bg-gray-50 transition disabled:opacity-60 flex items-center justify-center gap-2 ${className || ''}`}
		>
			{isLoading ? (
				<svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
				</svg>
			) : (
				<svg width="18" height="18" viewBox="0 0 48 48" fill="none" aria-hidden>
					<path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.308 32.91 29.043 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C33.64 6.053 29.084 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
					<path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.26 16.282 18.74 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C33.64 6.053 29.084 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
					<path fill="#4CAF50" d="M24 44c5.003 0 9.574-1.917 13.05-5.05l-6.022-4.909C29.01 35.994 26.622 37 24 37c-5.01 0-9.267-3.069-10.976-7.406l-6.597 5.086C9.745 39.753 16.302 44 24 44z"/>
					<path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.045 3.084-3.277 5.582-6.275 7.016l.005-.003 6.022 4.909C39.24 37.34 42 31.165 42 24c0-1.341-.138-2.651-.389-3.917z"/>
				</svg>
			)}
			Continue with Google
		</button>
	)
}

export default GoogleContinueButton


