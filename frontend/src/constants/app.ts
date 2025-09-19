// هان صار تعديل
export const AppRoutes = {
	Home: "/",
	Login: "/login",
	Register: "/register",
	Dashboard: "/dashboard",
	Profile: "/profile",
	Chat: "/chat",
	Upgrade: "/upgrade",
	Settings: "/settings",
	// Welcome pages
	VisitorWelcome: "/welcome/visitor",
	CustomerWelcome: "/welcome/customer", 
	SellerWelcome: "/welcome/seller",
	// Product pages
	Products: "/products",
	FeaturedProducts: "/products/featured",
	ProductDetails: "/product/:id",
	AdvancedSearch: "/products/search",
	Store: "/store/:id",
	StoreSearch: "/stores/search",
	Cart: "/cart",
	Orders: "/orders",
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

