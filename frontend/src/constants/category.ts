export const CATEGORY = {
    ELECTRONICS: "ELECTRONICS",
    CLOTHING: "CLOTHING",
    BOOKS: "BOOKS",
    HOME_GARDEN: "HOME_GARDEN",
    SPORTS: "SPORTS",
    BEAUTY: "BEAUTY",
    TOYS: "TOYS",
    AUTOMOTIVE: "AUTOMOTIVE",
    FOOD: "FOOD",
    HEALTH: "HEALTH"
} as const

export type Category = typeof CATEGORY[keyof typeof CATEGORY]
