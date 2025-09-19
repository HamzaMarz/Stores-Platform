import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import {
    MdShoppingCart, MdSecurity, MdVerified, MdLocalShipping,
    MdTrendingUp, MdStorefront, MdPeople, MdCheckCircle,
    MdStar, MdArrowForward
} from 'react-icons/md';
import { AppRoutes } from '../../../constants/app';
import { useAllProducts } from '../../../features/catalog/hooks/useProducts';
import { usePlatformStats } from '../../../features/catalog/hooks/usePlatformStats';
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';
import { useFocusAnimation } from '../../../hooks/useFocusAnimation';

// Helper component for the pulsing skeleton loader
const SkeletonLoader = ({ className }: { className?: string }) => (
    <div className={`bg-gray-200 rounded-md animate-pulse dark:bg-gray-700 ${className}`} />
);

// Enhanced StatsCard component with better colors and animations
const StatsCard = ({ icon, value, label, index }: { icon: React.ReactElement; value: string; label: string; index: number }) => {
    const [colorIndex, setColorIndex] = useState(index);

    // ألوان جذابة ومتدرجة
    const gradientColors = [
        'from-purple-500 to-pink-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-emerald-500',
        'from-orange-500 to-red-500',
        'from-indigo-500 to-purple-500',
        'from-teal-500 to-blue-500'
    ];

    const hoverColors = [
        'hover:from-purple-600 hover:to-pink-600',
        'hover:from-blue-600 hover:to-cyan-600',
        'hover:from-green-600 hover:to-emerald-600',
        'hover:from-orange-600 hover:to-red-600',
        'hover:from-indigo-600 hover:to-purple-600',
        'hover:from-teal-600 hover:to-blue-600'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setColorIndex((prev) => (prev + 1) % gradientColors.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [gradientColors.length]);

    const currentGradient = gradientColors[colorIndex];
    const currentHover = hoverColors[colorIndex];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div
                className={`flex gap-3 items-center p-4 bg-gradient-to-r rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-500 ease-in-out cursor-pointer ${currentGradient} ${currentHover} hover:-translate-y-2 hover:shadow-2xl border-white/20`}
            >
                <div className="text-2xl text-white transition-transform duration-300 hover:scale-110">
                    {icon}
                </div>
                <div>
                    <p className="text-xl font-bold text-white transition-all duration-300">
                        {value}
                    </p>
                    <p className="text-sm font-medium text-white/90">
                        {label}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const VisitorWelcomePage: React.FC = () => {
    const navigate = useNavigate();
    const textControls = useAnimation();
    const imageControls = useAnimation();
    const { scrollToElement } = useSmoothScroll();
    const { focusOnElement, isElementFocused } = useFocusAnimation();

    // Real data from API
    const { products: featuredProducts, isLoading: productsLoading } = useAllProducts({
        category: 'all',
        discount: false,
        offset: 0,
        limit: 8,
        order: { column: 'sell_count', direction: 'desc' },
    });

    // Real platform stats from API
    const { data: platformStats, isLoading: statsLoading } = usePlatformStats();

    React.useEffect(() => {
        const sequence = async () => {
            await Promise.all([
                textControls.start({ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 50, delay: 0.2 } }),
                imageControls.start({ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 50, delay: 0.2 } }),
            ]);
        };
        sequence();
    }, [textControls, imageControls]);

    // Handle scroll to CTA section with focus animation
    const handleScrollToCTA = () => {
        scrollToElement('cta-section', 1200);
        setTimeout(() => {
            focusOnElement('cta-section', 1000);
        }, 1200);
    };

    // Handle product click
    const handleProductClick = () => {
        handleScrollToCTA();
    };

    const stats = [
        { number: `${platformStats?.totalProducts || 0}+`, label: 'Products', icon: <MdTrendingUp /> },
        { number: `${platformStats?.totalStores || 0}+`, label: 'Stores', icon: <MdStorefront /> },
        { number: `${platformStats?.totalCustomers || 0}+`, label: 'Happy Customers', icon: <MdPeople /> },
        { number: platformStats?.support || '24/7', label: 'Support', icon: <MdSecurity /> }
    ];

    const features = [
        { icon: <MdShoppingCart size={40} />, title: 'Fast Shopping', description: 'Streamlined checkout for a quick experience.', color: 'text-blue-500' },
        { icon: <MdSecurity size={40} />, title: 'Secure Payments', description: 'Your transactions are protected with top-tier security.', color: 'text-green-500' },
        { icon: <MdVerified size={40} />, title: 'Guaranteed Quality', description: 'We ensure that every product meets our high standards.', color: 'text-yellow-500' },
        { icon: <MdLocalShipping size={40} />, title: 'Reliable Shipping', description: 'Get your orders delivered on time, every time.', color: 'text-sky-500' }
    ];

    const heroFeaturesList = ["Exclusive Deals", "Wide Variety", "Trusted Sellers"];

    // Keyframes for the aurora effect
    const auroraKeyframes = `
        @keyframes aurora {
            0% { transform: scale(1) rotate(0deg); opacity: 0.5; }
            100% { transform: scale(1.5) rotate(90deg); opacity: 1; }
        }
    `;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-slate-200">
            {/* Injecting keyframes into the document head */}
            <style>{auroraKeyframes}</style>

            {/* Hero Section */}
            <section className="relative overflow-hidden min-h-screen flex items-center justify-center py-20 md:py-32 bg-gradient-to-br from-slate-100 to-blue-200 dark:from-[#10101a] dark:to-[#0a0a10]">
                <div
                    className="absolute top-0 right-0 bottom-0 left-0 via-transparent to-transparent bg-gradient-radial from-orange-500/15"
                    style={{ backgroundPosition: '30% 70%', animation: 'aurora 20s infinite alternate' }}
                />
                <div className="container relative z-10 px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-16 justify-center items-center md:flex-row md:gap-8">

                        <div className="flex-1 w-full text-center md:w-1/2 md:text-left">
                            <motion.div
                                initial={{ x: '-25%', opacity: 0 }}
                                animate={textControls}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <span className="inline-block px-4 py-1 mb-4 text-sm font-bold text-white rounded-full bg-orange-600/90">
                                        Featured Collection
                                    </span>
                                </motion.div>

                                <motion.div initial={{ x: '-100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.7 }}>
                                    <h1 className="mb-4 text-4xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 sm:text-5xl md:text-6xl">
                                        Your Ultimate Shopping Destination
                                    </h1>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.7 }}>
                                    <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90 md:text-xl text-slate-700 dark:text-slate-300 md:mx-0">
                                        Discover an endless selection of products from trusted stores. Quality, speed, and security guaranteed in every purchase.
                                    </p>
                                </motion.div>

                                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 1.2 } } }} className="mb-6">
                                    {heroFeaturesList.map((feature, index) => (
                                        <motion.div key={index} variants={{ hidden: { y: -20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                                            <div className="flex gap-3 justify-center items-center mb-2 md:justify-start">
                                                <MdCheckCircle className="text-orange-500" />
                                                <span className="text-lg text-slate-600 dark:text-slate-400">{feature}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.5 }}
                                    className="flex flex-wrap gap-4 justify-center my-6 md:justify-start"
                                >
                                    {statsLoading ? (
                                        Array.from({ length: 4 }).map((_, index) => (
                                            <SkeletonLoader key={index} className="w-32 h-16" />
                                        ))
                                    ) : (
                                        stats.map((stat, index) => (
                                            <StatsCard key={index} {...stat} index={index} value={stat.number} />
                                        ))
                                    )}
                                </motion.div>

                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.5 }}>
                                    <div className="flex flex-col gap-4 justify-center sm:flex-row md:justify-start">
                                        <motion.button
                                            onClick={handleScrollToCTA}
                                            className="group inline-flex items-center justify-center px-8 py-3 rounded-full font-bold text-white bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg shadow-orange-500/30 transition-all duration-300 ease-in-out hover:from-orange-600 hover:to-orange-500 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Start Shopping
                                            <MdArrowForward className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        <div className="flex flex-1 justify-center w-full md:w-1/2">
                            <motion.div
                                initial={{ x: '25%', opacity: 0 }}
                                animate={imageControls}
                            >
                                <motion.div
                                    initial={{ y: 50, opacity: 0, rotate: -15 }}
                                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.8, duration: 1 }}
                                    whileHover={{ y: -10, scale: 1.05, transition: { type: 'spring', stiffness: 200 } }}
                                >
                                    <img
                                        src="/logo/gaza.png"
                                        alt="E-commerce Platform Showcase"
                                        className="w-72 h-auto filter drop-shadow-2xl sm:w-80 md:w-96"
                                        loading="lazy"
                                    />
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white sm:py-20 lg:py-24 dark:bg-gray-900">
                <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">
                            Why Shop With Us?
                        </h2>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="h-full"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="p-6 h-full text-center rounded-lg shadow-sm transition-all duration-300 bg-slate-50 dark:bg-gray-800 hover:shadow-xl">
                                        <div className={`inline-block mb-4 ${feature.color}`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 dark:bg-gray-950">
                <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">
                            Featured Products
                        </h2>

                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {productsLoading ? (
                                Array.from({ length: 8 }).map((_, index) => (
                                    <div key={index} className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                                        <SkeletonLoader className="w-full h-64" />
                                        <div className="p-4 space-y-3">
                                            <SkeletonLoader className="h-5" />
                                            <SkeletonLoader className="w-3/4 h-4" />
                                            <SkeletonLoader className="w-1/2 h-4" />
                                        </div>
                                    </div>
                                ))
                            ) : featuredProducts && featuredProducts.length > 0 ? (
                                featuredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="h-full"
                                        whileHover={{ y: -5 }}
                                    >
                                        <div
                                            className="flex overflow-hidden flex-col h-full bg-white rounded-lg shadow-md transition-all duration-300 cursor-pointer group dark:bg-gray-800 hover:shadow-2xl"
                                            onClick={handleProductClick}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={product.thumbnail_image}
                                                    alt={product.name}
                                                    className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                {product.discount > 0 && (
                                                    <div className="absolute top-3 right-3 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-md">
                                                        -{product.discount}%
                                                    </div>
                                                )}
                                                {product.rating > 0 && (
                                                    <div className="flex absolute bottom-3 left-3 gap-1 items-center px-2 py-1 text-sm text-white rounded-md bg-black/70">
                                                        <MdStar className="text-yellow-400" />
                                                        <span className="font-bold">{product.rating.toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col flex-grow p-4">
                                                <h3 className="overflow-hidden mb-1 h-12 text-base font-bold line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                <p className="overflow-hidden mb-3 h-10 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                    {product.description}
                                                </p>
                                                <div className="flex gap-2 items-center mt-auto">
                                                    <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                                                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                                    </p>
                                                    {product.discount > 0 && (
                                                        <p className="text-sm line-through text-slate-500">${product.price.toFixed(2)}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-8 text-center">
                                    <p className="text-xl text-slate-500">No featured products available right now.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section
                id="cta-section"
                className={`py-16 text-center text-white bg-orange-500 transition-all duration-1000 sm:py-20`}
            >
                <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="mb-3 text-3xl font-bold md:text-4xl">Ready to Join Us?</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
                            Create your account today and unlock a world of exclusive benefits, or log in to continue your seamless shopping journey.
                        </p>
                        <div className="flex flex-col gap-4 justify-center sm:flex-row">
                            <motion.button
                                onClick={() => navigate(AppRoutes.Register)}
                                className={`px-8 py-3 font-semibold text-orange-500 bg-white rounded-md transition-all duration-300 hover:bg-gray-100 hover:scale-105 ${isElementFocused('cta-section') ? 'ring-8 ring-orange-300 ring-opacity-50 scale-105' : ''}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Register for Free
                            </motion.button>
                            <motion.button
                                onClick={() => navigate(AppRoutes.Login)}
                                className={`px-8 py-3 font-semibold text-white rounded-md border-2 border-white transition-all duration-300 hover:bg-white/10 hover:scale-105 ${isElementFocused('cta-section') ? 'ring-8 ring-orange-300 ring-opacity-50 scale-105' : ''}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Login to Your Account
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default VisitorWelcomePage;
