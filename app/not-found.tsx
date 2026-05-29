import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-cream-300 flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-6 h-6 text-warm-400" />
        </div>
        <h2 className="text-base font-semibold text-warm-900 mb-1">Sidan hittades inte</h2>
        <p className="text-sm text-warm-500 mb-4">Den här sidan finns inte.</p>
        <Link href="/dashboard" className="btn-primary inline-block">
          Till översikten
        </Link>
      </div>
    </div>
  )
}
