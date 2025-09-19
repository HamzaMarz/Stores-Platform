import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '../../catalog/hooks/useProducts'
import { useCreateChat } from '../hooks/useChats'
import { useChatStore } from '../state/useChatStore'
import { useAuthStore } from '../../auth/state/useAuthStore'
import { useToast } from '../../../hooks/useToast'
import { axiosClient } from '../../../lib/axios'
import { ApiEndpoints } from '../../../constants/api'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
  isOpen: boolean
  onClose: () => void
  product: Product
  onNavigateToChat: () => void
}

const suggestedMessages = [
  "Hi! I'm interested in this product. Is it still available?",
  "What's the best price you can offer for this item?",
  "Do you have this product in different colors/sizes?",
  "What's your return policy for this item?",
  "How long does shipping take to my location?",
  "Can you provide more details about this product?",
  "Is there a warranty included with this purchase?",
  "Do you offer bulk discounts for multiple items?"
]

export default function QuickMessageModal({ isOpen, onClose, product, onNavigateToChat }: Props) {
  const [selectedMessage, setSelectedMessage] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(false)
  
  const user = useAuthStore((s) => s.user)
  const { show } = useToast()
  const createChat = useCreateChat()
  const { setActiveChatId } = useChatStore()
  const queryClient = useQueryClient()

  const handleSendMessage = async () => {
    if (!user) {
      show({ title: 'Please login to send message', tone: 'error' })
      return
    }
    
    // Try to get owner_id from different possible locations
    const ownerId = product.owner_id || product.product_owner?.store_id
    console.log('Product data:', product)
    console.log('Product owner_id:', product.owner_id)
    console.log('Product product_owner:', product.product_owner)
    console.log('Product product_owner.store_id:', product.product_owner?.store_id)
    console.log('Owner ID found:', ownerId)
    
    if (!ownerId) {
      show({ title: 'Seller information not available', tone: 'error' })
      return
    }

    if (ownerId === Number(user.id)) {
      show({ title: 'Cannot message yourself', tone: 'error' })
      return
    }

    let message = isCustomMode ? customMessage.trim() : selectedMessage
    if (!message) {
      show({ title: 'Please select or write a message', tone: 'error' })
      return
    }

    // Add product details to the message (shorter version)
    const productDetails = `\n\nProduct: ${product.name} - $${discountedPrice.toFixed(2)}\nLink: ${window.location.href}`

    message = message + productDetails
    
    // Check message length (max 1000 characters)
    if (message.length > 1000) {
      show({ title: 'Message too long', description: 'Please shorten your message', tone: 'error' })
      return
    }

    try {
      console.log('Creating chat with ownerId:', ownerId, 'Type:', typeof ownerId)
      const chat = await createChat.mutateAsync({ user_id: Number(ownerId) })
      console.log('Chat created:', chat)
      setActiveChatId(chat.id)
      
      // Send the initial message directly
      console.log('Sending message:', message)
      console.log('Chat ID type:', typeof chat.id, 'Value:', chat.id)
      try {
        const response = await axiosClient.put(ApiEndpoints.ChatSendMessage, {
          chat_id: Number(chat.id), // Convert to number
          message: message
          // Don't send attachment field if it's null
        })
        console.log('Message sent successfully:', response.data)
        
        // Invalidate queries to refresh the chat data
        queryClient.invalidateQueries({ queryKey: ['chat', chat.id] })
        queryClient.invalidateQueries({ queryKey: ['chats'] })
        
        show({ title: 'Message sent successfully!', tone: 'success' })
      } catch (sendError) {
        console.error('Failed to send message:', sendError)
        show({ title: 'Chat opened, but message failed to send', description: 'You can send your message manually', tone: 'error' })
      }
      
      onNavigateToChat()
      onClose()
      
    } catch (error) {
      console.error('Error in handleSendMessage:', error)
      show({ 
        title: 'Failed to send message', 
        description: (error as Error).message, 
        tone: 'error' 
      })
    }
  }

  const productImageUrl = product.images?.[0] || product.thumbnail_image
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100)
  const hasDiscount = product.discount && product.discount > 0

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Quick Message to Seller</h2>
                  {product.product_owner?.merchant_alias && (
                    <p className="text-sm text-blue-100">Store: {product.product_owner.merchant_alias}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="transition-colors text-white/80 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <div className="flex gap-4">
                <img
                  src={productImageUrl}
                  alt={product.name}
                  className="object-cover w-16 h-16 bg-gray-200 rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-lg font-bold text-blue-600">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="px-2 py-1 text-xs text-red-600 bg-red-100 rounded">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Product ID: {product.id} • Category: {product.category}
                  </p>
                  <div className="inline-block px-2 py-1 mt-2 text-xs text-blue-600 bg-blue-100 rounded">
                    📦 Product details will be shared with seller
                  </div>
                </div>
              </div>
            </div>

            {/* Message Options */}
            <div className="p-6">
              <div className="mb-4">
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setIsCustomMode(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !isCustomMode
                        ? 'text-blue-700 bg-blue-100'
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Quick Messages
                  </button>
                  <button
                    onClick={() => setIsCustomMode(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isCustomMode
                        ? 'text-blue-700 bg-blue-100'
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Write Custom
                  </button>
                </div>

                {!isCustomMode ? (
                  <div className="overflow-y-auto space-y-2 max-h-48">
                    {suggestedMessages.map((message, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedMessage(message)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedMessage === message
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm">{message}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Write your message to the seller..."
                      className="p-3 w-full rounded-lg border border-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      {customMessage.length}/500 characters
                    </div>
                  </div>
                )}
              </div>

              {/* Product Link */}
              <div className="p-3 mb-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Product Link:</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="flex gap-1 items-center text-xs text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-500 break-all">
                  {window.location.href}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={createChat.isPending || (!selectedMessage && !customMessage.trim())}
                  className="flex flex-1 gap-2 justify-center items-center px-4 py-3 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg transition-all hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createChat.isPending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Opening Chat...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
