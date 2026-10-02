'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { InventoryItem, ReceiptProduct } from '@/lib/types'
import { Plus, Trash2, ArrowLeft, Search, Minus, X } from 'lucide-react'

// ── Color name → hex ─────────────────────────────────────────────────────────

function colorNameToHex(name: string): string {
  const n = name.toLowerCase().trim()

  // Xolla Peülla / Bauma specific (Valencian / Catalan names)
  const xolla: Record<string, string> = {
    // ── Peülla ──
    orxata: '#F0DBA8', colom: '#AEAAA8', caramel: '#C07830',
    'sèsam': '#C8B890', sesam: '#C8B890', carbassa: '#E05C18',
    coure: '#A86830', gallaret: '#887058', 'gavarrò': '#987858',
    gavarro: '#987858', most: '#781858', dalia: '#C84870',
    valeriana: '#9070A0', 'marcòlic': '#786860', marcolic: '#786860',
    caputxina: '#D03018', breva: '#501028', genciana: '#184870',
    brisa: '#70A0C8', maror: '#207888', 'drôme': '#B09068',
    drome: '#B09068', abissal: '#101820', festuc: '#889050',
    molsa: '#507848',
    // ── Bauma ──
    fum: '#909090',         // smoke
    civada: '#D4C8A0',      // oat
    'còdol': '#B8AFA0', codol: '#B8AFA0', // pebble
    sorra: '#C8B888',       // sand
    pardal: '#907870',      // sparrow (brownish grey)
    castanya: '#8B4828',    // chestnut
    mel: '#D4A830',         // honey
    tahina: '#C8A878',      // tahini
    'pol·len': '#D8C040', pollen: '#D8C040', // pollen
    boixac: '#506840',      // boxwood
    aram: '#C07840',        // copper
    'grèvol': '#2D5030', grevol: '#2D5030', // holly
    cirera: '#A82030',      // cherry
    rumex: '#884028',       // sorrel
    matafoc: '#C04020',     // fire extinguisher (deep red-orange)
    gerd: '#C03060',        // raspberry
    nigritella: '#501840',  // dark orchid (near-black purple)
    garnatxa: '#701838',    // grenache grape (deep wine)
    malva: '#C090C0',       // mallow / mauve
    bruc: '#A06080',        // heather
    'orquidea': '#B06090', orquídea: '#B06090', // orchid
    lavanda: '#9878B8',     // lavender
    figa: '#5C2848',        // fig (dark purple-brown)
    nit: '#101828',         // night
    'oceà': '#1C6880', ocea: '#1C6880', // ocean
    marina: '#2860A0',      // sea / marina
    gaig: '#5878A8',        // jay bird (blue-grey)
    tramuntana: '#80B0D0',  // north wind (light sky blue)
    xarxet: '#208070',      // teal (the bird)
    avet: '#2A5035',        // fir tree
    alzina: '#4A6040',      // holm oak
    falguera: '#608050',    // fern
    oli: '#788050',         // olive oil
    corb: '#182028',        // crow / raven (near-black)
    burella: '#6878A0',     // blue-grey (heraldic)
  }
  for (const [k, v] of Object.entries(xolla)) {
    if (n.includes(k)) return v
  }

  // General keywords (Swedish / English / common yarn names)
  const kw: Array<[string[], string]> = [
    [['svart', 'black', 'noir', 'negro', 'kol', 'coal'], '#282828'],
    [['vit', 'white', 'blanc', 'blanco', 'ecru', 'elfenben', 'ivory', 'cream', 'kräm', 'natur'], '#F0EAD8'],
    [['ljusgrå', 'hellgrau', 'light grey', 'light gray', 'silvergrå', 'silver'], '#C8C4C0'],
    [['grå', 'gray', 'grey', 'gris', 'aska', 'ash', 'stone'], '#989490'],
    [['mörkgrå', 'charcoal', 'kol'], '#484440'],
    [['brun', 'brown', 'marron', 'choklad', 'chocolate', 'kaffe', 'coffee', 'mocka', 'mocha', 'kastanj', 'chestnut'], '#8B5830'],
    [['beige', 'sand', 'lin', 'linen', 'taupe', 'fawn'], '#C8B890'],
    [['röd', 'red', 'rouge', 'rojo', 'crimson', 'scarlet', 'cherry', 'körsbär'], '#C82828'],
    [['rost', 'rust', 'terracotta', 'burnt', 'bränd'], '#C05030'],
    [['rosa', 'pink', 'rose', 'blush', 'flamingo', 'dusty rose'], '#E090A0'],
    [['cerise', 'fuchsia', 'magenta', 'hot pink'], '#D03878'],
    [['orange', 'apelsin', 'mango', 'lax', 'salmon', 'persika', 'peach'], '#E07040'],
    [['gul', 'yellow', 'jaune', 'amarillo', 'citron', 'lemon', 'buttercup', 'mustard', 'senap'], '#D4A030'],
    [['guld', 'gold', 'golden'], '#C89030'],
    [['lime', 'chartreuse', 'äpple', 'apple green'], '#80A030'],
    [['grön', 'green', 'verde', 'vert', 'sage', 'salvia', 'mint', 'bottle', 'hunter', 'forest', 'eucalyptus'], '#508050'],
    [['moss', 'mossa', 'olive', 'oliv', 'khaki', 'army', 'militär'], '#687840'],
    [['turkos', 'turquoise', 'teal', 'petrol', 'ocean', 'hav'], '#308090'],
    [['ljusblå', 'light blue', 'sky', 'himmel', 'baby blue', 'powder blue', 'ice'], '#80A8D0'],
    [['blå', 'blue', 'bleu', 'azul', 'cornflower', 'cornblomma'], '#3868B0'],
    [['marin', 'navy', 'midnight', 'nattblå', 'indigo', 'denim', 'cobalt', 'cobolt'], '#183068'],
    [['lila', 'lilac', 'lavender', 'lavendel', 'malva', 'mauve'], '#9878B8'],
    [['lila', 'purple', 'violet', 'violett', 'plommon', 'plum', 'aubergine', 'eggplant'], '#703898'],
    [['burgund', 'burgundy', 'bordeaux', 'wine', 'vin', 'merlot', 'claret'], '#701838'],
  ]
  for (const [words, hex] of kw) {
    if (words.some(w => n.includes(w))) return hex
  }

  // Deterministic fallback hue from name
  let h = 0
  for (const c of n) h = c.charCodeAt(0) + ((h << 5) - h)
  return `hsl(${Math.abs(h) % 360}, 42%, 52%)`
}

function textColorForBg(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#2A2420' : '#F8F4EE'
}

// ── Types ─────────────────────────────────────────────────────────────────────

type LineItem = {
  key: number
  productName: string
  inventoryId: string | null
  quantity: number
  unitPrice: string
  vatRate: string
  isManual: boolean
}

type Colorway = { id: string; colorway: string; price: number }

type ColorPicker = { product: ReceiptProduct; colorways: Colorway[] }

type Suggestion =
  | { type: 'inventory'; item: Pick<InventoryItem, 'id' | 'product_name' | 'colorway' | 'retail_price'> }
  | { type: 'product'; item: ReceiptProduct }

let _key = 0
function newManualItem(): LineItem {
  return { key: ++_key, productName: '', inventoryId: null, quantity: 1, unitPrice: '', vatRate: '25', isManual: true }
}

// ── Manual search row ─────────────────────────────────────────────────────────

function ManualSearchRow({ value, onChange, onSelect }: {
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
      supabase.from('inventory').select('id, product_name, colorway, retail_price')
        .or(`product_name.ilike.%${q}%,colorway.ilike.%${q}%`)
        .eq('active', true).not('retail_price', 'is', null).order('product_name').limit(8),
      supabase.from('receipt_products').select('*').ilike('name', `%${q}%`)
        .eq('active', true).order('sort_order').limit(5),
    ])
    const invS: Suggestion[] = (invData ?? []).map(item => ({
      type: 'inventory',
      item: item as Pick<InventoryItem, 'id' | 'product_name' | 'colorway' | 'retail_price'>,
    }))
    const rpS: Suggestion[] = (rpData ?? [])
      .filter(rp => !invS.some(s => s.type === 'inventory' && s.item.product_name === rp.name))
      .map(item => ({ type: 'product', item: item as ReceiptProduct }))
    setSuggestions([...invS, ...rpS])
    setOpen(true)
    setLoading(false)
  }

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(value), 200)
  }, [value])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function selectSuggestion(s: Suggestion) {
    if (s.type === 'inventory') {
      const { item } = s
      onSelect(item.colorway ? `${item.product_name} ${item.colorway}` : item.product_name, String(item.retail_price ?? ''), '25', item.id)
    } else {
      onSelect(s.item.name, String(s.item.default_price), String(s.item.vat_rate), null)
    }
    setOpen(false)
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-300 pointer-events-none" />
        <input value={value} onChange={e => onChange(e.target.value)} onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
          placeholder="Sök eller skriv produktnamn…"
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300" />
        {loading && <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 border border-sage-400 border-t-transparent rounded-full animate-spin" />}
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-linen-200 rounded-lg shadow-lg overflow-hidden max-h-56 overflow-y-auto">
          {suggestions.map(s => s.type === 'inventory' ? (
            <button key={`inv-${s.item.id}`} type="button" onMouseDown={() => selectSuggestion(s)}
              className="w-full text-left px-3 py-2 hover:bg-sage-50 flex items-center justify-between gap-2 border-b border-linen-50 last:border-0">
              <span className="text-sm text-warm-900 truncate">
                <span className="font-medium">{s.item.product_name}</span>
                {s.item.colorway && <span className="text-warm-500 ml-1">{s.item.colorway}</span>}
              </span>
              <span className="text-xs text-sage-700 font-medium whitespace-nowrap">{s.item.retail_price} kr</span>
            </button>
          ) : (
            <button key={`rp-${s.item.id}`} type="button" onMouseDown={() => selectSuggestion(s)}
              className="w-full text-left px-3 py-2 hover:bg-sage-50 flex items-center justify-between gap-2 border-b border-linen-50 last:border-0 bg-cream-50">
              <span className="text-sm text-warm-700 truncate">{s.item.name}</span>
              {s.item.default_price > 0 && <span className="text-xs text-warm-500 whitespace-nowrap">{s.item.default_price} kr</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function NewReceiptPage() {
  const router = useRouter()
  const [receiptNumber, setReceiptNumber] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('swish')
  const [notes, setNotes] = useState('')
  const [paid, setPaid] = useState(true)
  const [sendEmail, setSendEmail] = useState(false)
  const [emailTo, setEmailTo] = useState('')
  const [items, setItems] = useState<LineItem[]>([])
  const [quickProducts, setQuickProducts] = useState<ReceiptProduct[]>([])
  const [colorPicker, setColorPicker] = useState<ColorPicker | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.rpc('next_receipt_number').then(({ data }) => setReceiptNumber(data ?? 'V0001'))
    supabase.from('receipt_products').select('*').eq('active', true)
      .order('sort_order').order('name')
      .then(({ data }) => setQuickProducts(data ?? []))
  }, [])

  async function handleProductButtonClick(p: ReceiptProduct) {
    // Check if this product has colorways in inventory
    const { data } = await supabase
      .from('inventory')
      .select('id, colorway, retail_price')
      .ilike('product_name', `%${p.name}%`)
      .eq('active', true)
      .not('colorway', 'is', null)
      .not('retail_price', 'is', null)
      .order('colorway')

    const colorways: Colorway[] = (data ?? [])
      .filter(d => d.colorway)
      .map(d => ({ id: d.id, colorway: d.colorway!, price: d.retail_price! }))

    if (colorways.length > 0) {
      setColorPicker({ product: p, colorways })
    } else {
      addDirectly(p.name, String(p.default_price), String(p.vat_rate), null)
    }
  }

  function addDirectly(name: string, price: string, vatRate: string, invId: string | null) {
    setColorPicker(null)
    setItems(prev => {
      const existing = prev.find(it => !it.isManual && it.productName === name)
      if (existing) {
        return prev.map(it => it.key === existing.key ? { ...it, quantity: it.quantity + 1 } : it)
      }
      return [...prev, { key: ++_key, productName: name, inventoryId: invId, quantity: 1, unitPrice: price, vatRate, isManual: false }]
    })
  }

  function handleColorSelect(cw: Colorway) {
    if (!colorPicker) return
    const fullName = `${colorPicker.product.name} ${cw.colorway}`
    addDirectly(fullName, String(cw.price), String(colorPicker.product.vat_rate), cw.id)
  }

  function setItem(key: number, patch: Partial<LineItem>) {
    setItems(prev => prev.map(it => it.key === key ? { ...it, ...patch } : it))
  }

  function rowTotal(it: LineItem) { return it.quantity * (parseFloat(it.unitPrice) || 0) }
  function grandTotal() { return items.reduce((s, it) => s + rowTotal(it), 0) }

  function vatSummary() {
    const map: Record<number, number> = {}
    for (const it of items) {
      const rate = parseFloat(it.vatRate) || 0
      const vat = rowTotal(it) * rate / (100 + rate)
      map[rate] = (map[rate] ?? 0) + vat
    }
    return Object.entries(map).filter(([, v]) => v > 0)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([rate, amount]) => ({ rate: Number(rate), amount }))
  }

  function formatSEK(n: number) { return `${Math.round(n).toLocaleString('sv-SE')}:-` }

  async function handleSave() {
    const valid = items.filter(it => it.productName.trim() && parseFloat(it.unitPrice) > 0)
    if (valid.length === 0) { setError('Lägg till minst en produkt med pris.'); return }
    setSaving(true); setError('')

    const { data: receipt, error: receiptErr } = await supabase.from('receipts').insert({
      receipt_number: receiptNumber,
      receipt_date: date,
      customer_name: customerName.trim() || null,
      payment_method: paymentMethod,
      paid,
      notes: notes.trim() || null,
      email_to: sendEmail && emailTo.trim() ? emailTo.trim() : null,
    }).select().single()

    if (receiptErr || !receipt) { setError(receiptErr?.message ?? 'Kunde inte spara kvittot.'); setSaving(false); return }

    const { error: itemsErr } = await supabase.from('receipt_items').insert(
      valid.map((it, i) => ({
        receipt_id: receipt.id,
        product_name: it.productName.trim(),
        receipt_product_id: null,
        inventory_id: it.inventoryId ?? null,
        quantity: it.quantity,
        unit_price: parseFloat(it.unitPrice) || 0,
        vat_rate: parseFloat(it.vatRate) || 25,
        sort_order: i,
      }))
    )

    if (itemsErr) { setError(itemsErr.message); setSaving(false); return }

    // Deduct inventory stock for linked items
    const withInventory = valid.filter(it => it.inventoryId)
    await Promise.all(
      withInventory.map(it =>
        supabase.rpc('decrement_inventory_stock', { p_id: it.inventoryId!, p_quantity: it.quantity })
      )
    )

    router.push(`/receipts/${receipt.id}`)
  }

  const total = grandTotal()
  const vats = vatSummary()

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/receipts" className="p-1.5 rounded-lg text-warm-400 hover:bg-cream-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-semibold text-warm-900">Nytt kvitto</h1>
      </div>

      <div className="space-y-4">
        {/* Header fields */}
        <div className="bg-white rounded-xl border border-linen-200 p-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-warm-500 mb-1">Kvittonummer</label>
              <input value={receiptNumber} onChange={e => setReceiptNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300" />
            </div>
            <div>
              <label className="block text-xs text-warm-500 mb-1">Datum</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300" />
            </div>
            <div>
              <label className="block text-xs text-warm-500 mb-1">Betalsätt</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300">
                <option value="swish">Swish</option>
                <option value="bg">BG</option>
                <option value="kort">Kort</option>
                <option value="faktura">Faktura</option>
              </select>
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <input type="checkbox" id="paid" checked={paid} onChange={e => setPaid(e.target.checked)}
                className="w-4 h-4 accent-sage-600" />
              <label htmlFor="paid" className="text-sm text-warm-700 cursor-pointer">Betalt</label>
            </div>
            <div className="col-span-3">
              <label className="block text-xs text-warm-500 mb-1">Kund (frivilligt)</label>
              <input value={customerName} onChange={e => setCustomerName(e.target.value)}
                placeholder="Kundnamn"
                className="w-full px-3 py-2 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300" />
            </div>
          </div>
        </div>

        {/* Quick-add product buttons */}
        {quickProducts.length > 0 && (
          <div className="bg-white rounded-xl border border-linen-200 p-4">
            <p className="text-xs font-medium text-warm-500 mb-3">Lägg till produkt</p>
            <div className="flex flex-wrap gap-2">
              {quickProducts.map(p => (
                <button key={p.id} type="button" onClick={() => handleProductButtonClick(p)}
                  className={`flex flex-col items-start px-4 py-2.5 border rounded-xl transition-all text-left active:scale-95 ${
                    colorPicker?.product.id === p.id
                      ? 'bg-sage-100 border-sage-400 ring-2 ring-sage-300'
                      : 'bg-cream-100 hover:bg-sage-50 border-linen-200 hover:border-sage-300'
                  }`}>
                  <span className="text-sm font-medium text-warm-900 leading-tight">{p.name}</span>
                  {p.default_price > 0 && (
                    <span className="text-xs text-warm-500 mt-0.5">{p.default_price} kr</span>
                  )}
                </button>
              ))}
            </div>

            {/* Color picker panel */}
            {colorPicker && (
              <div className="mt-4 pt-4 border-t border-linen-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-warm-700">
                    Välj färg — {colorPicker.product.name}
                  </p>
                  <button onClick={() => setColorPicker(null)}
                    className="p-1 text-warm-400 hover:text-warm-700 rounded transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colorPicker.colorways.map(cw => {
                    const bg = colorNameToHex(cw.colorway)
                    const fg = textColorForBg(bg)
                    return (
                      <button key={cw.id} type="button" onClick={() => handleColorSelect(cw)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-linen-200 hover:border-warm-400 bg-white hover:bg-cream-50 active:scale-95 transition-all">
                        <span
                          className="w-5 h-5 rounded-full flex-shrink-0 ring-1 ring-black/10"
                          style={{ backgroundColor: bg }}
                        />
                        <span className="text-sm text-warm-800 leading-tight">{cw.colorway}</span>
                        <span className="text-xs text-warm-400 ml-1">{cw.price} kr</span>
                      </button>
                    )
                  })}
                  {/* Add without colorway */}
                  <button type="button"
                    onClick={() => addDirectly(colorPicker.product.name, String(colorPicker.product.default_price), String(colorPicker.product.vat_rate), null)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-linen-300 hover:border-warm-400 bg-white hover:bg-cream-50 active:scale-95 transition-all">
                    <span className="w-5 h-5 rounded-full flex-shrink-0 border border-linen-300 bg-linen-50" />
                    <span className="text-sm text-warm-500">Ingen färg</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Items list */}
        <div className="bg-white rounded-xl border border-linen-200 overflow-visible">
          <div className="px-4 py-3 border-b border-linen-100">
            <h2 className="text-sm font-semibold text-warm-700">Valda produkter</h2>
          </div>

          <div className="divide-y divide-linen-100">
            {items.length === 0 && (
              <p className="px-4 py-6 text-sm text-warm-400 text-center">
                Tryck på en produkt ovan för att lägga till
              </p>
            )}
            {items.map(it => (
              <div key={it.key} className="px-4 py-3">
                {it.isManual ? (
                  <div className="space-y-2">
                    <ManualSearchRow value={it.productName}
                      onChange={v => setItem(it.key, { productName: v, inventoryId: null })}
                      onSelect={(name, price, vat, invId) => setItem(it.key, { productName: name, unitPrice: price, vatRate: vat, inventoryId: invId })} />
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-warm-400">Moms:</span>
                        <select value={it.vatRate} onChange={e => setItem(it.key, { vatRate: e.target.value })}
                          className="text-xs px-1.5 py-0.5 border border-linen-200 rounded focus:outline-none">
                          <option value="25">25%</option>
                          <option value="12">12%</option>
                          <option value="6">6%</option>
                          <option value="0">0%</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setItem(it.key, { quantity: Math.max(1, it.quantity - 1) })}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-linen-200 text-warm-600 hover:bg-cream-200">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-sm font-medium">{it.quantity}</span>
                        <button onClick={() => setItem(it.key, { quantity: it.quantity + 1 })}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-linen-200 text-warm-600 hover:bg-cream-200">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <input type="number" min="0" step="0.01" value={it.unitPrice}
                        onChange={e => setItem(it.key, { unitPrice: e.target.value })} placeholder="Pris"
                        className="w-24 px-2 py-1.5 text-sm text-right border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300" />
                      <button onClick={() => setItems(prev => prev.filter(x => x.key !== it.key))}
                        className="p-1.5 text-warm-300 hover:text-red-500 transition-colors rounded ml-auto">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {/* Color dot if it looks like a colorway product */}
                        {it.productName.includes(' ') && (() => {
                          const parts = it.productName.split(' ')
                          const colorPart = parts.slice(1).join(' ')
                          const hex = colorNameToHex(colorPart)
                          return (
                            <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-1 ring-black/10"
                              style={{ backgroundColor: hex }} />
                          )
                        })()}
                        <p className="text-sm font-medium text-warm-900 truncate">{it.productName}</p>
                      </div>
                      <input type="number" min="0" step="0.01" value={it.unitPrice}
                        onChange={e => setItem(it.key, { unitPrice: e.target.value })}
                        className="mt-0.5 w-24 px-2 py-0.5 text-xs text-right border border-linen-200 rounded focus:outline-none focus:ring-1 focus:ring-sage-300" />
                      <span className="text-xs text-warm-400 ml-1">kr/st</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setItem(it.key, { quantity: Math.max(1, it.quantity - 1) })}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-linen-200 text-warm-600 hover:bg-cream-200 active:bg-cream-300 transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-warm-900">{it.quantity}</span>
                      <button onClick={() => setItem(it.key, { quantity: it.quantity + 1 })}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-linen-200 text-warm-600 hover:bg-cream-200 active:bg-cream-300 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="w-20 text-right text-sm font-medium text-warm-800">
                      {rowTotal(it) > 0 ? formatSEK(rowTotal(it)) : '—'}
                    </span>
                    <button onClick={() => setItems(prev => prev.filter(x => x.key !== it.key))}
                      className="p-1.5 text-warm-300 hover:text-red-500 transition-colors rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-linen-100">
            <button onClick={() => setItems(prev => [...prev, newManualItem()])}
              className="flex items-center gap-1.5 text-sm text-sage-600 hover:text-sage-800">
              <Plus className="w-4 h-4" />
              Lägg till annan artikel
            </button>
          </div>

          {total > 0 && (
            <div className="border-t border-linen-100 px-4 py-4 space-y-1">
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

        {/* Notes + email */}
        <div className="bg-white rounded-xl border border-linen-200 p-4 space-y-4">
          <div>
            <label className="block text-xs text-warm-500 mb-1">Anteckning (syns ej på kvittot)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300 resize-none" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="sendEmail" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)}
                className="w-4 h-4 accent-sage-600" />
              <label htmlFor="sendEmail" className="text-sm text-warm-700 cursor-pointer">Skicka e-post</label>
            </div>
            {sendEmail && (
              <input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)}
                placeholder="kund@exempel.se"
                className="w-full px-3 py-2 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300" />
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

        <div className="flex gap-3 pb-6">
          <Link href="/receipts"
            className="px-5 py-2.5 text-sm text-warm-600 border border-linen-200 rounded-lg hover:bg-cream-200 transition-colors">
            Avbryt
          </Link>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 px-5 py-2.5 text-sm font-medium bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:opacity-50 transition-colors">
            {saving ? 'Sparar...' : 'Spara och visa kvitto'}
          </button>
        </div>
      </div>
    </div>
  )
}
