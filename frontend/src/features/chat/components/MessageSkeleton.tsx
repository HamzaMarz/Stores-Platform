export default function MessageSkeleton() {
  return (
    <div className="w-full flex justify-start my-3 animate-pulse">
      <div className="max-w-[70%] flex flex-col">
        <div className="rounded-2xl rounded-bl-md bg-gradient-to-br from-gray-200 to-gray-300 px-5 py-3 shadow-sm">
          <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg w-48 mb-2"></div>
          <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg w-32"></div>
        </div>
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 mt-2"></div>
      </div>
    </div>
  )
}
