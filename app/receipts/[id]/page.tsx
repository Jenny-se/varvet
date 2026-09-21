'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { Receipt, ReceiptItem } from '@/lib/types'
import { ArrowLeft, Printer } from 'lucide-react'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'

const PAYMENT_LABELS: Record<string, string> = {
  swish: 'swish',
  kontant: 'kontant',
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

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('receipts')
        .select('*, items:receipt_items(*)')
        .eq('id', id)
        .single()
      if (data) {
        data.items = [...(data.items ?? [])].sort((a, b) => a.sort_order - b.sort_order)
      }
      setReceipt(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="p-8 text-center text-warm-400 text-sm">Laddar...</div>
  if (!receipt) return <div className="p-8 text-center text-warm-400 text-sm">Kvittot hittades inte.</div>

  const items = receipt.items ?? []
  const total = items.reduce((s, it) => s + itemTotal(it), 0)
  const vats = vatSummary(items)
  const vatLine = vats.length === 1
    ? `(varav moms ${Math.round(vats[0].amount).toLocaleString('sv-SE')}:-)`
    : vats.map(v => `(varav moms ${v.rate}%: ${Math.round(v.amount).toLocaleString('sv-SE')}:-)`).join(' / ')

  return (
    <>
      {/* Toolbar — hidden when printing */}
      <div className="no-print flex items-center gap-3 px-6 py-4 border-b border-linen-200 bg-white">
        <Link href="/receipts" className="p-1.5 rounded-lg text-warm-400 hover:bg-cream-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="font-mono text-sm text-warm-700 font-semibold">{receipt.receipt_number}</span>
        <span className="flex-1" />
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-sage-600 text-white text-sm font-medium rounded-lg hover:bg-sage-700 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Skriv ut
        </button>
      </div>

      {/* Receipt content */}
      <div id="receipt-print" className="receipt-page p-10 max-w-[680px] mx-auto bg-white">

        {/* Logo */}
        <div className="mb-10">
          <Image
            src="/varvet_logo.JPG"
            alt="Varvet Garn"
            width={96}
            height={96}
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-base font-bold text-warm-900 mb-4 tracking-wide">KVITTO</h1>

        {/* Meta */}
        <div className="space-y-0.5 mb-6 text-sm text-warm-800">
          <p>Kvittonummer: {receipt.receipt_number}</p>
          <p>Datum: {format(new Date(receipt.receipt_date), 'yyyy-MM-dd')}</p>
        </div>

        {receipt.customer_name && (
          <p className="text-sm text-warm-800 mb-2">Kund: {receipt.customer_name}</p>
        )}

        <p className="text-sm text-warm-800 mb-8">
          Betalt: {PAYMENT_LABELS[receipt.payment_method] ?? receipt.payment_method}
        </p>

        {/* Product table */}
        <table className="w-full text-sm mb-8">
          <thead>
            <tr className="border-b-2 border-warm-800">
              <th className="text-left py-2 font-semibold text-warm-800">Produkt</th>
              <th className="text-left py-2 font-semibold text-warm-800 w-16">Antal</th>
              <th className="text-right py-2 font-semibold text-warm-800 w-24">à Pris</th>
              <th className="text-right py-2 font-semibold text-warm-800 w-24">Totalt</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="border-b border-linen-200">
                <td className="py-2 text-warm-800">{it.product_name}</td>
                <td className="py-2 text-warm-800">{it.quantity}</td>
                <td className="py-2 text-right text-warm-800">{formatSEK(it.unit_price)}</td>
                <td className="py-2 text-right text-warm-800">{formatSEK(itemTotal(it))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex mb-10">
          <div className="flex-1" />
          <div className="text-right">
            <p className="text-sm font-semibold text-warm-900">
              <span className="mr-8">Summa:</span>
              {formatSEK(total)}
            </p>
            {vatLine && (
              <p className="text-sm text-warm-600 mt-0.5">{vatLine}</p>
            )}
          </div>
        </div>

        {/* Thank you */}
        <p className="text-base font-semibold mb-16" style={{ color: '#b5922a' }}>
          Tack för ditt köp!
        </p>

        {/* Footer */}
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
    </>
  )
}
