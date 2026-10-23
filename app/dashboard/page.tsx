'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, Plus, Boxes, CalendarHeart } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface EventSummary {
  event_slug: string
  anmalningar: number
  personer: number
  soppor: number | null
}

// 'avstickaren-2026-11-12' → { name: 'Avstickaren', date: '12 november', isoDate: '2026-11-12' }
function parseEventSlug(slug: string) {
  const m = slug.match(/^(.*)-(\d{4}-\d{2}-\d{2})$/)
  const rawName = m ? m[1] : slug
  const name = rawName.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())
  const date = m
    ? new Date(m[2] + 'T12:00:00').toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })
    : null
  return { name, date, isoDate: m ? m[2] : null }
}

export default function DashboardPage() {
  const [events, setEvents] = useState<EventSummary[]>([])

  useEffect(() => {
    supabase
      .from('event_registration_summary')
      .select('*')
      .then(({ data }) => {
        const today = new Date().toISOString().slice(0, 10)
        // Visa bara kommande event
        setEvents(((data ?? []) as EventSummary[]).filter(e => {
          const iso = parseEventSlug(e.event_slug).isoDate
          return !iso || iso >= today
        }))
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-cream-100">
      <Image
        src="/varvet_logo.JPG"
        alt="Varvet Garn"
        width={120}
        height={120}
        className="object-contain mb-4"
      />

      {events.map(e => {
        const { name, date } = parseEventSlug(e.event_slug)
        return (
          <div
            key={e.event_slug}
            className="w-full max-w-xs p-5 bg-white rounded-2xl shadow-sm border border-linen-200"
          >
            <div className="flex items-center gap-2 text-warm-600 text-sm">
              <CalendarHeart className="w-4 h-4" />
              <span>{name}{date && ` · ${date}`}</span>
            </div>
            <p className="mt-1 text-3xl font-semibold text-warm-800">
              {e.personer} <span className="text-lg font-normal text-warm-600">anmälda</span>
            </p>
            <p className="text-sm text-warm-600">
              {e.anmalningar} anmälningar · {e.soppor ?? 0} vill ha soppa
            </p>
          </div>
        )
      })}

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

      <Link
        href="/inventory"
        className="flex items-center justify-center gap-3 w-full max-w-xs py-5 bg-white text-warm-800 text-lg font-semibold rounded-2xl hover:bg-cream-200 active:scale-95 transition-all shadow-sm border border-linen-200"
      >
        <Boxes className="w-6 h-6" />
        Lager
      </Link>
    </div>
  )
}
