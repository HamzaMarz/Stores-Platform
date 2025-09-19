import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import { AppRoutes } from '../../../constants/app';
import { useOutletContext } from 'react-router-dom';
import GoogleContinueButton from '../components/GoogleContinueButton';
import { useGoogleAuthFlow } from '../hooks/useGoogleAuthFlow';
import VisualSection from '../../../ui/pages/_shared/VisualSection';
import { useAuthStore } from '../state/useAuthStore';

type OutletCtx = { toast: (t: { title: string; description?: string; tone?: 'success' | 'error' | 'info' }) => void };

const RegisterPage: React.FC = () => {
	const navigate = useNavigate();
	const { toast } = useOutletContext<OutletCtx>();
	const { isLoading, startFlow } = useGoogleAuthFlow();
	const user = useAuthStore((s) => s.user);

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Visual Section */}
			<VisualSection />

			{/* Register Form Section */}
			<div className="flex flex-1 justify-center items-center p-6">
				<div className="p-8 w-full max-w-md bg-white rounded-2xl shadow-lg">
					{/* Title */}
					<h1 className="mb-2 text-3xl font-semibold tracking-tight text-gray-900">
						Create your account
					</h1>
					<p className="mb-6 text-sm text-gray-500">
						Join the Stores Platform
					</p>

					{/* Register Form */}
					<div className="space-y-4">
						<RegisterForm
							onSuccess={() => {
								toast({ title: 'Account created', tone: 'success' });
								// Wait for user state to be updated, then navigate
								setTimeout(() => {
									const currentUser = useAuthStore.getState().user;
									if (currentUser?.type === 'merchant' || currentUser?.type === 'store') {
										navigate(AppRoutes.SellerWelcome);
									} else {
										navigate(AppRoutes.CustomerWelcome);
									}
								}, 100);
							}}
							onError={(m) => toast({ title: 'Registration failed', description: m, tone: 'error' })}
						/>
					</div>

					{/* Google Button */}
					<div className="mt-6">
						<GoogleContinueButton
							isLoading={isLoading}
							onClick={async () => {
								await startFlow();
								navigate(AppRoutes.Dashboard);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
