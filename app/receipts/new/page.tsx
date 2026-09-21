'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { InventoryItem, ReceiptProduct } from '@/lib/types'
import { Plus, Trash2, ArrowLeft, Search } from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

type LineItem = {
  key: number
  productName: string
  inventoryId: string | null
  quantity: string
  unitPrice: string
  vatRate: string
}

type Suggestion =
  | { type: 'inventory'; item: Pick<InventoryItem, 'id' | 'product_name' | 'colorway' | 'retail_price'> }
  | { type: 'product'; item: ReceiptProduct }

let _key = 0
function newItem(): LineItem {
  return { key: ++_key, productName: '', inventoryId: null, quantity: '1', unitPrice: '', vatRate: '25' }
}

// ── Autocomplete row ─────────────────────────────────────────────────────────

function ProductSearchCell({
  value,
  onChange,
  onSelect,
}: {
  value: string
  onChange: (v: string) => void
  onSelect: (name: string, price: string, vat: string, invId: string | null) => void
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function search(q: string) {
    if (q.length < 2) { setSuggestions([]); setOpen(false); return }
    setLoading(true)

    const [{ data: invData }, { data: rpData }] = await Promise.all([
      supabase
        .from('inventory')
        .select('id, product_name, colorway, retail_price')
        .or(`product_name.ilike.%${q}%,colorway.ilike.%${q}%`)
        .not('retail_price', 'is', null)
        .order('product_name')
        .limit(8),
      supabase
        .from('receipt_products')
        .select('*')
        .ilike('name', `%${q}%`)
        .eq('active', true)
        .order('sort_order')
        .limit(5),
    ])

    const invSuggestions: Suggestion[] = (invData ?? []).map(item => ({
      type: 'inventory',
      item: item as Pick<InventoryItem, 'id' | 'product_name' | 'colorway' | 'retail_price'>,
    }))
    const rpSuggestions: Suggestion[] = (rpData ?? [])
      .filter(rp => !invSuggestions.some(s => s.type === 'inventory' && s.item.product_name === rp.name))
      .map(item => ({ type: 'product', item: item as ReceiptProduct }))

    setSuggestions([...invSuggestions, ...rpSuggestions])
    setOpen(true)
    setLoading(false)
  }

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(value), 200)
  }, [value])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function selectSuggestion(s: Suggestion) {
    if (s.type === 'inventory') {
      const { item } = s
      const fullName = item.colorway
        ? `${item.product_name} ${item.colorway}`
        : item.product_name
      onSelect(fullName, String(item.retail_price ?? ''), '25', item.id)
    } else {
      onSelect(s.item.name, String(s.item.default_price), String(s.item.vat_rate), null)
    }
    setOpen(false)
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-300 pointer-events-none" />
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
          placeholder="Sök eller skriv produktnamn…"
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300"
        />
        {loading && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 border border-sage-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-linen-200 rounded-lg shadow-lg overflow-hidden max-h-56 overflow-y-auto">
          {suggestions.map((s, i) => {
            if (s.type === 'inventory') {
              const { item } = s
              const displayColor = item.colorway ?? ''
              return (
                <button
                  key={`inv-${item.id}`}
                  type="button"
                  onMouseDown={() => selectSuggestion(s)}
                  className="w-full text-left px-3 py-2 hover:bg-sage-50 flex items-center justify-between gap-2 border-b border-linen-50 last:border-0"
                >
                  <span className="text-sm text-warm-900 truncate">
                    <span className="font-medium">{item.product_name}</span>
                    {displayColor && <span className="text-warm-500 ml-1">{displayColor}</span>}
                  </span>
                  <span className="text-xs text-sage-700 font-medium whitespace-nowrap">
                    {item.retail_price} kr
                  </span>
                </button>
              )
            } else {
              const { item } = s
              return (
                <button
                  key={`rp-${item.id}`}
                  type="button"
                  onMouseDown={() => selectSuggestion(s)}
                  className="w-full text-left px-3 py-2 hover:bg-sage-50 flex items-center justify-between gap-2 border-b border-linen-50 last:border-0 bg-cream-50"
                >
                  <span className="text-sm text-warm-700 truncate">{item.name}</span>
                  {item.default_price > 0 && (
                    <span className="text-xs text-warm-500 whitespace-nowrap">{item.default_price} kr</span>
                  )}
                </button>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function NewReceiptPage() {
  const router = useRouter()
  const [receiptNumber, setReceiptNumber] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('swish')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<LineItem[]>([newItem()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.rpc('next_receipt_number').then(({ data }) => {
      setReceiptNumber(data ?? 'V0001')
    })
  }, [])

  function setItem(key: number, patch: Partial<LineItem>) {
    setItems(prev => prev.map(it => it.key === key ? { ...it, ...patch } : it))
  }

  function onSuggestionSelected(
    key: number,
    name: string,
    price: string,
    vat: string,
    invId: string | null,
  ) {
    setItem(key, { productName: name, unitPrice: price, vatRate: vat, inventoryId: invId })
  }

  function rowTotal(it: LineItem) {
    return (parseFloat(it.quantity) || 0) * (parseFloat(it.unitPrice) || 0)
  }

  function grandTotal() {
    return items.reduce((s, it) => s + rowTotal(it), 0)
  }

  function vatSummary() {
    const map: Record<number, number> = {}
    for (const it of items) {
      const rate = parseFloat(it.vatRate) || 0
      const total = rowTotal(it)
      const vat = total * rate / (100 + rate)
      map[rate] = (map[rate] ?? 0) + vat
    }
    return Object.entries(map)
      .filter(([, v]) => v > 0)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([rate, amount]) => ({ rate: Number(rate), amount }))
  }

  function formatSEK(n: number) {
    return `${Math.round(n).toLocaleString('sv-SE')}:-`
  }

  async function handleSave() {
    const valid = items.filter(it => it.productName.trim() && parseFloat(it.unitPrice) > 0)
    if (valid.length === 0) {
      setError('Lägg till minst en produkt med pris.')
      return
    }
    setSaving(true)
    setError('')

    const { data: receipt, error: receiptErr } = await supabase
      .from('receipts')
      .insert({
        receipt_number: receiptNumber,
        receipt_date: date,
        customer_name: customerName.trim() || null,
        payment_method: paymentMethod,
        notes: notes.trim() || null,
      })
      .select()
      .single()

    if (receiptErr || !receipt) {
      setError(receiptErr?.message ?? 'Kunde inte spara kvittot.')
      setSaving(false)
      return
    }

    const { error: itemsErr } = await supabase.from('receipt_items').insert(
      valid.map((it, i) => ({
        receipt_id: receipt.id,
        product_name: it.productName.trim(),
        receipt_product_id: null,
        quantity: parseInt(it.quantity) || 1,
        unit_price: parseFloat(it.unitPrice) || 0,
        vat_rate: parseFloat(it.vatRate) || 25,
        sort_order: i,
      }))
    )

    if (itemsErr) {
      setError(itemsErr.message)
      setSaving(false)
      return
    }

    router.push(`/receipts/${receipt.id}`)
  }

  const total = grandTotal()
  const vats = vatSummary()

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/receipts" className="p-1.5 rounded-lg text-warm-400 hover:bg-cream-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Nytt kvitto</h1>
        </div>
      </div>

      <div className="space-y-5">
        {/* Header fields */}
        <div className="bg-white rounded-xl border border-linen-200 p-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-warm-500 mb-1">Kvittonummer</label>
              <input
                value={receiptNumber}
                onChange={e => setReceiptNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300"
              />
            </div>
            <div>
              <label className="block text-xs text-warm-500 mb-1">Datum</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300"
              />
            </div>
            <div>
              <label className="block text-xs text-warm-500 mb-1">Betalsätt</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300"
              >
                <option value="swish">Swish</option>
                <option value="kontant">Kontant</option>
                <option value="kort">Kort</option>
                <option value="faktura">Faktura</option>
              </select>
            </div>
            <div className="col-span-3">
              <label className="block text-xs text-warm-500 mb-1">Kund (frivilligt)</label>
              <input
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="t.ex. Tove Bredberg"
                className="w-full px-3 py-2 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300"
              />
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="bg-white rounded-xl border border-linen-200 overflow-visible">
          <div className="px-5 py-3 border-b border-linen-100">
            <h2 className="text-sm font-semibold text-warm-700">Produkter</h2>
            <p className="text-xs text-warm-400 mt-0.5">Sök på namn eller färg — pris fylls i automatiskt</p>
          </div>

          <div className="p-4 space-y-3">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_60px_90px_90px_32px] gap-2 px-1">
              <span className="text-xs text-warm-400">Produkt</span>
              <span className="text-xs text-warm-400 text-center">Antal</span>
              <span className="text-xs text-warm-400 text-right">à Pris</span>
              <span className="text-xs text-warm-400 text-right">Totalt</span>
              <span />
            </div>

            {items.map(it => (
              <div key={it.key} className="grid grid-cols-[1fr_60px_90px_90px_32px] gap-2 items-start">
                {/* Search / product name */}
                <div className="space-y-1">
                  <ProductSearchCell
                    value={it.productName}
                    onChange={v => setItem(it.key, { productName: v, inventoryId: null })}
                    onSelect={(name, price, vat, invId) =>
                      onSuggestionSelected(it.key, name, price, vat, invId)
                    }
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-warm-400">Moms:</span>
                    <select
                      value={it.vatRate}
                      onChange={e => setItem(it.key, { vatRate: e.target.value })}
                      className="text-xs px-1.5 py-0.5 border border-linen-200 rounded focus:outline-none"
                    >
                      <option value="25">25%</option>
                      <option value="12">12%</option>
                      <option value="6">6%</option>
                      <option value="0">0%</option>
                    </select>
                  </div>
                </div>

                {/* Quantity */}
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={it.quantity}
                  onChange={e => setItem(it.key, { quantity: e.target.value })}
                  className="px-2 py-1.5 text-sm text-center border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300 w-full"
                />

                {/* Unit price */}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={it.unitPrice}
                  onChange={e => setItem(it.key, { unitPrice: e.target.value })}
                  placeholder="0"
                  className="px-2 py-1.5 text-sm text-right border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300 w-full"
                />

                {/* Row total */}
                <div className="py-1.5 text-sm text-right text-warm-700 font-medium">
                  {rowTotal(it) > 0 ? formatSEK(rowTotal(it)) : '—'}
                </div>

                {/* Remove */}
                <button
                  onClick={() => setItems(prev => prev.filter(x => x.key !== it.key))}
                  disabled={items.length === 1}
                  className="mt-1.5 p-1 text-warm-300 hover:text-red-500 disabled:opacity-20 transition-colors rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              onClick={() => setItems(prev => [...prev, newItem()])}
              className="flex items-center gap-1.5 text-sm text-sage-600 hover:text-sage-800 mt-1 px-1"
            >
              <Plus className="w-4 h-4" />
              Lägg till rad
            </button>
          </div>

          {/* Summary */}
          {total > 0 && (
            <div className="border-t border-linen-100 px-5 py-4 space-y-1">
              {vats.map(v => (
                <div key={v.rate} className="flex justify-between text-sm text-warm-500">
                  <span>Varav moms {v.rate}%</span>
                  <span>{formatSEK(v.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-base font-semibold text-warm-900 pt-1 border-t border-linen-100">
                <span>Summa</span>
                <span>{formatSEK(total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-linen-200 p-5">
          <label className="block text-xs text-warm-500 mb-1">Anteckning (syns ej på kvittot)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300 resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
        )}

        <div className="flex gap-3">
          <Link
            href="/receipts"
            className="px-5 py-2.5 text-sm text-warm-600 border border-linen-200 rounded-lg hover:bg-cream-200 transition-colors"
          >
            Avbryt
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-5 py-2.5 text-sm font-medium bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Sparar...' : 'Spara och visa kvitto'}
          </button>
        </div>
      </div>
    </div>
  )
}
