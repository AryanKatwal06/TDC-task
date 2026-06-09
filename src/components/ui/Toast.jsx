import React, { useEffect } from 'react'
import { create } from 'zustand'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

// Toast Store
export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString()
    set((state) => ({ toasts: [...state.toasts, { id, ...toast }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 5000)
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

// Toast Provider Component (Rendered once in App.jsx)
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }) {
  const { type = 'success', title, message } = toast

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-jade" />,
    error:   <XCircle className="w-5 h-5 text-crimson" />,
    warning: <AlertCircle className="w-5 h-5 text-amber" />,
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error:   'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
  }

  return (
    <div className={`pointer-events-auto flex items-start p-4 w-80 rounded-lg border shadow-lg animate-in slide-in-from-right-8 duration-300 ${bgColors[type]}`}>
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold text-surface-900">{title}</p>}
        {message && <p className="text-sm text-surface-700 mt-1">{message}</p>}
      </div>
      <button
        onClick={onDismiss}
        className="ml-4 flex-shrink-0 text-surface-400 hover:text-surface-600 focus:outline-none"
      >
        <span className="sr-only">Close</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
