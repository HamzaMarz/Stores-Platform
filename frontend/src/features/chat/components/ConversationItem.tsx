import type { ChatSummary } from '../../chat/types'
import { useAuthStore } from '../../auth/state/useAuthStore'
import { motion } from 'framer-motion'

type Props = {
  chat: ChatSummary
  isActive: boolean
  unread?: boolean
  onClick: () => void
}

// Helper function to format relative time
function formatRelativeTime(date: string): string {
  const now = new Date()
  const messageDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
  
  return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Helper function to get message preview
function getMessagePreview(chat: ChatSummary, currentUserId: number): string {
  if (!chat.last_message) return 'No messages yet'
  
  const isFromCurrentUser = chat.last_message.sender_id === currentUserId
  const prefix = isFromCurrentUser ? 'You: ' : ''
  const message = chat.last_message.message || ''
  
  // Truncate long messages
  const maxLength = 50
  if (message.length > maxLength) {
    return prefix + message.substring(0, maxLength) + '...'
  }
  
  return prefix + message
}

export default function ConversationItem({ chat, isActive, unread, onClick }: Props) {
  const user = useAuthStore((s) => s.user)
  const messagePreview = getMessagePreview(chat, Number(user?.id) || 0)
  const relativeTime = formatRelativeTime(chat.updated_at)
  
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 border-b border-gray-100 transition-all duration-200 hover:bg-white hover:shadow-sm ${
        isActive 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 shadow-sm border-l-blue-500' 
          : 'bg-transparent hover:bg-white'
      }`}
      whileHover={{ scale: 1.005, y: -1 }}
      whileTap={{ scale: 0.995 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <img 
          src={chat.other_user_pic || '/default-avatar.png'} 
          alt={chat.other_user_name} 
          className="object-cover w-12 h-12 bg-gray-200 rounded-full border-2 border-white shadow-md" 
        />
        {unread && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full border-2 border-white shadow-sm"></div>
        )}
      </div>
      
      <div className="flex-1 min-w-0 text-left">
        <div className="flex justify-between items-center mb-1">
          <div className={`text-sm font-semibold truncate ${unread ? 'text-gray-900' : 'text-gray-800'}`}>
            {chat.other_user_name}
          </div>
          <div className="flex-shrink-0 ml-2 text-xs font-medium text-gray-500">
            {relativeTime}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className={`text-xs truncate ${unread ? 'font-semibold text-gray-700' : 'text-gray-500'}`}>
            {messagePreview}
          </div>
        </div>
      </div>
    </motion.button>
  )
}


