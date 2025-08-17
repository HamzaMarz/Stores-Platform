import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import { AppRoutes } from '../../../constants/app'
import { useOutletContext } from 'react-router-dom'
import GoogleContinueButton from '../components/GoogleContinueButton'
import { useGoogleAuthFlow } from '../hooks/useGoogleAuthFlow'

type OutletCtx = { toast: (t: { title: string; description?: string; tone?: 'success' | 'error' | 'info' }) => void }

const LoginPage: React.FC = () => {
	const navigate = useNavigate()
	const location = useLocation() as { state?: { from?: Location } }
	const { toast } = useOutletContext<OutletCtx>()
	const { isLoading, startFlow } = useGoogleAuthFlow()

	return (
		<div className="container mx-auto px-4 py-16">
			<div className="mx-auto max-w-md bg-white rounded-xl shadow-sm p-6">
				<h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
				<p className="text-sm text-gray-600 mb-6">Sign in to continue</p>
				<LoginForm
					onSuccess={() => {
						toast({ title: 'Signed in', tone: 'success' })
						navigate((location.state?.from as any)?.pathname || AppRoutes.Dashboard)
					}}
					onError={(m) => toast({ title: 'Sign in failed', description: m, tone: 'error' })}
				/>
				<div className="mt-4">
					<GoogleContinueButton isLoading={isLoading} onClick={async () => {
						await startFlow()
						navigate(AppRoutes.Dashboard)
					}} />
				</div>
				<div className="mt-4 text-sm text-gray-600">
					Don’t have an account?
					<button onClick={() => navigate(AppRoutes.Register)} className="ml-1 text-gray-900 underline underline-offset-4">Create one</button>
				</div>
			</div>
		</div>
	)
}

export default LoginPage

