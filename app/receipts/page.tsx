'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Receipt } from '@/lib/types'
import { Plus, FileText, Eye, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'

const PAYMENT_LABELS: Record<string, string> = {
  swish: 'Swish',
  kontant: 'Kontant',
  kort: 'Kort',
  faktura: 'Faktura',
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase
      .from('receipts')
      .select('*, items:receipt_items(*)')
      .order('receipt_number', { ascending: false })
    setReceipts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(r: Receipt) {
    if (!confirm(`Ta bort kvitto ${r.receipt_number}?`)) return
    await supabase.from('receipts').delete().eq('id', r.id)
    load()
  }

  function totalForReceipt(r: Receipt) {
    return (r.items ?? []).reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  }

  function formatSEK(amount: number) {
    const rounded = Math.round(amount)
    return `${rounded.toLocaleString('sv-SE')}:-`
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Kvitton</h1>
          <p className="text-sm text-warm-500 mt-0.5">{receipts.length} kvitton totalt</p>
        </div>
        <Link
          href="/receipts/new"
          className="flex items-center gap-2 px-4 py-2 bg-sage-600 text-white text-sm font-medium rounded-lg hover:bg-sage-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nytt kvitto
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-warm-400 text-sm">Laddar...</div>
      ) : receipts.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-10 h-10 text-warm-300 mx-auto mb-3" />
          <p className="text-warm-500 text-sm">Inga kvitton än.</p>
          <Link href="/receipts/new" className="mt-3 inline-block text-sage-600 text-sm hover:underline">
            Skapa ditt första kvitto
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-linen-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-linen-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-warm-500">Nummer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-warm-500">Datum</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-warm-500">Kund</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-warm-500">Betalt</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-warm-500">Summa</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-linen-100">
              {receipts.map(r => (
                <tr key={r.id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-5 py-3 font-mono font-medium text-warm-900">{r.receipt_number}</td>
                  <td className="px-4 py-3 text-warm-700">
                    {format(new Date(r.receipt_date), 'd MMM yyyy', { locale: sv })}
                  </td>
                  <td className="px-4 py-3 text-warm-700">{r.customer_name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-linen-100 text-warm-600 capitalize">
                      {PAYMENT_LABELS[r.payment_method] ?? r.payment_method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-warm-900">
                    {formatSEK(totalForReceipt(r))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/receipts/${r.id}`}
                        className="flex items-center gap-1 text-sage-600 hover:text-sage-800 text-xs font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Visa
                      </Link>
                      <button
                        onClick={() => handleDelete(r)}
                        className="p-1 text-warm-300 hover:text-red-500 transition-colors rounded"
                        title="Ta bort kvitto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
