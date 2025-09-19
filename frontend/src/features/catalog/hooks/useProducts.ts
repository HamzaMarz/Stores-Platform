    import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
    import { axiosClient } from '../../../lib/axios'
    import { ApiEndpoints } from '../../../constants/api'

    export type SortColumn = 'rating' | 'sell_count' | 'id' | 'price' | 'name'
    export type SortDirection = 'asc' | 'desc'

    export interface ProductOrder {
        column: SortColumn
        direction: SortDirection
    }

    export interface Product {
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
        owner_id?: number
        product_owner?: { store_id?: number; store_name?: string; merchant_alias?: string }
    }

    export interface ProductsAllParams {
        category: string
        discount?: boolean
        offset: number
        limit: number
        order: ProductOrder
    }

    export interface ProductsSearchParams {
        category: string
        in_stock?: boolean
        discount?: { min: number; max: number }
        price?: { min: number; max: number }
        offset: number
        limit: number
        order: ProductOrder
        term: string
    }

    interface BackendListResponse<T> {
        statusCode: number
        data: T
        count: number
        message: string
    }

    export interface UseProductsState {
        products: Product[]
        count: number
        isLoading: boolean
        isLoadingMore: boolean
        error: string | null
        hasMore: boolean
    }

    export interface UseProductsControls<P> {
        params: P
        setParams: (updater: (prev: P) => P) => void
        loadMore: () => Promise<void>
        reset: () => void
    }

    export type UseAllProductsResult = UseProductsState & UseProductsControls<ProductsAllParams>
    export type UseSearchProductsResult = UseProductsState & UseProductsControls<ProductsSearchParams>

    function useDebounced<T>(value: T, delayMs: number): T {
        const [debounced, setDebounced] = useState(value)
        useEffect(() => {
            const id = setTimeout(() => setDebounced(value), delayMs)
            return () => clearTimeout(id)
        }, [value, delayMs])
        return debounced
    }

    function normalizeRanges(params: ProductsSearchParams): ProductsSearchParams {
        const next = { ...params }
        
        // Normalize discount range
        if (next.discount) {
            if (next.discount.min > next.discount.max) {
                next.discount = { min: next.discount.max, max: next.discount.min }
            }
            // Ensure values are within valid range
            next.discount.min = Math.max(0, Math.min(100, next.discount.min))
            next.discount.max = Math.max(0, Math.min(100, next.discount.max))
        }
        
        // Normalize price range
        if (next.price) {
            if (next.price.min > next.price.max) {
                next.price = { min: next.price.max, max: next.price.min }
            }
            // Ensure values are within valid range
            next.price.min = Math.max(0, next.price.min)
            next.price.max = Math.max(0, next.price.max)
        }
        
        return next
    }

    export function useAllProducts(initial: ProductsAllParams): UseAllProductsResult {
        const [params, setParamsState] = useState<ProductsAllParams>(initial)
        const [products, setProducts] = useState<Product[]>([])
        const [count, setCount] = useState<number>(0)
        const [isLoading, setIsLoading] = useState<boolean>(false)
        const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
        const [error, setError] = useState<string | null>(null)

        const controllerRef = useRef<AbortController | null>(null)

        const hasMore = products.length < count

        const setParams = useCallback((updater: (prev: ProductsAllParams) => ProductsAllParams) => {
            setParamsState(prev => {
                const next = updater(prev)
                const newParams = { ...next, offset: 0 }
                
                if (newParams.limit < 1 || newParams.limit > 30) {
                    console.warn('Invalid limit:', newParams.limit)
                    newParams.limit = 24
                }
                
                return newParams
            })
        }, [])

        const fetchPage = useCallback(async (p: ProductsAllParams, append: boolean) => {
            if (controllerRef.current) {
                controllerRef.current.abort()
            }
            const controller = new AbortController()
            controllerRef.current = controller
            try {
                if (append) {
                    setIsLoadingMore(true)
                } else {
                    setIsLoading(true)
                }
                setError(null)
                
                const { data } = await axiosClient.post<BackendListResponse<Product[]>>(ApiEndpoints.Products, p, { signal: controller.signal })
                
                // Validate response data
                if (!Array.isArray(data.data)) {
                    throw new Error('Invalid response format: data is not an array')
                }
                
                setCount(data.count)
                setProducts(prev => append ? [...prev, ...data.data] : data.data)
            } catch (e: unknown) {
                if (e instanceof Error && e.name === 'AbortError') return
                console.error('Error fetching products:', e)
                setError(e instanceof Error ? e.message : 'Failed to load products')
            } finally {
                setIsLoading(false)
                setIsLoadingMore(false)
            }
        }, [])

        useEffect(() => {
            if (params.offset === 0) {
                setProducts([])
            }
            fetchPage(params, params.offset > 0)
        }, [params, fetchPage])

        const loadMore = useCallback(async () => {
            if (isLoading || isLoadingMore) return
            if (!hasMore) return
            setParamsState(prev => ({ ...prev, offset: prev.offset + prev.limit }))
        }, [hasMore, isLoading, isLoadingMore])

        const reset = useCallback(() => {
            setProducts([])
            setCount(0)
            setParamsState(initial)
        }, [initial])

        return { products, count: products.length, isLoading, isLoadingMore, error, hasMore, params, setParams, loadMore, reset }
    }

    export function useSearchProducts(initial: ProductsSearchParams, debounceMs: number = 300): UseSearchProductsResult {
        const [rawParams, setParamsState] = useState<ProductsSearchParams>(initial)
        const normalized = useMemo(() => normalizeRanges(rawParams), [rawParams])
        const debouncedParams = useDebounced(normalized, debounceMs)

        const [products, setProducts] = useState<Product[]>([])
        const [isLoading, setIsLoading] = useState<boolean>(false)
        const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
        const [error, setError] = useState<string | null>(null)
        const [hasMore, setHasMore] = useState<boolean>(true)

        const controllerRef = useRef<AbortController | null>(null)
        const lastRequestRef = useRef<string>('')

        const setParams = useCallback((updater: (prev: ProductsSearchParams) => ProductsSearchParams) => {
            setParamsState(prev => {
                const next = updater(prev)
                const newParams = { ...next, offset: 0 }
                
                if (newParams.limit < 1 || newParams.limit > 30) {
                    console.warn('Invalid limit:', newParams.limit)
                    newParams.limit = 24
                }
                
                return newParams
            })
        }, [])

        const fetchPage = useCallback(async (p: ProductsSearchParams, append: boolean) => {
            const requestKey = JSON.stringify({ ...p, append })
            if (lastRequestRef.current === requestKey) {
                return
            }
            lastRequestRef.current = requestKey
            
            if (controllerRef.current) {
                controllerRef.current.abort()
            }
            const controller = new AbortController()
            controllerRef.current = controller
            
            try {
                if (append) {
                    setIsLoadingMore(true)
                } else {
                    setIsLoading(true)
                }
                setError(null)
                
                const { data } = await axiosClient.post<BackendListResponse<Product[]>>(ApiEndpoints.ProductSearch, p, { signal: controller.signal })
                
                // Validate response data
                if (!Array.isArray(data.data)) {
                    throw new Error('Invalid response format: data is not an array')
                }
                
                setProducts(prev => append ? [...prev, ...data.data] : data.data)
                
                const hasMoreProducts = data.data.length === p.limit
                setHasMore(hasMoreProducts)
                
            } catch (e: unknown) {
                if (e instanceof Error && e.name === 'AbortError') return
                console.error('Error fetching search products:', e)
                setError(e instanceof Error ? e.message : 'Failed to load products')
            } finally {
                setIsLoading(false)
                setIsLoadingMore(false)
            }
        }, [])

        useEffect(() => {
            if (!debouncedParams.term || debouncedParams.term.trim().length < 3) {
                setProducts([])
                setIsLoading(false)
                setIsLoadingMore(false)
                return
            }
            if (debouncedParams.offset === 0) {
                setProducts([])
            }
            fetchPage(debouncedParams, debouncedParams.offset > 0)
        }, [debouncedParams, fetchPage])

        const loadMore = useCallback(async () => {
            if (isLoading || isLoadingMore) return
            if (!hasMore) return
            if (!rawParams.term || rawParams.term.trim().length < 3) return
            setParamsState(prev => ({ ...prev, offset: prev.offset + prev.limit }))
        }, [hasMore, isLoading, isLoadingMore, rawParams.term])

        const reset = useCallback(() => {
            setProducts([])
            setHasMore(true)
            lastRequestRef.current = ''
            setParamsState(initial)
        }, [initial])

        return { products, count: products.length, isLoading, isLoadingMore, error, hasMore, params: rawParams, setParams, loadMore, reset }
    }

    export function useProductDetails(id: number) {
        const [data, setData] = useState<{ data: Product } | null>(null)
        const [isLoading, setIsLoading] = useState<boolean>(false)
        const [error, setError] = useState<string | null>(null)

        useEffect(() => {
            let cancelled = false
            async function run() {
                if (!id) return
                setIsLoading(true)
                setError(null)
                try {
                    const res = await axiosClient.get(ApiEndpoints.ProductDetails, { params: { id } })
                    if (!cancelled) setData(res.data)
                } catch (e: unknown) {
                    if (!cancelled) {
                        if (e instanceof Error) {
                            if (e.message.includes('422')) {
                                setError('Product ID is invalid or out of range')
                            } else if (e.message.includes('404')) {
                                setError('Product not found')
                            } else {
                                setError('Failed to load product details')
                            }
                        } else {
                            setError('Failed to load product details')
                        }
                    }
                } finally {
                    if (!cancelled) setIsLoading(false)
                }
            }
            run()
            return () => {
                cancelled = true
            }
        }, [id])

        return { data, isLoading, error }
    }


