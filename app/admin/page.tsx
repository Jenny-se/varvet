'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { ReceiptProduct } from '@/lib/types'
import { Plus, Pencil, Trash2, Check, X, Search, GripVertical } from 'lucide-react'

const EMPTY_FORM = { name: '', default_price: '', vat_rate: '25' }

export default function AdminPage() {
  const [products, setProducts] = useState<ReceiptProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
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

  async function load() {
    const { data } = await supabase
      .from('receipt_products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const maxOrder = products.length > 0 ? Math.max(...products.map(p => p.sort_order)) + 1 : 0
    await supabase.from('receipt_products').insert({
      name: form.name.trim(),
      default_price: form.default_price ? parseFloat(form.default_price) : 0,
      vat_rate: parseFloat(form.vat_rate),
      sort_order: maxOrder,
    })
    setForm(EMPTY_FORM)
    setSaving(false)
    load()
  }

  function startEdit(p: ReceiptProduct) {
    setEditingId(p.id)
    setEditForm({ name: p.name, default_price: String(p.default_price), vat_rate: String(p.vat_rate) })
  }

  async function saveEdit(id: string) {
    if (!editForm.name.trim()) return
    setSaving(true)
    await supabase.from('receipt_products').update({
      name: editForm.name.trim(),
      default_price: parseFloat(editForm.default_price),
      vat_rate: parseFloat(editForm.vat_rate),
    }).eq('id', id)
    setEditingId(null)
    setSaving(false)
    load()
  }

  async function toggleActive(p: ReceiptProduct) {
    const newActive = !p.active
    await Promise.all([
      supabase.from('receipt_products').update({ active: newActive }).eq('id', p.id),
      supabase.from('inventory').update({ active: newActive }).ilike('product_name', `%${p.name}%`),
    ])
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
    if (!confirm('Ta bort produkten?')) return
    await supabase.from('receipt_products').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-warm-900">Admin</h1>
        <p className="text-sm text-warm-500 mt-0.5">Produktkatalog för kvittosystemet</p>
      </div>

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
                <th className="text-right px-4 py-2.5 text-xs font-medium text-warm-500">Pris</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-warm-500">Moms</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-warm-500">Aktiv</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-linen-100">
              {visibleProducts.map(p => (
                <tr
                  key={p.id}
                  draggable={!search.trim()}
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
                      <td className="px-5 py-3 font-medium text-warm-900">{p.name}</td>
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
