import { useToast } from '../../../hooks/useToast'

export default function ActiveToasts() {
  const { toasts, remove } = useToast()
  if (!toasts.length) return null
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`min-w-[260px] rounded shadow px-3 py-2 text-sm ${t.tone === 'error' ? 'bg-red-600 text-white' : t.tone === 'success' ? 'bg-green-600 text-white' : 'bg-gray-900 text-white'}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-medium">{t.title}</div>
              {t.description && <div className="opacity-90 text-xs mt-0.5">{t.description}</div>}
            </div>
            <button onClick={() => remove(t.id)} className="opacity-80 hover:opacity-100">✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}


