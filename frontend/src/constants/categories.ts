// المصدر الأساسي للفئات هو الباكند (Controllers/utils/enums -> CATEGORY)
// نطابقها محليًا لضمان التطابق مع قاعدة البيانات
export const Categories = [
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

export type Category = typeof Categories[number] | 'all'

export const CategoryLabels: Record<Category, string> = {
    all: 'All Categories',
    ELECTRONICS: 'Electronics',
    CLOTHING: 'Clothing',
    BOOKS: 'Books',
    HOME_GARDEN: 'Home & Garden',
    SPORTS: 'Sports',
    BEAUTY: 'Beauty',
    TOYS: 'Toys',
    AUTOMOTIVE: 'Automotive',
    FOOD: 'Food',
    HEALTH: 'Health',
}


