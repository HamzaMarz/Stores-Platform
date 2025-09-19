import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard.tsx';
import ProductCardSkeleton from './ProductCardSkeleton.tsx';
import type { Product } from '../hooks/useProducts.ts';

interface ProductGridProps {
    products: Product[];
    isLoading: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
    isLoadingMore?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
    products = [],
    isLoading,
    hasMore = false,
    onLoadMore,
    isLoadingMore = false
}) => {
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    if (isLoading && products.length === 0) {
        return (
            <div className="px-[20%] py-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (!isLoading && products.length === 0) {
        return (
            <div className="px-[20%] py-20 text-center">
                <p className="text-2xl font-semibold text-gray-500">😕 No products found.</p>
                <p className="mt-2 text-gray-400">
                    Try adjusting your filters or search term.
                </p>
            </div>
        );
    }

    return (
        <div className="px-[20%] py-6">
            <motion.div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-lg transition-shadow duration-300 cursor-pointer hover:shadow-2xl hover:scale-105"
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </motion.div>

            {hasMore && (
                <div className="flex justify-center mt-12">
                    <button
                        className="flex justify-center items-center px-8 py-3 font-bold text-white bg-blue-600 rounded-lg shadow-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                        disabled={isLoadingMore}
                        onClick={onLoadMore}
                    >
                        {isLoadingMore ? (
                            <>
                                <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </>
                        ) : (
                            'Load More Products'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;
