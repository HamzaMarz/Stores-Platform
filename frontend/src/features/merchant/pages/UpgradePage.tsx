import React from 'react'

const UpgradePage: React.FC = () => {
	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="text-2xl font-bold">Upgrade your account</h1>
			<p className="text-gray-600 mt-2">Become a Store or Merchant to start listing products and managing orders.</p>
			<div className="mt-6 grid md:grid-cols-2 gap-4">
				<div className="rounded-xl border bg-white p-6 shadow-sm">
					<h2 className="font-semibold">Store</h2>
					<p className="text-sm text-gray-600 mt-1">Create a branded storefront and manage inventory.</p>
					<button className="mt-3 rounded-md bg-gray-900 text-white px-4 py-2 hover:bg-gray-800">Upgrade to Store</button>
				</div>
				<div className="rounded-xl border bg-white p-6 shadow-sm">
					<h2 className="font-semibold">Merchant</h2>
					<p className="text-sm text-gray-600 mt-1">Sell across the marketplace with advanced tools.</p>
					<button className="mt-3 rounded-md border px-4 py-2 hover:bg-gray-50">Upgrade to Merchant</button>
				</div>
			</div>
		</div>
	)
}

export default UpgradePage

