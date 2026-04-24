import { useEffect, useState } from 'react'

import { cn } from '../../lib/cn'
import { subscribeToToast } from '../../utils/toast'

interface ToastItem {
  id: number
  title: string
  description?: string
  tone: 'success' | 'error' | 'info'
}

const toneClasses = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
}

export function ToastViewport() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    let nextId = 1
    return subscribeToToast((detail) => {
      const id = nextId++
      setItems((current) => [...current, { id, tone: detail.tone ?? 'info', ...detail }])

      window.setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== id))
      }, 3800)
    })
  }, [])

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            'pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg backdrop-blur',
            toneClasses[item.tone],
          )}
        >
          <p className="text-sm font-semibold">{item.title}</p>
          {item.description ? <p className="mt-1 text-sm opacity-85">{item.description}</p> : null}
        </div>
      ))}
    </div>
  )
}
