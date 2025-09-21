import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import { AppRoutes } from '../../../constants/app'
import { useOutletContext } from 'react-router-dom'
import GoogleContinueButton from '../components/GoogleContinueButton'
import { useGoogleAuthFlow } from '../hooks/useGoogleAuthFlow'
import ForgotPasswordDialog from '../components/ForgotPasswordDialog'
import OtpForm from '../components/OtpForm'
import UpdatePasswordForm from '../components/UpdatePasswordForm'
import VisualSection from '../../../ui/pages/_shared/VisualSection'
import { useAuthStore } from '../state/useAuthStore'

type OutletCtx = { toast: (t: { title: string; description?: string; tone?: 'success' | 'error' | 'info' }) => void }

const LoginPage: React.FC = () => {
	const navigate = useNavigate()
	const location = useLocation() as { state?: { from?: Location } }
	const { toast } = useOutletContext<OutletCtx>()
  const { isLoading, startFlow } = useGoogleAuthFlow()
  const [forgotOpen, setForgotOpen] = React.useState(false)
  const [emailForReset, setEmailForReset] = React.useState<string | null>(null)
  const [verifiedOtp, setVerifiedOtp] = React.useState<string | null>(null)
  const [createdAt, setCreatedAt] = React.useState<string | undefined>(undefined)

	return (
		<div className="flex min-h-screen">
			<VisualSection />
			
			<div className="flex flex-1 justify-center items-center p-4">
				<div className="w-full max-w-md">
					<h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
					<p className="mb-6 text-sm text-gray-600">Sign in to continue</p>
					{!emailForReset ? (
					<LoginForm
						onSuccess={() => {
							toast({ title: 'Signed in', tone: 'success' })
							// Wait for user state to be updated, then navigate
							setTimeout(() => {
								const currentUser = useAuthStore.getState().user;
								const targetPath = (location.state?.from as any)?.pathname
								if (targetPath) {
									navigate(targetPath)
								} else if (currentUser?.type === 'merchant' || currentUser?.type === 'store') {
									navigate(AppRoutes.SellerWelcome)
								} else {
									navigate(AppRoutes.CustomerWelcome)
								}
							}, 100);
						}}
						onError={(m) => toast({ title: 'Sign in failed', description: m, tone: 'error' })}
						onForgotPasswordClick={() => setForgotOpen(true)}
					/>
					) : null}
					{!emailForReset && (
					<div className="mt-4">
						<GoogleContinueButton isLoading={isLoading} onClick={async () => {
							await startFlow()
							navigate(AppRoutes.Dashboard)
						}} />
					</div>
					)}
					{!emailForReset && (
					<div className="mt-4 text-sm text-gray-600">
						Don't have an account?
						<button onClick={() => navigate(AppRoutes.Register)} className="ml-1 text-gray-900 underline underline-offset-4">Create one</button>
					</div>
					)}

					{emailForReset && !verifiedOtp && (
						<div className="mt-8">
							<h2 className="text-base font-semibold">Enter OTP</h2>
							<OtpForm
								email={emailForReset}
								createdAt={createdAt}
								onVerified={(otp) => {
									setVerifiedOtp(otp)
									toast({ title: 'Code verified', tone: 'success' })
								}}
								onWrongOtp={() => toast({ title: 'WRONG_OTP', tone: 'error' })}
								onFatalError={() => {
									setEmailForReset(null)
									setVerifiedOtp(null)
									setCreatedAt(undefined)
								}}
							/>
						</div>
					)}

					{emailForReset && verifiedOtp && (
						<div className="mt-8">
							<h2 className="text-base font-semibold">Set new password</h2>
							<UpdatePasswordForm
								email={emailForReset}
								otp={verifiedOtp}
								onSuccess={() => {
									toast({ title: 'Password updated', tone: 'success' })
									setEmailForReset(null)
									setVerifiedOtp(null)
									setCreatedAt(undefined)
								}}
							/>
						</div>
					)}
				</div>
			</div>
			
			<ForgotPasswordDialog
				open={forgotOpen}
				onClose={() => setForgotOpen(false)}
				onSent={(email, createdAtResp) => {
					setEmailForReset(email)
					setCreatedAt(createdAtResp)
					toast({ title: 'We sent a code', description: 'Check your email for the OTP', tone: 'info' })
				}}
				onError={(m) => toast({ title: 'Failed to send', description: m, tone: 'error' })}
			/>
		</div>
	)
}

export default LoginPage

