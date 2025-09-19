import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductGalleryProps {
    images: string[]
    productName: string
    discount?: number
    inStock?: boolean
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ 
    images, 
    productName, 
    discount = 0, 
    inStock = true 
}) => {
    const [selectedImage, setSelectedImage] = useState(0)

    if (!images || images.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4 rounded-xl shadow-lg backdrop-blur-md bg-white/70"
            >
                <div className="w-full h-[400px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 font-medium">No images available</p>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-4 rounded-xl shadow-lg backdrop-blur-md bg-white/70"
        >
            {/* Main Image Container */}
            <div className="relative mb-4 overflow-hidden rounded-lg">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={selectedImage}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        src={images[selectedImage]}
                        alt={`${productName} - Image ${selectedImage + 1}`}
                        className="w-full h-[400px] object-cover cursor-zoom-in transition-transform duration-500 hover:scale-105"
                    />
                </AnimatePresence>

                {/* Discount Badge */}
                {discount > 0 && (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                            delay: 0.5, 
                            type: "spring", 
                            stiffness: 200 
                        }}
                        className="absolute top-4 left-4 z-10"
                    >
                        <div className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg">
                            <span>🎉</span> -{discount}%
                        </div>
                    </motion.div>
                )}

                {/* Stock Status Badge */}
                {!inStock && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="absolute top-4 right-4 z-10"
                    >
                        <div className="px-3 py-2 text-sm font-semibold text-white bg-red-500 rounded-full shadow-lg">
                            ❌ Out of Stock
                        </div>
                    </motion.div>
                )}

                {/* Image Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.button>
                    </>
                )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide"
                >
                    {images.map((image, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedImage(index)}
                            className="flex-shrink-0 transition-all duration-200"
                        >
                            <motion.img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                                    selectedImage === index
                                        ? 'border-blue-600 scale-110 shadow-lg ring-2 ring-blue-200'
                                        : 'border-transparent hover:border-gray-300 hover:shadow-md'
                                }`}
                                whileHover={{ scale: 1.05 }}
                            />
                        </motion.button>
                    ))}
                </motion.div>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-2"
                >
                    <span className="text-sm text-gray-500">
                        {selectedImage + 1} of {images.length}
                    </span>
                </motion.div>
            )}
        </motion.div>
    )
}

export default ProductGallery
