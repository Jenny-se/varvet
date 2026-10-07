'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { Receipt, ReceiptItem } from '@/lib/types'
import { Printer } from 'lucide-react'
import { format } from 'date-fns'

const PAYMENT_LABELS: Record<string, string> = {
  swish: 'swish',
  bg: 'bankgiro',
  kort: 'kort',
  faktura: 'faktura',
}

const COMPANY = {
  email: 'info@varvetgarn.se',
  phone: '0733-503034',
  swish: '123-143 89 93',
  bankgiro: '5479-4375',
  orgnr: '556683-4510',
  momsreg: 'SE55668345101',
  returnPolicy: 'Returer och byten enligt gällande villkor.',
}

function formatSEK(n: number) {
  const rounded = Math.round(n * 100) / 100
  if (rounded === Math.round(rounded)) {
    return `${Math.round(rounded).toLocaleString('sv-SE')}:-`
  }
  return `${rounded.toFixed(2).replace('.', ',')}:-`
}

function itemTotal(item: ReceiptItem) {
  return item.quantity * item.unit_price
}

function vatSummary(items: ReceiptItem[]) {
  const map: Record<number, number> = {}
  for (const it of items) {
    const rate = it.vat_rate
    const total = itemTotal(it)
    const vatAmount = total * rate / (100 + rate)
    map[rate] = (map[rate] ?? 0) + vatAmount
  }
  return Object.entries(map)
    .filter(([, v]) => v > 0)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([rate, amount]) => ({ rate: Number(rate), amount }))
}

function ReceiptBlock({ receipt }: { receipt: Receipt }) {
  const items = [...(receipt.items ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  const total = items.reduce((s, it) => s + itemTotal(it), 0)
  const vats = vatSummary(items)
  const vatLine = vats.length === 1
    ? `(varav moms ${Math.round(vats[0].amount).toLocaleString('sv-SE')}:-)`
    : vats.map(v => `(varav moms ${v.rate}%: ${Math.round(v.amount).toLocaleString('sv-SE')}:-)`).join(' / ')

  return (
    <div className="receipt-page p-8 max-w-[520px] mx-auto bg-white">
      <div className="mb-6">
        <Image
          src="/varvet_logo.JPG"
          alt="Varvet Garn"
          width={64}
          height={64}
          className="object-contain"
        />
      </div>

      <h1 className="text-sm font-bold text-warm-900 mb-3 tracking-wide">KVITTO</h1>

      <div className="space-y-0.5 mb-4 text-xs text-warm-800">
        <p>Kvittonummer: {receipt.receipt_number}</p>
        <p>Datum: {format(new Date(receipt.receipt_date), 'yyyy-MM-dd')}</p>
      </div>

      {receipt.customer_name && (
        <p className="text-xs text-warm-800 mb-1">Kund: {receipt.customer_name}</p>
      )}

      <p className="text-xs text-warm-800 mb-5">
        Betalt: {PAYMENT_LABELS[receipt.payment_method] ?? receipt.payment_method}
      </p>

      <table className="w-full text-xs mb-5">
        <thead>
          <tr className="border-b-2 border-warm-800">
            <th className="text-left py-1.5 font-semibold text-warm-800">Produkt</th>
            <th className="text-left py-1.5 font-semibold text-warm-800 w-12">Antal</th>
            <th className="text-right py-1.5 font-semibold text-warm-800 w-20">à Pris</th>
            <th className="text-right py-1.5 font-semibold text-warm-800 w-20">Totalt</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id} className="border-b border-linen-200">
              <td className="py-1.5 text-warm-800">{it.product_name}</td>
              <td className="py-1.5 text-warm-800">{it.quantity}</td>
              <td className="py-1.5 text-right text-warm-800">{formatSEK(it.unit_price)}</td>
              <td className="py-1.5 text-right text-warm-800">{formatSEK(itemTotal(it))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex mb-6">
        <div className="flex-1" />
        <div className="text-right">
          <p className="text-xs font-semibold text-warm-900">
            <span className="mr-6">Summa:</span>
            {formatSEK(total)}
          </p>
          {vatLine && (
            <p className="text-xs text-warm-600 mt-0.5">{vatLine}</p>
          )}
        </div>
      </div>

      <p className="text-sm font-semibold mb-8" style={{ color: '#b5922a' }}>
        Tack för ditt köp!
      </p>

      <div className="text-xs space-y-0.5" style={{ color: '#b5922a' }}>
        <p>E-post: {COMPANY.email}</p>
        <p>Telefon: {COMPANY.phone}</p>
        <p>Swish: {COMPANY.swish}</p>
        <p>Bankgiro: {COMPANY.bankgiro}</p>
        <p>Organisationsnummer: {COMPANY.orgnr}</p>
        <p>Momsregistrering: {COMPANY.momsreg}</p>
        <p className="mt-1 text-warm-600">{COMPANY.returnPolicy}</p>
      </div>
    </div>
  )
}

export default function BulkPrintPage() {
  const searchParams = useSearchParams()
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = (searchParams.get('ids') ?? '').split(',').filter(Boolean)
    if (ids.length === 0) {
      setLoading(false)
      return
    }
    async function load() {
      const { data } = await supabase
        .from('receipts')
        .select('*, items:receipt_items(*)')
        .in('id', ids)
        .order('receipt_number', { ascending: true })
      setReceipts(data ?? [])
      setLoading(false)
    }
    load()
  }, [searchParams])

  useEffect(() => {
    if (!loading && receipts.length > 0) {
      const t = setTimeout(() => window.print(), 400)
      return () => clearTimeout(t)
    }
  }, [loading, receipts])

  return (
    <>
      <div className="no-print flex items-center gap-3 px-6 py-4 border-b border-linen-200 bg-white">
        <span className="text-sm text-warm-700 font-medium">
          {loading ? 'Laddar...' : `${receipts.length} kvitto${receipts.length !== 1 ? 'n' : ''}`}
        </span>
        <span className="flex-1" />
        <button
          onClick={() => window.print()}
          disabled={loading || receipts.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-sage-600 text-white text-sm font-medium rounded-lg hover:bg-sage-700 transition-colors disabled:opacity-50"
        >
          <Printer className="w-4 h-4" />
          Skriv ut
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-warm-400 text-sm">Laddar kvitton...</div>
      ) : receipts.length === 0 ? (
        <div className="p-8 text-center text-warm-400 text-sm">Inga kvitton valda.</div>
      ) : (
        receipts.map((r, i) => (
          <div
            key={r.id}
            style={i < receipts.length - 1 ? { breakAfter: 'page', pageBreakAfter: 'always' } : undefined}
          >
            <ReceiptBlock receipt={r} />
          </div>
        ))
      )}
    </>
  )
}
