import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

/**
 * Reusable full-screen modal overlay with focus trapping.
 */
export default function Modal({ title, isOpen, onClose, children, hideCloseButton = false }) {
  const modalRef = useRef(null)

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !hideCloseButton) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, hideCloseButton])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-surface-900/40 backdrop-blur-sm transition-opacity"
        onClick={hideCloseButton ? undefined : onClose}
      />
      
      {/* Modal Dialog */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <h2 id="modal-title" className="text-lg font-semibold text-surface-900">
            {title}
          </h2>
          {!hideCloseButton && (
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-surface-500 hover:bg-surface-100 hover:text-surface-900 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
