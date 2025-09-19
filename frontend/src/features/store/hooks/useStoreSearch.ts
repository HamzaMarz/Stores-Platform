import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'

export interface StoreBrief {
    id: number
    store_name: string
    logo: string | null
    rating: number
    rating_count: number
    product_count: number
}

export type StoreSortColumn = 'rating' | 'id' | 'store_name' | 'product_count'
export type StoreSortDirection = 'asc' | 'desc'

export interface StoreOrder { column: StoreSortColumn; direction: StoreSortDirection }

export interface StoreSearchParams {
    term: string
    offset: number
    limit: number
    order: StoreOrder
}

interface BackendListResponse<T> {
    statusCode: number
    data: T
    count: number
    message: string
}

function useDebounced<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delayMs)
        return () => clearTimeout(id)
    }, [value, delayMs])
    return debounced
}

export function useStoreSearch(initial: StoreSearchParams, debounceMs = 250) {
    const [params, setParamsState] = useState<StoreSearchParams>(initial)
    const debounced = useDebounced(params, debounceMs)

    const [stores, setStores] = useState<StoreBrief[]>([])
    const [count, setCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const hasMore = stores.length < count

    const controllerRef = useRef<AbortController | null>(null)

    const setParams = useCallback((updater: (prev: StoreSearchParams) => StoreSearchParams) => {
        setParamsState(prev => {
            const next = updater(prev)
            return { ...next, offset: 0 }
        })
    }, [])

    const fetchPage = useCallback(async (p: StoreSearchParams, append: boolean) => {
        if (!p.term || p.term.trim().length < 2) {
            setStores([])
            setCount(0)
            return
        }
        if (controllerRef.current) controllerRef.current.abort()
        const controller = new AbortController()
        controllerRef.current = controller
        try {
            append ? setIsLoadingMore(true) : setIsLoading(true)
            setError(null)
            const { data } = await axiosClient.post<BackendListResponse<StoreBrief[]>>(ApiEndpoints.StoreSearch, p, { signal: controller.signal })
            setCount(data.count)
            setStores(prev => append ? [...prev, ...data.data] : data.data)
        } catch (e: unknown) {
            if (e instanceof Error && e.name === 'AbortError') return
            setError(e instanceof Error ? e.message : 'Failed to search stores')
        } finally {
            setIsLoading(false)
            setIsLoadingMore(false)
        }
    }, [])

    useEffect(() => {
        fetchPage(debounced, debounced.offset > 0)
    }, [debounced, fetchPage])

    const loadMore = useCallback(() => {
        if (isLoading || isLoadingMore || !hasMore) return
        setParamsState(prev => ({ ...prev, offset: prev.offset + prev.limit }))
    }, [isLoading, isLoadingMore, hasMore])

    const reset = useCallback(() => {
        setStores([])
        setCount(0)
        setParamsState(initial)
    }, [initial])

    return { stores, count, isLoading, isLoadingMore, hasMore, error, params, setParams, loadMore, reset }
}


