import React from 'react'

const ProfilePage: React.FC = () => {
	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="text-2xl font-bold">Profile verification</h1>
			<p className="text-gray-600 mt-2">Please verify your email and complete KYC to activate your account.</p>
			<div className="mt-6 grid gap-4 md:grid-cols-2">
				<div className="rounded-xl border bg-white p-6 shadow-sm">
					<h2 className="font-semibold">Email verification</h2>
					<p className="text-sm text-gray-600 mt-1">We sent you a link. Didn't get it?</p>
					<button className="mt-3 rounded-md border px-4 py-2 hover:bg-gray-50">Resend email</button>
				</div>
				<div className="rounded-xl border bg-white p-6 shadow-sm">
					<h2 className="font-semibold">Identity verification</h2>
					<p className="text-sm text-gray-600 mt-1">Upload your documents to verify identity.</p>
					<button className="mt-3 rounded-md bg-gray-900 text-white px-4 py-2 hover:bg-gray-800">Start verification</button>
				</div>
			</div>
		</div>
	)
}

export default ProfilePage

