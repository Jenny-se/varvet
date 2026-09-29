'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FileText, Plus } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-cream-100">
      <Image
        src="/varvet_logo.JPG"
        alt="Varvet Garn"
        width={120}
        height={120}
        className="object-contain mb-4"
      />

      <Link
        href="/receipts/new"
        className="flex items-center justify-center gap-3 w-full max-w-xs py-5 bg-sage-600 text-white text-lg font-semibold rounded-2xl hover:bg-sage-700 active:scale-95 transition-all shadow-md"
      >
        <Plus className="w-6 h-6" />
        Nytt kvitto
      </Link>

      <Link
        href="/receipts"
        className="flex items-center justify-center gap-3 w-full max-w-xs py-5 bg-white text-warm-800 text-lg font-semibold rounded-2xl hover:bg-cream-200 active:scale-95 transition-all shadow-sm border border-linen-200"
      >
        <FileText className="w-6 h-6" />
        Alla kvitton
      </Link>
    </div>
  )
}
