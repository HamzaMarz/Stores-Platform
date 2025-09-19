import { useEffect } from 'react'
import { useChatsList, useChatDetails, useSendMessage, useMarkRead } from '../hooks/useChats'
import { useChatStore } from '../state/useChatStore'
import ConversationItem from '../components/ConversationItem'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import ConversationSkeleton from '../components/ConversationSkeleton'
import MessageSkeleton from '../components/MessageSkeleton'
import { useToast } from '../../../hooks/useToast'

export default function ChatPage() {
  const { data: chatsResp, isLoading: isChatsLoading, error: chatsError } = useChatsList(0, 20)
  const activeChatId = useChatStore((s) => s.activeChatId)
  const setActiveChatId = useChatStore((s) => s.setActiveChatId)
  const { show } = useToast()

  const { data: chatDetails, isFetching: isChatFetching, refetch, error: chatError } = useChatDetails(activeChatId, 30, 0)
  const sendMessage = useSendMessage()
  const markRead = useMarkRead()

  useEffect(() => {
    if (activeChatId) {
      markRead.mutate({ chat_id: activeChatId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatId])

  useEffect(() => {
    if (chatsError) {
      show({ title: 'Failed to load conversations', description: chatsError.message, tone: 'error' })
    }
  }, [chatsError, show])

  useEffect(() => {
    if (chatError) {
      show({ title: 'Failed to load messages', description: chatError.message, tone: 'error' })
    }
  }, [chatError, show])

  return (
    <div className="container mx-auto p-4">
      <div className="flex h-full min-h-[70vh] border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xl backdrop-blur-sm">
        <aside className="w-80 border-r border-gray-200 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            <p className="text-sm text-gray-500 mt-1">Your conversations</p>
          </div>
          {isChatsLoading && (
            <div>
              {Array.from({ length: 5 }).map((_, index) => (
                <ConversationSkeleton key={index} />
              ))}
            </div>
          )}
          {chatsError && (
            <div className="p-4 text-center">
              <div className="text-red-500 text-sm mb-2">Failed to load conversations</div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                Retry
              </button>
            </div>
          )}
          {chatsResp?.data?.length === 0 && !isChatsLoading && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No conversations yet</h3>
              <p className="text-xs text-gray-500">Start a conversation with a seller or customer</p>
            </div>
          )}
          {chatsResp?.data?.map((c) => (
            <ConversationItem
              key={c.id}
              chat={c}
              isActive={activeChatId === c.id}
              onClick={() => setActiveChatId(c.id)}
            />
          ))}
        </aside>
        <main className="flex-1 flex flex-col">
          {!activeChatId && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
          {activeChatId && (
            <>
              <div className="border-b border-gray-200 px-6 py-4 text-sm font-medium flex items-center gap-4 bg-gradient-to-r from-white to-gray-50">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">#{activeChatId}</span>
                </div>
                <div>
                  <span className="text-gray-800 font-semibold">Chat #{activeChatId}</span>
                  <div className="text-xs text-gray-500">Active conversation</div>
                </div>
              </div>
              <div className="flex-1 min-h-0 bg-gradient-to-b from-gray-50 to-white">
                {isChatFetching && !chatDetails && (
                  <div className="flex flex-col-reverse overflow-y-auto h-full px-6 py-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <MessageSkeleton key={index} />
                    ))}
                  </div>
                )}
                {chatError && (
                  <div className="p-4 text-center">
                    <div className="text-red-500 text-sm mb-2">Failed to load messages</div>
                    <button 
                      onClick={() => refetch()} 
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}
                {chatDetails && <MessageList messages={chatDetails.messages} />}
              </div>
              <MessageInput
                disabled={sendMessage.isPending || !activeChatId}
                onSend={async (text) => {
                  if (!activeChatId) return
                  try {
                    await sendMessage.mutateAsync({ chat_id: activeChatId, message: text })
                  } catch (error) {
                    show({ 
                      title: 'Failed to send message', 
                      description: (error as Error).message, 
                      tone: 'error' 
                    })
                  }
                }}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}


