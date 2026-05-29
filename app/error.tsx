'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-base font-semibold text-warm-900 mb-1">Något gick fel</h2>
        <p className="text-sm text-warm-500 mb-4">Ett oväntat fel inträffade.</p>
        <button onClick={reset} className="btn-primary">
          Försök igen
        </button>
      </div>
    </div>
  )
}
