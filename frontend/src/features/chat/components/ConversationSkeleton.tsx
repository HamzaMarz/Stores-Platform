export default function ConversationSkeleton() {
  return (
    <div className="w-full flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-transparent animate-pulse">
      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full shadow-sm"></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-28"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-10"></div>
        </div>
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-36"></div>
      </div>
    </div>
  )
}
