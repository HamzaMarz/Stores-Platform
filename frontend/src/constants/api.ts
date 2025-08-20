export const ApiEndpoints = {
	Login: "/api/v1/user/auth/login",
	Register: "/api/v1/user/auth/register",
	Profile: "/api/v1/user/profile/edit",
	// Swagger shows GET for logout
	Logout: "/api/v1/user/auth/logout",
	Me: "/api/v1/user/auth/me",
	UserGoogleLogin: "/api/v1/user/auth/google/login",
	ForgotPassword: "/api/v1/user/auth/forgot-password",
	CheckOtp: "/api/v1/user/auth/check-otp",
	UpdatePassword: "/api/v1/user/auth/update-password",
	Products: "/api/v1/products",
	// Profile verification and payment methods
	ProfileVerify: "/api/v1/user/profile/verify",
	ProfileInfo: "/api/v1/user/profile/info",
	ProfileChangePassword: "/api/v1/user/profile/change-password",
	PaymentMethodsEnsure: "/api/v1/user/profile/payment-methods/ensure",
	PaymentMethodsAdd: "/api/v1/user/profile/payment-methods/add",
	PaymentMethodsSave: "/api/v1/user/profile/payment-methods/save",
	PaymentMethodsList: "/api/v1/user/profile/payment-methods/list",
	PaymentMethodsDelete: "/api/v1/user/profile/payment-methods/delete",
	// Payments
	PaymentCreate: "/api/v1/user/payment/create",
	PaymentStatus: "/api/v1/user/payment/status",
	// Profile Upgrade
	ProfileUpgrade: "/api/v1/user/profile/upgrade",
	// Seller - Products
	SellerProductAdd: "/api/v1/user/seller/product/add",
	SellerProductEdit: "/api/v1/user/seller/product/edit",
	SellerProductAll: "/api/v1/user/seller/product/all",
	SellerProductAllUnlisted: "/api/v1/user/seller/product/all-unlisted",
	SellerProductSearch: "/api/v1/user/seller/product/search",
	SellerProductEnlist: "/api/v1/user/seller/product/enlist",
	SellerProductUnlist: "/api/v1/user/seller/product/unlist",
	// Seller - Orders
	SellerOrderAll: "/api/v1/user/seller/order/all",
	SellerOrderDetails: "/api/v1/user/seller/order/details",
	SellerOrderUpdate: "/api/v1/user/seller/order/update-order",
	// Support
	SupportCreateTicket: "/api/v1/user/support/create-ticket",
	SupportAllTickets: "/api/v1/user/support/all-tickets",
	SupportTicketDetails: "/api/v1/user/support/ticket-details",
	SupportSendMessage: "/api/v1/user/support/send-message",
	SupportCloseTicket: "/api/v1/user/support/close-ticket",
	SupportRateTicket: "/api/v1/user/support/rate-ticket",
} as const

export type ApiEndpoint = typeof ApiEndpoints[keyof typeof ApiEndpoints]

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE

