import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/state/useAuthStore';
import {
    MdStorefront, MdReceiptLong, MdTrendingUp, MdPeople,
    MdStar, MdSecurity, MdShoppingCart
} from 'react-icons/md';
import { useDashboardStats } from '../../../features/dashboard/hooks/useDashboardStats';
import { useTopSellerProducts } from '../../../features/seller/hooks/useSellerProducts';

// Reusable color mapping for dynamic styles
const colorMap = {
    primary: 'text-blue-500 dark:text-blue-400',
    success: 'text-green-500 dark:text-green-400',
    warning: 'text-yellow-500 dark:text-yellow-400',
    info: 'text-sky-500 dark:text-sky-400',
    error: 'text-red-500 dark:text-red-400',
};

type ColorKeys = keyof typeof colorMap;

const SellerWelcomePage: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);

    // Real data from API
    const { data: dashboardStats } = useDashboardStats();
    const { data: topProducts } = useTopSellerProducts();

    // Mock user for demonstration if not logged in
    const displayUser = user || {
        name: 'Seller',
        email: 'seller@example.com',
        type: 'merchant' as const
    };

    // Store statistics from real data
    const storeStats = [
        { icon: <MdStorefront size={30} />, title: 'Total Products', value: dashboardStats?.products.toString() || '0', color: 'primary' },
        { icon: <MdTrendingUp size={30} />, title: 'Monthly Revenue', value: `$${dashboardStats?.monthlyRevenue.toLocaleString() || '0'}`, color: 'success' },
        { icon: <MdPeople size={30} />, title: 'Total Customers', value: dashboardStats?.totalCustomers.toString() || '0', color: 'info' }
    ];

    const quickActions = [
        { title: 'Add New Product', description: 'Expand your catalog with new items.', icon: <MdShoppingCart size={24} />, path: '/dashboard/products', color: 'primary' },
        { title: 'View Analytics', description: 'Track your store\'s performance and sales.', icon: <MdTrendingUp size={24} />, path: '/dashboard/analytics', color: 'warning' },
        { title: 'Inventory Management', description: 'Monitor stock levels and manage inventory.', icon: <MdSecurity size={24} />, path: '/dashboard/inventory', color: 'info' }
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
                
                {/* Welcome Header */}
                <div className="overflow-hidden relative p-8 mb-8 text-center text-white bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg">
                    <div
                        className="absolute inset-0 via-transparent to-transparent bg-gradient-radial from-blue-400/20"
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
                            <h1 className="mb-2 text-3xl font-bold md:text-4xl">Welcome back, {displayUser.name || 'Seller'}!</h1>
                            <p className="text-lg text-blue-100 opacity-90">
                                Manage your store, track sales, and grow your business.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Store Statistics */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-10"
                >
                    <h2 className="mb-4 text-2xl font-bold">Store Overview</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                        {storeStats.map((stat) => (
                            <div key={stat.title} className="p-6 h-full text-center bg-white rounded-lg shadow-sm transition-all duration-300 dark:bg-gray-800 hover:shadow-lg hover:-translate-y-1">
                                <div className={`inline-block mb-3 ${colorMap[stat.color as ColorKeys]}`}>
                                    {stat.icon}
                                </div>
                                <p className="mb-1 text-3xl font-bold text-gray-800 lg:text-4xl dark:text-white">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {stat.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Quick Actions */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-10"
                >
                    <h2 className="mb-4 text-2xl font-bold">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                        {quickActions.map((action) => (
                            <div
                                key={action.title}
                                onClick={() => navigate(action.path)}
                                className="p-6 h-full text-center bg-white rounded-lg shadow-sm transition-all duration-300 cursor-pointer group dark:bg-gray-800 hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className={`inline-block mb-3 ${colorMap[action.color as ColorKeys]}`}>
                                    {action.icon}
                                </div>
                                <h3 className="mb-1 text-lg font-bold">{action.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Recent Orders & Top Products Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Recent Orders */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <h2 className="mb-4 text-2xl font-bold">Recent Orders</h2>
                        <div className="overflow-hidden bg-white rounded-lg shadow-sm dark:bg-gray-800">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Order ID</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Amount</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Status</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        {/* The original code had recentOrders?.data, but useRecentSellerOrders was removed.
                                            Assuming the intent was to show a placeholder or no data if recentOrders is not available.
                                            Since recentOrders is no longer imported, we'll just show a placeholder. */}
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                No recent orders data available.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.section>

                    {/* Top Products */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <h2 className="mb-4 text-2xl font-bold">Top Performing Products</h2>
                        <div className="space-y-4">
                            {topProducts?.data && topProducts.data.length > 0 ? (
                                topProducts.data.slice(0, 3).map((product) => (
                                    <div key={product.id} className="p-4 bg-white rounded-lg shadow-sm transition-shadow dark:bg-gray-800 hover:shadow-md">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                                                <div className="flex gap-4 items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span>{product.sell_count} sales</span>
                                                    <span>${(product.price * product.sell_count).toFixed(2)} revenue</span>
                                                    <div className="flex gap-1 items-center">
                                                        <MdStar className="text-yellow-400" />
                                                        <span>{product.rating.toFixed(1)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                                    ${(product.price * product.sell_count).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No products available
                                </div>
                            )}
                        </div>
                    </motion.section>
                </div>

                {/* Performance Insights */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className="mt-10"
                >
                    <h2 className="mb-4 text-2xl font-bold">Performance Insights</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="p-6 text-white bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-green-100">Total Sales</p>
                                    <p className="text-3xl font-bold">${dashboardStats?.monthlyRevenue.toLocaleString() || '0'}</p>
                                    <p className="text-sm text-green-100">+15% from last month</p>
                                </div>
                                <MdTrendingUp size={40} className="text-green-200" />
                            </div>
                        </div>
                        <div className="p-6 text-white bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-blue-100">Products</p>
                                    <p className="text-3xl font-bold">{dashboardStats?.products || 0}</p>
                                    <p className="text-sm text-blue-100">+8% from last month</p>
                                </div>
                                <MdReceiptLong size={40} className="text-blue-200" />
                            </div>
                        </div>
                        <div className="p-6 text-white bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-purple-100">Customers</p>
                                    <p className="text-3xl font-bold">{dashboardStats?.totalCustomers || 0}</p>
                                    <p className="text-sm text-purple-100">+12% from last month</p>
                                </div>
                                <MdPeople size={40} className="text-purple-200" />
                            </div>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default SellerWelcomePage;
