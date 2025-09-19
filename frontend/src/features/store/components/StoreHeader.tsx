import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { StoreDetails } from '../types'
import { useCreateChat } from '../../chat/hooks/useChats'
import { useChatStore } from '../../chat/state/useChatStore'
import { useAuthStore } from '../../auth/state/useAuthStore'
import { useToast } from '../../../hooks/useToast'
import { AppRoutes } from '../../../constants/app'

interface Props {
    store: StoreDetails
}

const StoreHeader: React.FC<Props> = ({ store }) => {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const { show } = useToast()
    const createChat = useCreateChat()
    const { setActiveChatId } = useChatStore()

    const formatAddress = () => {
        const parts = [
            store.address1,
            store.address2,
            store.city,
            store.country
        ].filter(Boolean)
        return parts.join(', ')
    }

    const formatRating = (rating: number | null) => {
        if (rating === null || rating === 0) return 'No ratings yet'
        return `${rating.toFixed(1)} ⭐`
    }

    const handleMessageStoreOwner = async () => {
        if (!user) {
            show({ title: 'Please login to message store owner', tone: 'error' })
            return
        }
        
        if (store.owner.id === Number(user.id)) {
            show({ title: 'Cannot message yourself', tone: 'error' })
            return
        }

        try {
            const chat = await createChat.mutateAsync({ user_id: store.owner.id })
            setActiveChatId(chat.id)
            navigate(AppRoutes.Chat)
            show({ title: 'Chat opened with store owner', tone: 'success' })
        } catch (error) {
            show({ 
                title: 'Failed to start chat', 
                description: (error as Error).message, 
                tone: 'error' 
            })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 md:p-8 shadow-lg"
        >
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Store Logo */}
                <div className="flex-shrink-0">
                    {store.logo ? (
                        <img
                            src={store.logo}
                            alt={`${store.store_name} logo`}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-md"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                            }}
                        />
                    ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                            <span className="text-white text-2xl md:text-3xl font-bold">
                                {store.store_name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Store Info */}
                <div className="flex-1 min-w-0">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2"
                    >
                        {store.store_name}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300"
                    >
                        {store.address1 && (
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span>{formatAddress()}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span>{store.owner.first_name} {store.owner.last_name}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Store Stats & Actions */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex-shrink-0 flex flex-col gap-3"
                >
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatRating(store.rating)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {store.rating_count || 0} reviews
                            </div>
                        </div>
                    </div>
                    
                    {/* Message Store Owner Button */}
                    {store.owner.id !== Number(user?.id) && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={createChat.isPending}
                            onClick={handleMessageStoreOwner}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            {createChat.isPending ? 'Opening...' : 'Message Store Owner'}
                        </motion.button>
                    )}
                </motion.div>
            </div>

            {/* Store Description */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                        <span>Member since {new Date(store.created_at).getFullYear()}</span>
                        <span>•</span>
                        <span>{store.owner.type} account</span>
                    </div>
                    <div className="text-xs">
                        Last updated: {new Date(store.updated_at).toLocaleDateString()}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default StoreHeader
