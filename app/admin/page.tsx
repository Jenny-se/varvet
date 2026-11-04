'use client'

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { InventoryCategory, ReceiptProduct } from '@/lib/types'
import { Plus, Pencil, Trash2, Check, X, Search, GripVertical, Boxes, ChevronDown, ChevronRight } from 'lucide-react'

const EMPTY_FORM = { name: '', default_price: '', vat_rate: '25' }
const EMPTY_COLOR = { colorway: '', price: '', qty: '' }

// En färg/variant i lagret; product_id pekar på produkten i Admin (migration 024)
type InvRow = {
  id: string
  product_id: string | null
  product_name: string
  colorway: string | null
  quantity_in_stock: number
  retail_price: number | null
  category: InventoryCategory
}

// Lagerrader utan produkt, grupperade på namn
type Orphan = { name: string; rows: InvRow[]; stock: number; price: number | null }

export default function AdminPage() {
  const [products, setProducts] = useState<ReceiptProduct[]>([])
  const [invRows, setInvRows] = useState<InvRow[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [linkOnCreate, setLinkOnCreate] = useState<string | null>(null) // lagernamn som kopplas när produkten skapas
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [colorForm, setColorForm] = useState(EMPTY_COLOR)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showInactive, setShowInactive] = useState(true)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const dragId = useRef<string | null>(null)

  const visibleProducts = useMemo(() =>
    products.filter(p => {
      if (!showInactive && !p.active) return false
      if (search.trim()) return p.name.toLowerCase().includes(search.trim().toLowerCase())
      return true
    })
  , [products, search, showInactive])

  const rowsByProduct = useMemo(() => {
    const m = new Map<string, InvRow[]>()
    invRows.forEach(r => { if (r.product_id) m.set(r.product_id, [...(m.get(r.product_id) ?? []), r]) })
    m.forEach(rows => rows.sort((a, b) => (a.colorway ?? '').localeCompare(b.colorway ?? '', 'sv')))
    return m
  }, [invRows])

  const orphans = useMemo<Orphan[]>(() => {
    const m = new Map<string, InvRow[]>()
    invRows.forEach(r => { if (!r.product_id) m.set(r.product_name, [...(m.get(r.product_name) ?? []), r]) })
    return Array.from(m.entries())
      .map(([name, rows]) => ({
        name, rows,
        stock: rows.reduce((s, r) => s + r.quantity_in_stock, 0),
        price: rows.find(r => r.retail_price != null)?.retail_price ?? null,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'sv'))
  }, [invRows])

  async function load() {
    const [{ data }, { data: inv, error: invError }] = await Promise.all([
      supabase.from('receipt_products').select('*')
        .order('sort_order', { ascending: true }).order('name', { ascending: true }),
      supabase.from('inventory')
        .select('id, product_id, product_name, colorway, quantity_in_stock, retail_price, category')
        .eq('active', true),
    ])
    setProducts(data ?? [])
    setInvRows(inv ?? [])
    if (invError?.message.includes('product_id')) {
      setError('Kopplingen mellan produkter och lager kräver migration 024 – kör den i Supabase SQL Editor.')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function fail(e: { message: string } | null) {
    if (!e) return false
    setError(`Kunde inte spara: ${e.message}`)
    return true
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    setError('')
    const maxOrder = products.length > 0 ? Math.max(...products.map(p => p.sort_order)) + 1 : 0
    const { data: created, error } = await supabase.from('receipt_products').insert({
      name: form.name.trim(),
      default_price: form.default_price ? parseFloat(form.default_price) : 0,
      vat_rate: parseFloat(form.vat_rate),
      sort_order: maxOrder,
    }).select().single()
    if (!fail(error) && created && linkOnCreate) {
      fail((await supabase.from('inventory').update({ product_id: created.id })
        .eq('product_name', linkOnCreate).is('product_id', null)).error)
    }
    setSaving(false)
    if (error) return
    setForm(EMPTY_FORM)
    setLinkOnCreate(null)
    load()
  }

  function startEdit(p: ReceiptProduct) {
    setEditingId(p.id)
    setEditForm({ name: p.name, default_price: String(p.default_price), vat_rate: String(p.vat_rate) })
  }

  async function saveEdit(id: string) {
    if (!editForm.name.trim()) return
    setSaving(true)
    const { error } = await supabase.from('receipt_products').update({
      name: editForm.name.trim(),
      default_price: parseFloat(editForm.default_price),
      vat_rate: parseFloat(editForm.vat_rate),
    }).eq('id', id)
    setSaving(false)
    if (fail(error)) return
    setEditingId(null)
    load()
  }

  async function toggleActive(p: ReceiptProduct) {
    await supabase.from('receipt_products').update({ active: !p.active }).eq('id', p.id)
    load()
  }

  async function handleDrop(targetId: string) {
    const fromId = dragId.current
    if (!fromId || fromId === targetId) { setDragOverId(null); return }

    const from = products.findIndex(p => p.id === fromId)
    const to = products.findIndex(p => p.id === targetId)
    const reordered = [...products]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    const withOrder = reordered.map((p, i) => ({ ...p, sort_order: i }))
    setProducts(withOrder)
    setDragOverId(null)
    dragId.current = null

    await Promise.all(
      withOrder.map(p => supabase.from('receipt_products').update({ sort_order: p.sort_order }).eq('id', p.id))
    )
  }

  async function deleteProduct(id: string) {
    const colors = rowsByProduct.get(id)?.length ?? 0
    const msg = colors > 0
      ? `Ta bort produkten? De ${colors} färgerna finns kvar i lagret men blir okopplade.`
      : 'Ta bort produkten?'
    if (!confirm(msg)) return
    await supabase.from('receipt_products').delete().eq('id', id)
    load()
  }

  function toggleExpanded(id: string) {
    setExpandedId(expandedId === id ? null : id)
    setColorForm(EMPTY_COLOR)
  }

  async function addColor(p: ReceiptProduct) {
    if (!colorForm.colorway.trim()) return
    const siblings = rowsByProduct.get(p.id) ?? []
    setSaving(true)
    const { error } = await supabase.from('inventory').insert({
      product_id: p.id,
      product_name: siblings[0]?.product_name ?? p.name,
      category: siblings[0]?.category ?? 'yarn',
      colorway: colorForm.colorway.trim(),
      retail_price: colorForm.price ? parseFloat(colorForm.price) : p.default_price,
      quantity_in_stock: colorForm.qty ? parseInt(colorForm.qty, 10) : 0,
    })
    setSaving(false)
    if (fail(error)) return
    setColorForm(EMPTY_COLOR)
    load()
  }

  async function linkOrphan(o: Orphan, productId: string) {
    if (!productId) return
    const { error } = await supabase.from('inventory').update({ product_id: productId })
      .in('id', o.rows.map(r => r.id))
    if (!fail(error)) load()
  }

  // Fyller i formuläret ovan i stället för att spara direkt, så att momsen kan väljas (böcker 6 %)
  function createFromOrphan(o: Orphan) {
    setForm({ name: o.name, default_price: o.price != null ? String(o.price) : '', vat_rate: '25' })
    setLinkOnCreate(o.name)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-warm-900">Admin</h1>
        <p className="text-sm text-warm-500 mt-0.5">
          Produkter för kvittona. Varje produkt har sina färger i lagret – klicka på en produkt för att se eller lägga till färger.
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-start justify-between gap-3">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Add product form */}
      <div className="bg-white rounded-xl border border-linen-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-warm-700 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Lägg till produkt
        </h2>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-warm-500 mb-1">Produktnamn</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="t.ex. Rauma Finull"
              className="w-full px-3 py-2 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300"
              required
            />
          </div>
          <div className="w-28">
            <label className="block text-xs text-warm-500 mb-1">Pris (kr)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.default_price}
              onChange={e => setForm(f => ({ ...f, default_price: e.target.value }))}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300"
            />
          </div>
          <div className="w-36">
            <label className="block text-xs text-warm-500 mb-1">Momssats</label>
            <select
              value={form.vat_rate}
              onChange={e => setForm(f => ({ ...f, vat_rate: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300"
            >
              <option value="25">25% (standard)</option>
              <option value="6">6% (bokmoms)</option>
              <option value="12">12%</option>
              <option value="0">0%</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:opacity-50 transition-colors"
          >
            Lägg till
          </button>
          {linkOnCreate && (
            <p className="w-full text-xs text-warm-500">
              Lagerraderna för <span className="font-medium">{linkOnCreate}</span> kopplas till den nya produkten.{' '}
              <button type="button" onClick={() => { setLinkOnCreate(null); setForm(EMPTY_FORM) }} className="underline">Avbryt</button>
            </p>
          )}
        </form>
      </div>

      {/* Product list */}
      <div className="bg-white rounded-xl border border-linen-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-linen-100 flex items-center gap-3">
          <h2 className="text-sm font-semibold text-warm-700">Produkter</h2>
          <span className="text-xs text-warm-400">{products.length} st</span>
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-300 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Sök produkt…"
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300"
            />
          </div>
          <label className="flex items-center gap-1.5 text-xs text-warm-500 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={e => setShowInactive(e.target.checked)}
              className="accent-sage-600"
            />
            Visa inaktiva
          </label>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-warm-400">Laddar...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-sm text-warm-400">
            Inga produkter ännu. Lägg till din första produkt ovan.
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="p-8 text-center text-sm text-warm-400">Inga produkter matchar sökningen.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-linen-100">
                <th className="w-8 px-2 py-2.5" />
                <th className="text-left px-5 py-2.5 text-xs font-medium text-warm-500">Produkt</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-warm-500">I lager</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-warm-500">Pris</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-warm-500">Moms</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-warm-500">Aktiv</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-linen-100">
              {visibleProducts.map(p => {
                const rows = rowsByProduct.get(p.id) ?? []
                const stock = rows.reduce((s, r) => s + r.quantity_in_stock, 0)
                const colors = rows.filter(r => r.colorway).length
                const expanded = expandedId === p.id
                return (
                  <Fragment key={p.id}>
                    <tr
                      draggable={!search.trim() && editingId !== p.id}
                      onDragStart={() => { dragId.current = p.id }}
                      onDragOver={e => { e.preventDefault(); setDragOverId(p.id) }}
                      onDragLeave={() => setDragOverId(null)}
                      onDrop={() => handleDrop(p.id)}
                      onDragEnd={() => { dragId.current = null; setDragOverId(null) }}
                      className={`transition-colors ${!p.active ? 'opacity-50' : ''} ${
                        dragOverId === p.id ? 'bg-sage-50 border-t-2 border-sage-400' : 'hover:bg-cream-50'
                      }`}
                    >
                      {editingId === p.id ? (
                        <>
                          <td className="px-2 py-2" />
                          <td className="px-5 py-2">
                            <input
                              value={editForm.name}
                              onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                              className="w-full px-2 py-1 border border-sage-300 rounded focus:outline-none focus:ring-1 focus:ring-sage-400 text-sm"
                              autoFocus
                            />
                          </td>
                          <td />
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={editForm.default_price}
                              onChange={e => setEditForm(f => ({ ...f, default_price: e.target.value }))}
                              className="w-24 px-2 py-1 border border-sage-300 rounded text-right text-sm focus:outline-none focus:ring-1 focus:ring-sage-400"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={editForm.vat_rate}
                              onChange={e => setEditForm(f => ({ ...f, vat_rate: e.target.value }))}
                              className="px-2 py-1 border border-sage-300 rounded text-sm focus:outline-none"
                            >
                              <option value="25">25%</option>
                              <option value="12">12%</option>
                              <option value="6">6%</option>
                              <option value="0">0%</option>
                            </select>
                          </td>
                          <td />
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-1">
                              <button onClick={() => saveEdit(p.id)} disabled={saving}
                                className="p-1 text-sage-600 hover:bg-sage-100 rounded transition-colors" title="Spara">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingId(null)}
                                className="p-1 text-warm-400 hover:bg-cream-200 rounded transition-colors" title="Avbryt">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2 py-3 text-center">
                            <GripVertical className={`w-4 h-4 text-warm-300 mx-auto ${!search.trim() ? 'cursor-grab active:cursor-grabbing' : 'opacity-0'}`} />
                          </td>
                          <td className="px-5 py-3">
                            <button onClick={() => toggleExpanded(p.id)}
                              className="flex items-center gap-1.5 font-medium text-warm-900 text-left hover:text-sage-700">
                              {expanded
                                ? <ChevronDown className="w-3.5 h-3.5 text-warm-400 flex-shrink-0" />
                                : <ChevronRight className="w-3.5 h-3.5 text-warm-400 flex-shrink-0" />}
                              {p.name}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-xs text-warm-500 whitespace-nowrap">
                            {rows.length === 0
                              ? <span className="text-warm-300">–</span>
                              : <>{colors > 0 ? `${colors} färger · ` : ''}{stock} st</>}
                          </td>
                          <td className="px-4 py-3 text-right text-warm-700">{p.default_price.toFixed(2).replace('.', ',')} kr</td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-linen-100 text-warm-600">
                              {p.vat_rate}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => toggleActive(p)}
                              className={`w-8 h-4 rounded-full transition-colors ${p.active ? 'bg-sage-500' : 'bg-linen-300'}`}
                              title={p.active ? 'Klicka för att inaktivera' : 'Klicka för att aktivera'}>
                              <span className={`block w-3 h-3 rounded-full bg-white shadow transition-transform mx-0.5 ${p.active ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => startEdit(p)}
                                className="p-1 text-warm-400 hover:text-warm-700 hover:bg-cream-200 rounded transition-colors" title="Redigera">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteProduct(p.id)}
                                className="p-1 text-warm-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Ta bort">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>

                    {expanded && (
                      <tr className="bg-cream-50">
                        <td />
                        <td colSpan={6} className="px-5 py-3">
                          {rows.length === 0 ? (
                            <p className="text-xs text-warm-400 mb-3">Inga färger i lagret än. Lägg till dem nedan så kan de väljas i kvittot.</p>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {rows.map(r => (
                                <span key={r.id}
                                  className={`px-2 py-1 rounded-md text-xs border ${r.quantity_in_stock > 0 ? 'bg-white border-linen-200 text-warm-700' : 'bg-white border-red-200 text-red-600'}`}>
                                  {r.colorway ?? r.product_name}
                                  <span className="text-warm-400"> · {r.quantity_in_stock} st</span>
                                  {r.retail_price != null && r.retail_price !== p.default_price && (
                                    <span className="text-warm-400"> · {r.retail_price} kr</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-wrap items-end gap-2">
                            <input
                              value={colorForm.colorway}
                              onChange={e => setColorForm(f => ({ ...f, colorway: e.target.value }))}
                              onKeyDown={e => { if (e.key === 'Enter') addColor(p) }}
                              placeholder="Ny färg, t.ex. Rost"
                              className="flex-1 min-w-[140px] px-2.5 py-1.5 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300"
                            />
                            <input
                              type="number" min="0" step="0.01"
                              value={colorForm.price}
                              onChange={e => setColorForm(f => ({ ...f, price: e.target.value }))}
                              placeholder={`${p.default_price} kr`}
                              className="w-24 px-2.5 py-1.5 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300"
                            />
                            <input
                              type="number" min="0"
                              value={colorForm.qty}
                              onChange={e => setColorForm(f => ({ ...f, qty: e.target.value }))}
                              placeholder="Antal"
                              className="w-20 px-2.5 py-1.5 text-sm border border-linen-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300"
                            />
                            <button onClick={() => addColor(p)} disabled={saving || !colorForm.colorway.trim()}
                              className="px-3 py-1.5 text-xs font-medium bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:opacity-50">
                              Lägg till färg
                            </button>
                          </div>
                          <p className="text-xs text-warm-400 mt-2">Saldo, artikelnummer och övriga uppgifter ändras under Lager.</p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && orphans.length > 0 && (
        <div className="bg-white rounded-xl border border-linen-200 overflow-hidden mt-6">
          <div className="px-5 py-3 border-b border-linen-100">
            <h2 className="text-sm font-semibold text-warm-700 flex items-center gap-2">
              <Boxes className="w-4 h-4" /> I lager men inte kopplade till någon produkt
              <span className="text-xs font-normal text-warm-400">{orphans.length} st</span>
            </h2>
            <p className="text-xs text-warm-400 mt-0.5">Koppla till en befintlig produkt, eller skapa en ny.</p>
          </div>
          <ul className="divide-y divide-linen-100">
            {orphans.map(o => (
              <li key={o.name} className="px-5 py-2.5 flex flex-wrap items-center gap-3 text-sm">
                <span className="flex-1 min-w-[180px] text-warm-900">{o.name}</span>
                <span className="text-xs text-warm-400 whitespace-nowrap">
                  {o.rows.length > 1 ? `${o.rows.length} färger · ` : ''}{o.stock} st{o.price != null ? ` · ${o.price} kr` : ''}
                </span>
                <select value="" onChange={e => linkOrphan(o, e.target.value)}
                  className="px-2 py-1 text-xs border border-linen-200 rounded-md text-warm-600 max-w-[12rem]">
                  <option value="">Koppla till…</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button onClick={() => createFromOrphan(o)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium border border-linen-200 text-warm-600 hover:bg-cream-100">
                  Skapa produkt
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
