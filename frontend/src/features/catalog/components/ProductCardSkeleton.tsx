import React from 'react'

const ProductCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
            <div className="animate-pulse">
                <div className="bg-gray-200 h-44 w-full" />
                <div className="p-4 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    <div className="h-6 w-1/3 bg-gray-200 rounded mt-3" />
                </div>
            </div>
        </div>
    )
}

export default ProductCardSkeleton


