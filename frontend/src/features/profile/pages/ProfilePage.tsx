import React from 'react'
// Stripe Elements wrapper removed due to React 19 peer version conflicts
import VerifyEmailForm from '../components/VerifyEmailForm'
import OtpVerifyForm from '../components/OtpVerifyForm'
import AddCardForm from '../components/AddCardForm'
import CardList from '../components/CardList'
import { useAuthStore } from '../../auth/state/useAuthStore'
import ProfileInfoForm from '../components/ProfileInfoForm'
// import { useNavigate } from 'react-router-dom'
// import { AppRoutes } from '../../../constants/app'
import UpdatePasswordForm from '../components/UpdatePasswordForm'
import { useGetProfileInfo } from '../hooks/useProfileInfo'
import ProfileSidebar, { type ProfileSection } from '../components/ProfileSidebar'
import InlineUpgradePanel from '../../merchant/components/InlineUpgradePanel'
import SupportSection from '../../support/components/SupportSection'
import SettingsSection from '../../settings/components/SettingsSection'

// Elements removed

const ProfilePage: React.FC = () => {
	const [step, setStep] = React.useState<'email' | 'otp' | 'card' | 'done'>('email')
	const [emailState, setEmailState] = React.useState<{ email: string; createdAt?: string } | null>(null)
    const verified = useAuthStore((s) => s.user?.verified)
    const userType = useAuthStore((s) => s.user?.type)
    const isCustomer = userType === 'customer' || !userType
    const profileInfo = useGetProfileInfo()

    const visibleSections = React.useMemo(() => {
        const sections: { key: ProfileSection; label: string }[] = [{ key: 'profile', label: 'Profile' }, { key: 'security', label: 'Security' }, { key: 'support', label: 'Support' }]
        if (!verified) {
            sections.splice(1, 0, { key: 'verify', label: 'Verify' })
        } else {
            sections.splice(1, 0, { key: 'cards', label: 'Cards' })
            if (isCustomer) sections.splice(2, 0, { key: 'upgrade', label: 'Upgrade' })
            if (userType === 'store' || userType === 'merchant') sections.splice(2, 0, { key: 'settings', label: 'Settings' })
        }
        return sections
    }, [verified, isCustomer, userType])

    const [active, setActive] = React.useState<ProfileSection>(visibleSections[0].key)
    React.useEffect(() => {
        if (!visibleSections.find(s => s.key === active)) setActive(visibleSections[0].key)
    }, [visibleSections])

	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="text-2xl font-bold">Profile</h1>
			<p className="text-gray-600 mt-2">Verify your account and manage your settings.</p>

			<div className="mt-6 flex gap-8">
				<ProfileSidebar sections={visibleSections} active={active} onSelect={setActive} />
				<div className="flex-1 space-y-6">
					{active === 'profile' && (
						<div className="rounded-xl border bg-white p-6 shadow-sm">
							<h2 className="font-semibold">Your info</h2>
							<div className="mt-4">
								<ProfileInfoForm />
							</div>
						</div>
					)}
					{active === 'cards' && verified && (
						<div className="rounded-xl border bg-white p-6 shadow-sm">
							<h2 className="font-semibold">Saved cards</h2>
							<div className="mt-4">
								<CardList />
							</div>
						</div>
					)}
					{active === 'upgrade' && verified && isCustomer && (
						<div className="rounded-xl border bg-white p-6 shadow-sm">
							<h2 className="font-semibold">Upgrade</h2>
							<div className="mt-4">
								<InlineUpgradePanel />
							</div>
						</div>
					)}
					{active === 'security' && (
						<div className="rounded-xl border bg-white p-6 shadow-sm">
							<h2 className="font-semibold">
								{profileInfo.data?.has_password ? 'Update password' : 'Create password'}
							</h2>
							<div className="mt-4">
								<UpdatePasswordForm />
							</div>
						</div>
					)}
					{active === 'verify' && !verified && (
						<div className="rounded-xl border bg-white p-6 shadow-sm">
							<h2 className="font-semibold">Verify account</h2>
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
										onWrongOtp={() => setStep('email')}
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
					{active === 'settings' && (userType === 'store' || userType === 'merchant') && (
						<div className="rounded-xl border bg-white p-6 shadow-sm">
							<h2 className="font-semibold">Settings</h2>
							<div className="mt-4">
								<SettingsSection />
							</div>
						</div>
					)}
					{active === 'support' && (
						<div className="rounded-xl border bg-white p-6 shadow-sm">
							<h2 className="font-semibold">Support</h2>
							<div className="mt-4">
								<SupportSection />
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProfilePage

 