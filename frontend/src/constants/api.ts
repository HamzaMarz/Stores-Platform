// هان صار تعديل
export const ApiEndpoints = {
	// Authentication
	Login: "/api/v1/user/auth/login",
	Register: "/api/v1/user/auth/register",
	Logout: "/api/v1/user/auth/logout",
	Me: "/api/v1/user/auth/me",
	UserGoogleLogin: "/api/v1/user/auth/google/login",
	ForgotPassword: "/api/v1/user/auth/forgot-password",
	CheckOtp: "/api/v1/user/auth/check-otp",
	UpdatePassword: "/api/v1/user/auth/update-password",

	// Profile
	ProfileEdit: "/api/v1/user/profile/edit",
	ProfileVerify: "/api/v1/user/profile/verify",
	ProfileInfo: "/api/v1/user/profile/info",
	ProfileChangePassword: "/api/v1/user/profile/change-password",
	ProfileUpgrade: "/api/v1/user/profile/upgrade",
	ProfileUpdatePic: "/api/v1/user/profile/update-pic",

	// Settings
	SettingsGet: "/api/v1/user/settings",
	SettingsStore: "/api/v1/user/settings/store",
	SettingsMerchant: "/api/v1/user/settings/merchant",

	// Payment Methods
	PaymentMethodsEnsure: "/api/v1/user/profile/payment-methods/ensure",
	PaymentMethodsAdd: "/api/v1/user/profile/payment-methods/add",
	PaymentMethodsSave: "/api/v1/user/profile/payment-methods/save",
	PaymentMethodsList: "/api/v1/user/profile/payment-methods/list",
	PaymentMethodsDelete: "/api/v1/user/profile/payment-methods/delete",

	// Payments
	PaymentCreate: "/api/v1/user/payment/create",
	PaymentStatus: "/api/v1/user/payment/status",
	PaymentCreatePayment: "/api/v1/user/payment/create-payment",
	PaymentGetStatus: "/api/v1/user/payment/get-payment-status",
	PaymentSessionCreate: "/api/v1/user/payment/session-create",

	// Products (General)
	// صار تعديل هان: توحيد مع مسارات الباكند
	Products: "/api/v1/product/all",
	ProductDetails: "/api/v1/product/details",
	ProductSearch: "/api/v1/product/search",

	// Seller Products
	SellerProducts: "/api/v1/user/seller/product/all",
	SellerProductAdd: "/api/v1/user/seller/product/add",
	SellerProductAllUnlisted: "/api/v1/user/seller/product/all-unlisted",
	SellerProductEdit: "/api/v1/user/seller/product/edit",
	SellerProductEnlist: "/api/v1/user/seller/product/enlist",
	SellerProductUnlist: "/api/v1/user/seller/product/unlist",
	SellerProductSearch: "/api/v1/user/seller/product/search",

	// Store
	StoreDetails: "/api/v1/store/details",
	StoreProducts: "/api/v1/store/products",
	StoreSearch: "/api/v1/store/search",

	// Cart
	CartAdd: "/api/v1/user/cart/add",
	CartAll: "/api/v1/user/cart/all",
	CartDetails: "/api/v1/user/cart/details",
	CartRemove: "/api/v1/user/cart/remove",
	CartRemoveItem: "/api/v1/user/cart/remove-item",
	CartUpdateQuantity: "/api/v1/user/cart/update-quantity",
	CartCheckout: "/api/v1/user/cart/checkout",

	// Orders
	OrderConfirmDelivery: "/api/v1/user/order/confirm-delivery",

	// Support
	SupportCreateTicket: "/api/v1/user/support/create-ticket",
	SupportAllTickets: "/api/v1/user/support/all-tickets",
	SupportTicketDetails: "/api/v1/user/support/ticket-details",
	SupportSendMessage: "/api/v1/user/support/send-message",
	SupportCloseTicket: "/api/v1/user/support/close-ticket",
	SupportRateTicket: "/api/v1/user/support/rate-ticket",

	// Chat
	ChatAll: "/api/v1/user/chat/all",
	ChatCreate: "/api/v1/user/chat/create",
	ChatDetails: "/api/v1/user/chat/details",
	ChatSendMessage: "/api/v1/user/chat/send-message",
	ChatMarkRead: "/api/v1/user/chat/mark-read",

	// Rating
	ProductRating: "/api/v1/product/rating",
	StoreRating: "/api/v1/store/rating",

	// Stripe
	StripeWebhook: "/api/v1/stripe/webhook",
} as const

export type ApiEndpoint = typeof ApiEndpoints[keyof typeof ApiEndpoints]

export const API_BASE_URL: string =
	import.meta.env.VITE_API_BASE ||
	(typeof window !== 'undefined'
		? (window.location.hostname.endsWith('videonest.me')
			? 'https://stores-platform.videonest.me'
			: '')
		: '')

