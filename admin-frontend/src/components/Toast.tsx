import React from 'react'
import { useToastStore } from '@/hooks/useToastStore'
import clsx from 'clsx'

const Toast: React.FC = () => {
  const { message, kind, clear } = useToastStore()
  if (!message) return null
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={clsx(
          'px-4 py-3 rounded-md shadow text-white',
          kind === 'success' && 'bg-green-600',
          kind === 'error' && 'bg-red-600',
          kind === 'info' && 'bg-slate-700'
        )}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center gap-3">
          <span>{message}</span>
          <button onClick={clear} className="text-white/90 hover:text-white text-sm">Dismiss</button>
        </div>
      </div>
    </div>
  )
}

export default Toast


