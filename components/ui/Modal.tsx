'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ title, onClose, children, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className={`bg-white rounded-2xl shadow-xl w-full ${widths[size]} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-300 flex-shrink-0">
          <h2 className="text-base font-semibold text-warm-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-warm-400 hover:text-warm-700 hover:bg-cream-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  )
}
