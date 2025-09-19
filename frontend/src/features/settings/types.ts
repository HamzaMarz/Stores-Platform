export type StoreSettings = {
    type: 'store'
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
}

export type MerchantSettings = {
    type: 'merchant'
    alias: string
    logo?: string
    rating: number | null
    rating_count: number | null
    created_at: string
    updated_at: string
}

export type Settings = StoreSettings | MerchantSettings

export type StoreSettingsForm = {
    store_name: string
    logo?: string
    address1: string
    address2?: string
    city: string
    country: string
}

export type MerchantSettingsForm = {
    alias: string
    logo?: string
}
