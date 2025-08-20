export const ProductCategories = [
	'ELECTRONICS',
	'CLOTHING',
	'BOOKS',
	'HOME_GARDEN',
	'SPORTS',
	'BEAUTY',
	'TOYS',
	'AUTOMOTIVE',
	'FOOD',
	'HEALTH',
] as const

export type ProductCategory = typeof ProductCategories[number]


