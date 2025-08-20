export type SellerProduct = {
	id: number
	name: string
	description: string
	category: string
	price: number
	discount: number
	rating: number
	rating_count: number
	sell_count: number
	thumbnail_image: string
	images: string[] | string
	in_stock: boolean
	owner_id: number
	store_name?: string
	merchant_alias?: string
}

export type SellerOrder = {
	id: number
	user_id: number
	products: Array<{
		id: number
		name: string
		price: number
		discount?: number
		quantity: number
		thumbnail_image?: string
		total?: number
	}>
	status: string
	total: number
	paid: boolean
	delivery: boolean
	created_at?: string
}


