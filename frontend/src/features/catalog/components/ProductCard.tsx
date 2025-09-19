import React, { memo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Product } from '../hooks/useProducts';
import { AppRoutes } from '../../../constants/app';

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const finalPrice = product.price * (1 - (product.discount || 0) / 100);

    const handleImageError = () => setImageError(true);
    const handleCardClick = () =>
        navigate(AppRoutes.ProductDetails.replace(':id', product.id.toString()));

    return (
        <div
            className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl shadow-md
                       cursor-pointer overflow-hidden transition-all duration-300
                       hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200/40"
            onClick={handleCardClick}
        >
            {/* Image */}
            <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden rounded-t-xl">
                {!imageError && product.thumbnail_image ? (
                    <img
                        src={product.thumbnail_image}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="flex justify-center items-center w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Discount Badge */}
                {product.discount > 0 && (
                    <span className="flex absolute top-2 left-2 gap-1 items-center px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-md">
                        <span>✅</span> -{product.discount}%
                    </span>
                )}

                {/* Out of Stock Badge */}
                {!product.in_stock && (
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white bg-gray-900 rounded-full shadow-md">
                        ❌ Out of stock
                    </span>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-1 p-3">
                {/* Name */}
                <h3 className="text-sm font-semibold text-gray-900 lg:text-base line-clamp-2">
                    {product.name}
                </h3>

                {/* Price */}
                <div className="flex gap-2 items-end mt-1">
                    {product.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                            ${product.price.toFixed(2)}
                        </span>
                    )}
                    <span className="text-lg font-bold text-gray-900 transition-colors duration-300 hover:text-blue-600">
                        ${finalPrice.toFixed(2)}
                    </span>
                </div>

                {/* Rating */}
                <div className="flex gap-1 items-center mt-1 text-xs text-gray-500">
                    <span>⭐ {product.rating?.toFixed(1) ?? 0}</span>
                    <span>({product.rating_count ?? 0})</span>
                </div>

                {/* {product.product_owner?.store_id && (
                    <Link
                        to={AppRoutes.Store.replace(':id', String(product.product_owner.store_id))}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        View Store →
                    </Link>
                )} */}
            </div>
        </div>
    );
};

export default memo(ProductCard);
