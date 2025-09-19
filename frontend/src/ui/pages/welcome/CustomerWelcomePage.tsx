import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../features/auth/state/useAuthStore';
import {
    MdAccountBalanceWallet, MdFavorite, MdStar,
    MdStorefront, MdShoppingCart, MdLocalOffer,
    MdSecurity, MdUpgrade
} from 'react-icons/md';
import { AppRoutes } from '../../../constants/app';
import { useAllProducts } from '../../../features/catalog/hooks/useProducts';

// Color mapping for dynamic styles
const colorMap = {
    primary: {
        text: 'text-blue-500 dark:text-blue-400',
        gradient: 'from-blue-500 to-blue-600',
    },
    success: {
        text: 'text-green-500 dark:text-green-400',
        gradient: 'from-green-500 to-green-600',
    },
    error: {
        text: 'text-red-500 dark:text-red-400',
        gradient: 'from-red-500 to-red-600',
    },
    warning: {
        text: 'text-yellow-500 dark:text-yellow-400',
        gradient: 'from-yellow-500 to-yellow-600',
    },
    info: {
        text: 'text-sky-500 dark:text-sky-400',
        gradient: 'from-sky-500 to-sky-600',
    },
};

type ColorKeys = keyof typeof colorMap;

// Enhanced StatsCard component with better colors and animations
const StatsCard = ({ icon, value, label, index = 0 }: { icon: React.ReactElement; value: string; label: string; index?: number }) => {
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
            whileHover={{ scale: 1.05, y: -5 }}
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

// Action Card component for Verify Profile and Upgrade
const ActionCard = ({ 
    icon, 
    title, 
    description, 
    buttonText, 
    buttonAction, 
    gradient = 'from-blue-500 to-purple-500',
    hoverGradient = 'hover:from-blue-600 hover:to-purple-600'
}: {
    icon: React.ReactElement;
    title: string;
    description: string;
    buttonText: string;
    buttonAction: () => void;
    gradient?: string;
    hoverGradient?: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={`p-6 h-full text-white bg-gradient-to-br rounded-xl shadow-lg transition-all duration-300 cursor-pointer ${gradient} ${hoverGradient}`}
        onClick={buttonAction}
    >
        <div className="flex flex-col h-full">
            <div className="flex items-center mb-4">
                <div className="p-2 mr-3 text-2xl rounded-lg bg-white/20">
                    {icon}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <p className="flex-grow mb-4 text-sm opacity-90">{description}</p>
            <button className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 bg-white/20 hover:bg-white/30 hover:scale-105">
                {buttonText}
            </button>
        </div>
    </motion.div>
);

const CustomerWelcomePage: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
    const isVerified = user?.verified;
    const type = user?.type;
    const isCustomer = type === 'customer' || !type;

    // Real data from API
    const { products: featuredProducts } = useAllProducts({
        category: 'all',
        discount: false,
        offset: 0,
        limit: 8,
        order: { column: 'sell_count', direction: 'desc' },
    });

    // Mock user for demonstration if not logged in
    const displayUser = user || {
        name: 'Guest',
        email: 'guest@example.com',
        type: 'customer' as const
    };

    // Calculate user stats from real data
    const walletBalance = '$250.75'; // This would come from a wallet API
    const favorites = '8'; // This would come from a favorites API
    const avgRating = '4.8'; // This would come from a ratings API

    const userStats = [
        { icon: <MdAccountBalanceWallet size={30} />, label: 'Wallet Balance', value: walletBalance },
        { icon: <MdFavorite size={30} />, label: 'Favorites', value: favorites },
        { icon: <MdStar size={30} />, label: 'Avg. Rating', value: avgRating }
    ];

    const quickLinks = [
        { title: 'Explore Products', description: 'Discover our latest arrivals.', icon: <MdStorefront size={24} />, path: '/', color: 'primary' },
        { title: 'Shopping Cart', description: 'You have 3 items waiting.', icon: <MdShoppingCart size={24} />, path: '/cart', color: 'success' },
        { title: 'Current Offers', description: 'Check out the latest deals.', icon: <MdLocalOffer size={24} />, path: '/offers', color: 'error' }
    ];
    
    const personalOffers = [
        { title: '20% Off Electronics', description: 'Valid until this weekend.', code: 'TECH20', color: 'primary' },
        { title: 'Free Shipping', description: 'On purchases over $50.', code: 'FREESHIP', color: 'success' }
    ];

    const auroraKeyframes = `
        @keyframes aurora {
            0% { transform: scale(1) rotate(0deg); opacity: 0.5; }
            100% { transform: scale(1.5) rotate(90deg); opacity: 1; }
        }
    `;

    return (
        <div className="py-6 min-h-screen text-gray-800 bg-gray-50 dark:bg-gray-950 dark:text-gray-200">
            <style>{auroraKeyframes}</style>
            <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                {/* Personalized Welcome Header */}
                <div className="relative overflow-hidden text-center rounded-2xl p-8 mb-8 bg-gradient-to-br from-slate-100 to-blue-200 dark:from-[#10101a] dark:to-[#0a0a10]">
                    <div
                        className="absolute inset-0 via-transparent to-transparent bg-gradient-radial from-orange-500/15"
                        style={{ backgroundPosition: '30% 70%', animation: 'aurora 20s infinite alternate' }}
                    />
                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex justify-center items-center mx-auto mb-4 w-20 h-20 text-3xl font-bold text-white rounded-full bg-white/20">
                                <span>{displayUser.name?.charAt(0) || displayUser.email?.charAt(0)}</span>
                            </div>
                            <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                                {isVerified ? `Welcome back, ${displayUser.name || 'User'}!` : 'Welcome to your new account'}
                            </h1>
                            <p className="text-lg opacity-90 text-slate-700 dark:text-slate-300">
                                {isVerified ? "We're glad to see you again. Let's get shopping!" : 'Choose one of the following to get started.'}
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Action Cards Section - show only after bootstrap; verify when unverified; upgrade only for verified customers */}
                {(
                    isBootstrapped &&
                    (
                        !isVerified || (isCustomer && !!isVerified)
                    )
                ) && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="mb-10"
                    >
                        <h2 className="mb-6 text-2xl font-bold text-center">
                            {isVerified ? 'Upgrade Your Experience' : 'Complete Your Setup'}
                        </h2>
                        <div className="grid grid-cols-1 gap-6 mx-auto max-w-4xl md:grid-cols-2">
                            {(!isVerified) && (
                                <ActionCard
                                    icon={<MdSecurity size={24} />}
                                    title="Verify your profile"
                                    description="Complete verification to unlock all features and enhance your account security."
                                    buttonText="Go to profile"
                                    buttonAction={() => navigate(AppRoutes.Profile)}
                                    gradient="from-green-500 to-emerald-500"
                                    hoverGradient="hover:from-green-600 hover:to-emerald-600"
                                />
                            )}
                            {(isCustomer && !!isVerified) && (
                                <ActionCard
                                    icon={<MdUpgrade size={24} />}
                                    title="Upgrade to a store or merchant"
                                    description="Start selling with our marketplace tools and grow your business."
                                    buttonText="Explore upgrades"
                                    buttonAction={() => navigate(AppRoutes.Upgrade)}
                                    gradient="from-purple-500 to-pink-500"
                                    hoverGradient="hover:from-purple-600 hover:to-pink-600"
                                />
                            )}
                        </div>
                    </motion.section>
                )}

                {/* User Stats - Only show if verified */}
                {isBootstrapped && !!isVerified && (
                    <motion.section
                        initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                        className="mb-10"
                    >
                        <h2 className="mb-4 text-2xl font-bold">Your Dashboard</h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {userStats.map((stat, index) => (
                                <StatsCard key={index} {...stat} index={index} />
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Quick Links - Only show if verified */}
                {isBootstrapped && !!isVerified && (
                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-10"
                    >
                        <h2 className="mb-4 text-2xl font-bold">Quick Links</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                            {quickLinks.map((link) => (
                                <div
                                    key={link.title}
                                    onClick={() => navigate(link.path)}
                                    className="p-6 h-full text-center bg-white rounded-lg shadow-sm transition-all duration-300 cursor-pointer group dark:bg-gray-800 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className={`inline-block mb-3 ${colorMap[link.color as ColorKeys].text}`}>
                                        {link.icon}
                                    </div>
                                    <h3 className="mb-1 text-lg font-bold">{link.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{link.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Personal Offers & Recommended Products Grid - Only show if verified */}
                {isBootstrapped && !!isVerified && (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Left Column: Recommended Products */}
                        <motion.section 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="lg:col-span-2"
                        >
                            <h2 className="mb-4 text-2xl font-bold">Recommended For You</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {featuredProducts && featuredProducts.length > 0 ? (
                                    featuredProducts.slice(0, 3).map((product) => (
                                        <div key={product.id} className="flex overflow-hidden flex-col h-full bg-white rounded-lg shadow-sm transition-all duration-300 cursor-pointer group dark:bg-gray-800 hover:shadow-lg hover:-translate-y-1">
                                            <div className="relative">
                                                <img src={product.thumbnail_image} alt={product.name} className="object-cover w-full h-48" />
                                                {product.discount > 0 && (
                                                    <div className="absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-md">
                                                        -{product.discount}%
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col flex-grow p-4">
                                                <h3 className="mb-1 font-bold line-clamp-2">{product.name}</h3>
                                                <div className="flex gap-1 items-center mb-2 text-sm text-gray-500">
                                                    <MdStar className="text-yellow-400" />
                                                    <span>{product.rating.toFixed(1)}</span>
                                                </div>
                                                <div className="flex gap-2 items-baseline mt-auto">
                                                    <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                                                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                                    </p>
                                                    {product.discount > 0 && (
                                                        <p className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-8 text-center">
                                        <p className="text-xl text-slate-500">No recommended products available.</p>
                                    </div>
                                )}
                            </div>
                        </motion.section>

                        {/* Right Column: Personal Offers */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <h2 className="mb-4 text-2xl font-bold">Your Personal Offers</h2>
                            <div className="space-y-4">
                                {personalOffers.map((offer) => (
                                    <div key={offer.title} className={`p-4 rounded-lg text-white bg-gradient-to-br ${colorMap[offer.color as ColorKeys].gradient}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold">{offer.title}</h3>
                                                <p className="text-sm opacity-90">{offer.description}</p>
                                            </div>
                                            <span className="px-2 py-1 text-xs font-bold rounded-md bg-white/20">{offer.code}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerWelcomePage;
