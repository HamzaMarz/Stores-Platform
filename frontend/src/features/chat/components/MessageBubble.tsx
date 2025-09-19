import type { ChatMessage } from '../types'
import { useAuthStore } from '../../auth/state/useAuthStore'
import { motion } from 'framer-motion'

type Props = { 
  message: ChatMessage
  isFirstInGroup?: boolean
  isLastInGroup?: boolean
  showDateSeparator?: boolean
  dateSeparatorText?: string
}

// Helper function to format time
function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

// Helper function to get read receipt status
function getReadReceiptStatus(message: ChatMessage): 'sent' | 'delivered' | 'read' {
  // This is a placeholder - in real implementation, you'd check message status
  // For now, we'll simulate based on message age
  const messageAge = Date.now() - new Date(message.created_at).getTime()
  if (messageAge < 10000) return 'sent' // Less than 10 seconds
  if (messageAge < 60000) return 'delivered' // Less than 1 minute
  return 'read' // More than 1 minute
}

export default function MessageBubble({ 
  message, 
  isFirstInGroup = true, 
  isLastInGroup = true,
  showDateSeparator = false,
  dateSeparatorText
}: Props) {
  const user = useAuthStore((s) => s.user)
  const isMine = user && Number(user.id) === message.sender
  const readStatus = getReadReceiptStatus(message)
  
  return (
    <>
      {showDateSeparator && dateSeparatorText && (
        <div className="flex items-center justify-center my-4">
          <div className="flex items-center">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 py-1 text-xs text-gray-500 bg-white rounded-full">
              {dateSeparatorText}
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
        </div>
      )}
      
      <motion.div 
        className={`w-full flex ${isMine ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-2' : 'mt-0.5'}`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className={`max-w-[70%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
          <motion.div 
            className={`rounded-2xl px-5 py-3 text-sm relative shadow-sm ${
              isMine 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-200' 
                : 'bg-white text-gray-800 shadow-gray-200 border border-gray-100'
            } ${
              isFirstInGroup && isLastInGroup 
                ? 'rounded-2xl' 
                : isFirstInGroup 
                  ? isMine 
                    ? 'rounded-2xl rounded-br-md' 
                    : 'rounded-2xl rounded-bl-md'
                  : isLastInGroup
                    ? isMine
                      ? 'rounded-2xl rounded-tr-md'
                      : 'rounded-2xl rounded-tl-md'
                    : isMine
                      ? 'rounded-md rounded-br-md rounded-tr-md'
                      : 'rounded-md rounded-bl-md rounded-tl-md'
            }`}
            whileHover={{ scale: 1.01, y: -1 }}
            transition={{ duration: 0.15 }}
          >
            <div className="break-words">{message.message}</div>
            {message.attachment && (
              <div className={`mt-3 p-3 rounded-xl ${
                isMine 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                  </svg>
                  <span className={isMine ? 'text-white/90' : 'text-gray-600'}>
                    Attachment: {message.attachment}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
          
          <div className={`flex items-center gap-1 mt-1 px-1 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className={`text-[10px] ${isMine ? 'text-gray-500' : 'text-gray-400'}`}>
              {formatTime(message.created_at)}
            </span>
            {isMine && (
              <div className="flex items-center">
                {readStatus === 'sent' && (
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                )}
                {readStatus === 'delivered' && (
                  <div className="flex">
                    <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <svg className="w-3 h-3 text-gray-400 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                )}
                {readStatus === 'read' && (
                  <div className="flex">
                    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <svg className="w-3 h-3 text-blue-500 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}


