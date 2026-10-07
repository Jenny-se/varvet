'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Receipt } from '@/lib/types'
import { Plus, FileText, Eye, Trash2, Pencil, AlertCircle, Mail, Download } from 'lucide-react'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { generateReceiptPdf } from '@/lib/generateReceiptPdf'

const PAYMENT_LABELS: Record<string, string> = {
  swish: 'Swish',
  bg: 'BG',
  kort: 'Kort',
  faktura: 'Faktura',
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [downloading, setDownloading] = useState(false)

  async function load() {
    const { data } = await supabase
      .from('receipts')
      .select('*, items:receipt_items(*)')
      .order('receipt_number', { ascending: false })
    setReceipts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const months = useMemo(() => {
    const seen = new Set<string>()
    const result: { value: string; label: string }[] = []
    for (const r of receipts) {
      const m = r.receipt_date.slice(0, 7)
      if (!seen.has(m)) {
        seen.add(m)
        result.push({ value: m, label: format(new Date(r.receipt_date + 'T12:00:00'), 'MMMM yyyy', { locale: sv }) })
      }
    }
    return result
  }, [receipts])

  const filtered = useMemo(() =>
    selectedMonth ? receipts.filter(r => r.receipt_date.startsWith(selectedMonth)) : receipts
  , [receipts, selectedMonth])

  async function handleDelete(r: Receipt) {
    if (!confirm(`Ta bort kvitto ${r.receipt_number}?`)) return
    await supabase.from('receipts').delete().eq('id', r.id)
    load()
  }

  function totalForReceipt(r: Receipt) {
    return (r.items ?? []).reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  }

  function formatSEK(amount: number) {
    return `${Math.round(amount).toLocaleString('sv-SE')}:-`
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(r => r.id)))
    }
  }

  async function handleDownload() {
    setDownloading(true)
    const toDownload = receipts.filter(r => selectedIds.has(r.id))
    for (const r of toDownload) {
      await generateReceiptPdf(r)
    }
    setDownloading(false)
  }

  const allSelected = filtered.length > 0 && selectedIds.size === filtered.length
  const someSelected = selectedIds.size > 0

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Kvitton</h1>
          <p className="text-sm text-warm-500 mt-0.5">
            {selectedMonth ? `${filtered.length} av ` : ''}{receipts.length} kvitton totalt
          </p>
        </div>
        <div className="flex items-center gap-3">
          {someSelected && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-warm-700 text-white text-sm font-medium rounded-lg hover:bg-warm-800 transition-colors disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Genererar...' : `Ladda ner ${selectedIds.size} kvitto${selectedIds.size !== 1 ? 'n' : ''}`}
            </button>
          )}
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-3 py-2 text-sm border border-linen-200 rounded-lg bg-white text-warm-700 focus:outline-none focus:ring-2 focus:ring-sage-300"
          >
            <option value="">Alla månader</option>
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <Link
            href="/receipts/new"
            className="flex items-center gap-2 px-4 py-2 bg-sage-600 text-white text-sm font-medium rounded-lg hover:bg-sage-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nytt kvitto
          </Link>
        </div>
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
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-warm-400 text-sm">Inga kvitton för vald månad.</div>
      ) : (
        <div className="bg-white rounded-xl border border-linen-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-linen-100">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-sage-600"
                  />
                </th>
                <th className="text-left px-3 py-3 text-xs font-medium text-warm-500">Nummer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-warm-500">Datum</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-warm-500">Kund</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-warm-500">Betalsätt</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-warm-500">Summa</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-linen-100">
              {filtered.map(r => (
                <tr
                  key={r.id}
                  className={`hover:bg-cream-50 transition-colors cursor-pointer ${selectedIds.has(r.id) ? 'bg-sage-50' : ''}`}
                  onClick={() => toggleSelect(r.id)}
                >
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(r.id)}
                      onChange={() => toggleSelect(r.id)}
                      className="w-4 h-4 accent-sage-600"
                    />
                  </td>
                  <td className="px-3 py-3 font-mono font-medium text-warm-900">
                    <div className="flex items-center gap-1.5">
                      {!r.paid && (
                        <AlertCircle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" aria-label="Ej betalt" />
                      )}
                      {r.email_to && (
                        <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" aria-label={`Skicka e-post till ${r.email_to}`} />
                      )}
                      {r.receipt_number}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-warm-700">
                    {format(new Date(r.receipt_date + 'T12:00:00'), 'd MMM yyyy', { locale: sv })}
                  </td>
                  <td className="px-4 py-3 text-warm-700">{r.customer_name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-linen-100 text-warm-600">
                      {PAYMENT_LABELS[r.payment_method] ?? r.payment_method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-warm-900">
                    {formatSEK(totalForReceipt(r))}
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/receipts/${r.id}`}
                        className="p-1 text-sage-600 hover:text-sage-800 transition-colors rounded"
                        title="Visa kvitto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/receipts/${r.id}/edit`}
                        className="p-1 text-warm-500 hover:text-warm-800 transition-colors rounded"
                        title="Ändra kvitto"
                      >
                        <Pencil className="w-3.5 h-3.5" />
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
