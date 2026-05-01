export type ToastTone = 'success' | 'error' | 'info'

export interface ToastDetail {
  title: string
  description?: string
  tone?: ToastTone
}

const TOAST_EVENT = 'cloudcampus:toast'

export function showToast(detail: ToastDetail) {
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, { detail }))
}

export function subscribeToToast(listener: (detail: ToastDetail) => void) {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<ToastDetail>
    listener(customEvent.detail)
  }

  window.addEventListener(TOAST_EVENT, handler)
  return () => window.removeEventListener(TOAST_EVENT, handler)
}
