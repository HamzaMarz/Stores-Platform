import type { ChatMessage } from '../types'
import MessageBubble from './MessageBubble'
import { useAuthStore } from '../../auth/state/useAuthStore'

type Props = { messages: ChatMessage[] }

// Helper function to check if two messages are from the same sender
function isSameSender(message1: ChatMessage, message2: ChatMessage): boolean {
  return message1.sender === message2.sender
}

// Helper function to check if two messages are within 5 minutes of each other
function isWithinTimeWindow(message1: ChatMessage, message2: ChatMessage): boolean {
  const time1 = new Date(message1.created_at).getTime()
  const time2 = new Date(message2.created_at).getTime()
  const diffInMinutes = Math.abs(time1 - time2) / (1000 * 60)
  return diffInMinutes <= 5
}

// Helper function to check if two messages are on different days
function isDifferentDay(message1: ChatMessage, message2: ChatMessage): boolean {
  const date1 = new Date(message1.created_at).toDateString()
  const date2 = new Date(message2.created_at).toDateString()
  return date1 !== date2
}

// Helper function to format date separator
function formatDateSeparator(date: string): string {
  const messageDate = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (messageDate.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return messageDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    })
  }
}

export default function MessageList({ messages }: Props) {
  const user = useAuthStore((s) => s.user)
  
  // Group messages and add separators
  const processedMessages = messages.map((message, index) => {
    const prevMessage = index > 0 ? messages[index - 1] : null
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null
    
    // Check if this is the first message of a group
    const isFirstInGroup = !prevMessage || 
      !isSameSender(message, prevMessage) || 
      !isWithinTimeWindow(message, prevMessage)
    
    // Check if this is the last message of a group
    const isLastInGroup = !nextMessage || 
      !isSameSender(message, nextMessage) || 
      !isWithinTimeWindow(message, nextMessage)
    
    // Check if we need a date separator
    const showDateSeparator = !prevMessage || isDifferentDay(message, prevMessage)
    const dateSeparatorText = showDateSeparator ? formatDateSeparator(message.created_at) : undefined
    
    return {
      ...message,
      isFirstInGroup,
      isLastInGroup,
      showDateSeparator,
      dateSeparatorText
    }
  })
  
  return (
    <div className="flex flex-col-reverse overflow-y-auto h-full px-6 py-6">
      {processedMessages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message}
          isFirstInGroup={message.isFirstInGroup}
          isLastInGroup={message.isLastInGroup}
          showDateSeparator={message.showDateSeparator}
          dateSeparatorText={message.dateSeparatorText}
        />
      ))}
      
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Start your conversation</h3>
            <p className="text-xs text-gray-500">Send a message to begin chatting</p>
          </div>
        </div>
      )}
    </div>
  )
}


