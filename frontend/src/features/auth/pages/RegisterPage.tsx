import React from 'react'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm'
import { AppRoutes } from '../../../constants/app'
import { useOutletContext } from 'react-router-dom'
import GoogleContinueButton from '../components/GoogleContinueButton'
import { useGoogleAuthFlow } from '../hooks/useGoogleAuthFlow'

type OutletCtx = { toast: (t: { title: string; description?: string; tone?: 'success' | 'error' | 'info' }) => void }

const RegisterPage: React.FC = () => {
	const navigate = useNavigate()
	const { toast } = useOutletContext<OutletCtx>()
	const { isLoading, startFlow } = useGoogleAuthFlow()

	return (
		<div className="container mx-auto px-4 py-16">
			<div className="mx-auto max-w-md bg-white rounded-xl shadow-sm p-6">
				<h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
				<p className="text-sm text-gray-600 mb-6">Join the Stores Platform</p>
				<RegisterForm
					onSuccess={() => {
						toast({ title: 'Account created', tone: 'success' })
						navigate(AppRoutes.Landing)
					}}
					onError={(m) => toast({ title: 'Registration failed', description: m, tone: 'error' })}
				/>
				<div className="mt-4">
					<GoogleContinueButton isLoading={isLoading} onClick={async () => {
						await startFlow()
						navigate(AppRoutes.Dashboard)
					}} />
				</div>
			</div>
		</div>
	)
}

export default RegisterPage

