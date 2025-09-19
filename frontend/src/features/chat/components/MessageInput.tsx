import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = { onSend: (text: string) => Promise<void> | void; disabled?: boolean }

// Common emojis for quick access
const commonEmojis = ['😀', '😂', '😍', '🥰', '😊', '😎', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉', '👏', '🙏', '😢', '😡', '🤯', '💪', '🎯']

export default function MessageInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [text])

  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed) return
    setText('')
    setShowEmojiPicker(false)
    setShowAttachmentMenu(false)
    await onSend(trimmed)
  }

  const handleEmojiClick = (emoji: string) => {
    setText(prev => prev + emoji)
    setShowEmojiPicker(false)
    textareaRef.current?.focus()
  }

  const handleAttachmentClick = (type: string) => {
    setShowAttachmentMenu(false)
    
    if (type === 'image') {
      // Create file input for images
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = false
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          handleFileUpload(file, 'image')
        }
      }
      input.click()
    } else if (type === 'file') {
      // Create file input for documents
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.pdf,.doc,.docx,.txt,.zip,.rar'
      input.multiple = false
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          handleFileUpload(file, 'file')
        }
      }
      input.click()
    } else if (type === 'location') {
      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            const locationText = `📍 My location: https://maps.google.com/?q=${latitude},${longitude}`
            setText(prev => prev + locationText)
          },
          (error) => {
            console.error('Error getting location:', error)
            setText(prev => prev + '📍 Location sharing failed')
          }
        )
      } else {
        setText(prev => prev + '📍 Location not supported')
      }
    }
  }

  const handleFileUpload = async (file: File, type: 'image' | 'file') => {
    try {
      // For now, we'll just add the file name to the message
      // In a real implementation, you'd upload the file to the server first
      const fileInfo = `📎 ${type === 'image' ? 'Image' : 'File'}: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`
      setText(prev => prev + (prev ? '\n' : '') + fileInfo)
    } catch (error) {
      console.error('Error handling file:', error)
    }
  }

  return (
    <div className="border-t border-gray-200 bg-gradient-to-r from-white to-gray-50">
      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div 
            className="border-b border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-wrap gap-2">
              {commonEmojis.map((emoji, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-10 h-10 text-lg hover:bg-gray-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachment Menu */}
      <AnimatePresence>
        {showAttachmentMenu && (
          <motion.div 
            className="border-b border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex gap-3">
              <motion.button
                onClick={() => handleAttachmentClick('image')}
                className="flex items-center gap-3 px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Photo
              </motion.button>
              <motion.button
                onClick={() => handleAttachmentClick('file')}
                className="flex items-center gap-3 px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                File
              </motion.button>
              <motion.button
                onClick={() => handleAttachmentClick('location')}
                className="flex items-center gap-3 px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Location
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex items-end gap-3 p-4">
        <motion.button
          onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          className="p-3 text-gray-400 hover:text-gray-600 transition-all duration-200 rounded-xl hover:bg-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </motion.button>
        
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            className="w-full resize-none border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px] max-h-[120px] shadow-sm focus:shadow-md transition-all duration-200"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            disabled={disabled}
            rows={1}
          />
        </div>
        
        <motion.button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-3 text-gray-400 hover:text-gray-600 transition-all duration-200 rounded-xl hover:bg-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </motion.button>
        
        <motion.button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </motion.button>
      </div>
    </div>
  )
}


