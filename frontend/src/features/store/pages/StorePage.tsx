import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useGetStoreDetails, useGetStoreProducts } from '../hooks/useStore'
import StoreHeader from '../components/StoreHeader'
import StoreFilters from '../components/StoreFilters'
import StoreProductsGrid from '../components/StoreProductsGrid'
import type { StoreProductsParams } from '../types'

const StorePage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const storeId = parseInt(id || '0')

    // State for filters and sorting
    const [filters, setFilters] = useState({
        category: 'all',
        in_stock: undefined,
        price: undefined,
        discount: undefined,
        term: undefined
    })

    const [sortBy, setSortBy] = useState('id')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
    const [currentPage, setCurrentPage] = useState(0)
    const [allProducts, setAllProducts] = useState<any[]>([])
    const [hasMore, setHasMore] = useState(true)

    // Fetch store details
    const { 
        data: store, 
        isLoading: storeLoading, 
        error: storeError 
    } = useGetStoreDetails(storeId)

    // Prepare products params
    const productsParams: StoreProductsParams = {
        store_id: storeId,
        category: filters.category,
        in_stock: filters.in_stock,
        price: filters.price,
        discount: filters.discount,
        offset: currentPage * 20,
        limit: 20,
        order: {
            column: sortBy as any,
            direction: sortDirection
        },
        term: filters.term
    }

    // Fetch store products
    const { 
        data: productsData, 
        isLoading: productsLoading, 
        error: productsError 
    } = useGetStoreProducts(productsParams)

    // Handle products data and pagination
    useEffect(() => {
        if (productsData) {
            if (currentPage === 0) {
                // Reset products for new search/filter
                setAllProducts(productsData.data || [])
            } else {
                // Append new products for pagination
                setAllProducts(prev => [...prev, ...(productsData.data || [])])
            }
            
            // Check if there are more products
            const totalLoaded = currentPage === 0 ? (productsData.data?.length || 0) : allProducts.length + (productsData.data?.length || 0)
            setHasMore(totalLoaded < (productsData.count || 0))
        }
    }, [productsData, currentPage])

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(0)
        setAllProducts([])
        setHasMore(true)
    }, [filters, sortBy, sortDirection])

    // Handle errors
    useEffect(() => {
        if (storeError || productsError) {
            console.error('Store page error:', { storeError, productsError })
        }
    }, [storeError, productsError])

    // Handle sort change
    const handleSortChange = (column: string, direction: 'asc' | 'desc') => {
        setSortBy(column)
        setSortDirection(direction)
    }

    // Handle filters change
    const handleFiltersChange = (newFilters: typeof filters) => {
        setFilters(newFilters)
    }

    // Handle load more
    const handleLoadMore = () => {
        setCurrentPage(prev => prev + 1)
    }

    // Loading state
    if (storeLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container px-4 py-8 mx-auto">
                    <div className="space-y-6 animate-pulse">
                        <div className="h-32 bg-gray-200 rounded-2xl dark:bg-gray-700" />
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                            <div className="lg:col-span-1">
                                <div className="h-64 bg-gray-200 rounded-xl dark:bg-gray-700" />
                            </div>
                            <div className="lg:col-span-3">
                                <div className="h-96 bg-gray-200 rounded-xl dark:bg-gray-700" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (storeError || !store) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="mx-auto mb-4 w-24 h-24 text-gray-300 dark:text-gray-600">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                        Store Not Found
                    </h1>
                    <p className="mb-6 text-gray-500 dark:text-gray-400">
                        The store you're looking for doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        )
    }

    const products = allProducts
    const totalProducts = productsData?.count || 0

    return (
        <>
            {/* SEO Meta Tags - Temporarily disabled */}
            {/* <Helmet>
                <title>{store.store_name} - Products & Reviews | Stores Platform</title>
                <meta name="description" content={`Browse products from ${store.store_name}. ${store.address1 ? `Located in ${store.city}, ${store.country}.` : ''} ${store.rating ? `Rated ${store.rating.toFixed(1)}/5 stars.` : ''}`} />
                <meta name="keywords" content={`${store.store_name}, online store, products, ${store.city}, ${store.country}`} />
                
                <meta property="og:title" content={`${store.store_name} - Stores Platform`} />
                <meta property="og:description" content={`Browse products from ${store.store_name}`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                {store.logo && <meta property="og:image" content={store.logo} />}
                
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${store.store_name} - Stores Platform`} />
                <meta name="twitter:description" content={`Browse products from ${store.store_name}`} />
                {store.logo && <meta name="twitter:image" content={store.logo} />}
                
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Store",
                        "name": store.store_name,
                        "description": `Online store by ${store.owner.first_name} ${store.owner.last_name}`,
                        "url": window.location.href,
                        "logo": store.logo,
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": store.address1,
                            "addressLocality": store.city,
                            "addressCountry": store.country
                        },
                        "aggregateRating": store.rating ? {
                            "@type": "AggregateRating",
                            "ratingValue": store.rating,
                            "reviewCount": store.rating_count
                        } : undefined
                    })}
                </script>
            </Helmet> */}

            {/* Main Content */}
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container px-4 py-8 mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        {/* Store Header */}
                        <StoreHeader store={store} />

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                            {/* Filters Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-8">
                                    <StoreFilters
                                        filters={filters}
                                        onFiltersChange={handleFiltersChange}
                                        totalProducts={totalProducts}
                                    />
                                </div>
                            </div>

                            {/* Products Section */}
                            <div className="lg:col-span-3">
                                <StoreProductsGrid
                                    products={products}
                                    isLoading={productsLoading}
                                    sortBy={sortBy}
                                    sortDirection={sortDirection}
                                    onSortChange={handleSortChange}
                                    hasMore={hasMore}
                                    onLoadMore={handleLoadMore}
                                    totalProducts={totalProducts}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default StorePage
