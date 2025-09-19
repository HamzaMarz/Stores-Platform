export interface StoreOwner {
    id: number
    first_name: string
    last_name: string
    email: string
    type: string
}

export interface StoreDetails {
    id: number
    store_name: string
    logo?: string
    address1: string
    address2?: string
    city: string
    country: string
    rating: number | null
    rating_count: number | null
    created_at: string
    updated_at: string
    owner: StoreOwner
}

export interface StoreProduct {
    id: number
    name: string
    description: string
    thumbnail_image: string
    images: string[]
    category: string
    price: number
    discount: number
    sell_count: number
    rating: number
    rating_count: number
    in_stock: boolean
    owner_id: number
    product_owner: {
        store_name?: string
        merchant_alias?: string
    }
}

export interface StoreProductsParams {
    store_id: number
    category: string
    in_stock?: boolean
    discount?: { min: number; max: number }
    price?: { min: number; max: number }
    offset: number
    limit: number
    order: {
        column: 'rating' | 'sell_count' | 'id' | 'price' | 'name'
        direction: 'asc' | 'desc'
    }
    term?: string
}

export interface StoreProductsResponse {
    statusCode: number
    data: StoreProduct[]
    count: number
    message: string
}
