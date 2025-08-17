import React from 'react'

type Props = { title: string; subtitle?: string; children: React.ReactNode }

const AuthContainer: React.FC<Props> = ({ title, subtitle, children }) => {
	return (
		<div className="container mx-auto px-4 py-16">
			<div className="mx-auto max-w-md bg-white rounded-xl shadow-sm p-6">
				<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
				{subtitle && <p className="text-sm text-gray-600 mb-6">{subtitle}</p>}
				{children}
			</div>
		</div>
	)
}

export default AuthContainer

