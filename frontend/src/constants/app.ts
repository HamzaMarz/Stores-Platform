export const AppRoutes = {
	Home: "/",
	Login: "/login",
	Register: "/register",
	Dashboard: "/dashboard",
	Landing: "/landing",
	Profile: "/profile",
	Upgrade: "/upgrade",
	NotFound: "*",
} as const

export const ErrorMessages = {
	Required: "This field is required",
	InvalidEmail: "Invalid email format",
	SomethingWentWrong: "Something went wrong. Please try again.",
} as const

export const UiText = {
	AppName: "Stores Platform",
} as const

