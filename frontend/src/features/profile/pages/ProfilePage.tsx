import React from 'react'
// Stripe Elements wrapper removed due to React 19 peer version conflicts
import VerifyEmailForm from '../components/VerifyEmailForm'
import OtpVerifyForm from '../components/OtpVerifyForm'
import AddCardForm from '../components/AddCardForm'
import CardList from '../components/CardList'
import { useAuthStore } from '../../auth/state/useAuthStore'
import ProfileInfoForm from '../components/ProfileInfoForm'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '../../../constants/app'
import UpdatePasswordForm from '../components/UpdatePasswordForm'
import ProfileSidebar, { type ProfileSection } from '../components/ProfileSidebar'
import InlineUpgradePanel from '../../merchant/components/InlineUpgradePanel'

// Elements removed

const ProfilePage: React.FC = () => {
	const [step, setStep] = React.useState<'email' | 'otp' | 'card' | 'done'>('email')
	const [emailState, setEmailState] = React.useState<{ email: string; createdAt?: string } | null>(null)
    const verified = useAuthStore((s) => s.user?.verified)
    const navigate = useNavigate()
    const [active, setActive] = React.useState<ProfileSection>('profile')
    const userType = useAuthStore((s) => s.user?.type)
    const isCustomer = userType === 'customer' || !userType

	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="text-2xl font-bold">Profile</h1>
			<p className="text-gray-600 mt-2">Verify your account and manage payment methods.</p>

			<div className="mt-6 flex gap-8">
				<ProfileSidebar
					sections={[
						{ key: 'profile', label: 'Profile' },
						{ key: 'cards', label: 'Cards' },
						...(isCustomer ? ([{ key: 'upgrade', label: 'Upgrade' }] as const) : []),
						{ key: 'security', label: 'Security' },
					]}
					active={active}
					onSelect={setActive}
				/>
				<div className="flex-1 space-y-6">
					{active === 'profile' && (
						<div className="rounded-xl border bg-white p-6 shadow-sm">
							<h2 className="font-semibold">Your info</h2>
							<div className="mt-4">
								<ProfileInfoForm />
							</div>
						</div>
					)}
					{active === 'cards' && (
						<div className="rounded-xl border bg-white p-6 shadow-sm">
							<h2 className="font-semibold">Saved cards</h2>
							<div className="mt-4">
								<CardList />
							</div>
							{!verified && (
								<div className="mt-8 border-t pt-6">
									<h3 className="font-medium">Verify account</h3>
									<div className="mt-4">
										{step === 'email' && (
											<VerifyEmailForm
												onStarted={({ email, createdAt }) => {
													setEmailState({ email, createdAt })
													setStep('otp')
												}}
											/>
										)}
										{step === 'otp' && emailState && (
											<OtpVerifyForm
												email={emailState.email}
												createdAt={emailState.createdAt}
												onVerified={() => setStep('card')}
												onWrongOtp={() => {}}
											/>
										)}
										{step === 'card' && (
											<AddCardForm onCompleted={() => setStep('done')} />
										)}
										{step === 'done' && (
											<div className="text-sm text-emerald-700">Your account is verified and card saved.</div>
										)}
									</div>
								</div>
							)}
						</div>
					)}
					{active === 'upgrade' && isCustomer && (
						<div className="rounded-xl border bg-white p-6 shadow-sm">
							<h2 className="font-semibold">Upgrade</h2>
							<div className="mt-4">
								<InlineUpgradePanel />
							</div>
						</div>
					)}
					{active === 'security' && (
						<div className="rounded-xl border bg-white p-6 shadow-sm">
							<h2 className="font-semibold">Update password</h2>
							<div className="mt-4">
								<UpdatePasswordForm />
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProfilePage

 