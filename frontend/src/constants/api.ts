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
} as const

export type ApiEndpoint = typeof ApiEndpoints[keyof typeof ApiEndpoints]

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE

