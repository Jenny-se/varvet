'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Plus, Search, Boxes, AlertTriangle, LayoutList, LayoutGrid, Edit2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { InventoryItem, ReceiptProduct, Supplier, YarnWeight, InventoryCategory } from '@/lib/types'
import { logActivity } from '@/lib/activity'
import { InventoryCard } from '@/components/inventory/InventoryCard'
import { InventoryForm } from '@/components/inventory/InventoryForm'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'

type InventoryInput = Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'supplier'>

const WEIGHT_OPTIONS: YarnWeight[] = ['lace', 'fingering', 'DK', 'worsted', 'bulky']
const CATEGORY_OPTIONS: InventoryCategory[] = ['yarn', 'needles', 'accessories']
const CATEGORY_LABELS: Record<InventoryCategory, string> = { yarn: 'Garn', needles: 'Stickor', accessories: 'Tillbehör' }

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterWeight, setFilterWeight] = useState<YarnWeight | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<InventoryCategory | 'all'>('all')
  const [filterSupplier, setFilterSupplier] = useState('')
  const [showLowOnly, setShowLowOnly] = useState(false)
  const [showInactive, setShowInactive] = useState(false)
  const [compactView, setCompactView] = useState(true)
  const [receiptProducts, setReceiptProducts] = useState<ReceiptProduct[]>([])

  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [{ data: itemData }, { data: supplierData }, { data: rpData }] = await Promise.all([
      supabase.from('inventory').select('*, supplier:suppliers(id, company_name, status)').order('product_name'),
      supabase.from('suppliers').select('*').eq('status', 'active').order('company_name'),
      supabase.from('receipt_products').select('*').order('sort_order'),
    ])
    setItems((itemData as InventoryItem[]) ?? [])
    setSuppliers(supplierData ?? [])
    setReceiptProducts(rpData ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const lowStockCount = items.filter(i => i.quantity_in_stock <= i.low_stock_threshold).length
  const totalUnits = items.reduce((sum, i) => sum + i.quantity_in_stock, 0)
  const totalRetail = items.reduce((sum, i) => sum + (i.retail_price ?? 0) * i.quantity_in_stock, 0)
  const totalCost = items.reduce((sum, i) => sum + (i.cost_price ?? 0) * i.quantity_in_stock, 0)
  const totalValue = totalRetail

  const inactiveProductNames = useMemo(() =>
    new Set(receiptProducts.filter(p => !p.active).map(p => p.name.toLowerCase()))
  , [receiptProducts])

  const filtered = items.filter(item => {
    const nameL = item.product_name.toLowerCase()
    const linkedToInactive = [...inactiveProductNames].some(n => nameL.includes(n))
    if (!showInactive && linkedToInactive) return false
    if (search && !item.product_name.toLowerCase().includes(search.toLowerCase()) &&
        !(item.colorway?.toLowerCase().includes(search.toLowerCase())) &&
        !(item.fiber_content?.toLowerCase().includes(search.toLowerCase()))) return false
    if (filterWeight !== 'all' && item.yarn_weight !== filterWeight) return false
    if (filterCategory !== 'all' && item.category !== filterCategory) return false
    if (filterSupplier && item.supplier_id !== filterSupplier) return false
    if (showLowOnly && item.quantity_in_stock > item.low_stock_threshold) return false
    return true
  }).sort((a, b) => {
    const orderOf = (item: InventoryItem) => {
      const nameL = item.product_name.toLowerCase()
      const match = receiptProducts.find(p => nameL.includes(p.name.toLowerCase()))
      return match ? match.sort_order : 9999
    }
    const diff = orderOf(a) - orderOf(b)
    if (diff !== 0) return diff
    const nameDiff = a.product_name.localeCompare(b.product_name, 'sv')
    if (nameDiff !== 0) return nameDiff
    return (a.colorway ?? '').localeCompare(b.colorway ?? '', 'sv')
  })

  async function handleSubmit(data: InventoryInput) {
    setSubmitting(true)
    if (editingItem) {
      const { error } = await supabase.from('inventory').update(data).eq('id', editingItem.id)
      if (!error) await logActivity('Uppdaterade lagerpost', 'inventory', editingItem.id, data.product_name)
    } else {
      const { data: created, error } = await supabase.from('inventory').insert(data).select().single()
      if (!error && created) await logActivity('Lade till lagerpost', 'inventory', created.id, data.product_name)
    }
    setSubmitting(false)
    setShowForm(false)
    setEditingItem(null)
    fetchData()
  }

  async function handleDelete() {
    if (!deletingId) return
    const item = items.find(i => i.id === deletingId)
    const { error } = await supabase.from('inventory').delete().eq('id', deletingId)
    if (!error && item) await logActivity('Raderade lagerpost', 'inventory', deletingId, item.product_name)
    setDeletingId(null)
    fetchData()
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-warm-900">Lager</h1>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Lägg till
        </button>
      </div>

      {/* View toggle */}
      <div className="flex justify-end mb-3">
        <div className="flex items-center bg-white border border-linen-200 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setCompactView(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              compactView ? 'bg-sage-100 text-sage-700' : 'text-warm-500 hover:text-warm-700'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            Kompakt
          </button>
          <button
            onClick={() => setCompactView(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              !compactView ? 'bg-sage-100 text-sage-700' : 'text-warm-500 hover:text-warm-700'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Detaljerad
          </button>
        </div>
      </div>

      {/* Value stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white border border-linen-200 rounded-xl p-4">
          <p className="text-xs text-warm-400 mb-1">Artiklar (st)</p>
          <p className="text-2xl font-semibold text-warm-900 tabular-nums">{totalUnits.toLocaleString('sv-SE')}</p>
          <p className="text-xs text-warm-400 mt-0.5">{items.length} produkter</p>
        </div>
        <div className="bg-white border border-linen-200 rounded-xl p-4">
          <p className="text-xs text-warm-400 mb-1">Försäljningsvärde</p>
          <p className="text-2xl font-semibold text-warm-900 tabular-nums">{Math.round(totalRetail).toLocaleString('sv-SE')} <span className="text-base font-normal text-warm-500">kr</span></p>
          <p className="text-xs text-warm-400 mt-0.5">ink. moms</p>
        </div>
        <div className="bg-white border border-linen-200 rounded-xl p-4">
          <p className="text-xs text-warm-400 mb-1">Inköpsvärde</p>
          <p className="text-2xl font-semibold text-warm-900 tabular-nums">{Math.round(totalCost).toLocaleString('sv-SE')} <span className="text-base font-normal text-warm-500">kr</span></p>
          <p className="text-xs text-warm-400 mt-0.5">{totalCost > 0 ? `${items.filter(i => i.cost_price).length} med kostnadspris` : 'saknas för de flesta'}</p>
        </div>
        <div className={`border rounded-xl p-4 ${lowStockCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-linen-200'}`}>
          <p className="text-xs text-warm-400 mb-1">Lågt saldo</p>
          <p className={`text-2xl font-semibold tabular-nums ${lowStockCount > 0 ? 'text-amber-700' : 'text-sage-600'}`}>{lowStockCount}</p>
          <p className="text-xs text-warm-400 mt-0.5">{lowStockCount > 0 ? 'behöver beställas' : 'allt ok'}</p>
        </div>
      </div>

      {/* Low stock banner */}
      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>{lowStockCount}</strong> {lowStockCount === 1 ? 'produkt har' : 'produkter har'} lågt lagersaldo
          </p>
          <button
            onClick={() => setShowLowOnly(!showLowOnly)}
            className={`ml-auto text-xs font-medium px-3 py-1 rounded-full transition-colors ${
              showLowOnly ? 'bg-amber-200 text-amber-800' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            {showLowOnly ? 'Visa alla' : 'Visa endast låga'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
            <input
              className="input-field pl-9"
              placeholder="Sök produkt…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field sm:w-36"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value as InventoryCategory | 'all')}
          >
            <option value="all">Alla kategorier</option>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
          </select>
          <select
            className="input-field sm:w-36"
            value={filterWeight}
            onChange={e => setFilterWeight(e.target.value as YarnWeight | 'all')}
          >
            <option value="all">Alla vikter</option>
            {WEIGHT_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <select
            className="input-field sm:w-44"
            value={filterSupplier}
            onChange={e => setFilterSupplier(e.target.value)}
          >
            <option value="">Alla leverantörer</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.company_name}</option>)}
          </select>
          <label className="flex items-center gap-1.5 text-sm text-warm-500 cursor-pointer whitespace-nowrap self-center">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={e => setShowInactive(e.target.checked)}
              className="accent-sage-600"
            />
            Visa inaktiva
          </label>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-linen-200 divide-y divide-linen-100">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 animate-pulse">
              <div className="h-3 bg-cream-300 rounded w-1/3" />
              <div className="h-3 bg-cream-200 rounded w-1/4" />
              <div className="h-3 bg-cream-200 rounded w-12 ml-auto" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="Inga lagerprodukter hittades"
          description="Lägg till din första produkt eller justera filtren."
          action={
            <button
              onClick={() => { setEditingItem(null); setShowForm(true) }}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Lägg till produkt
            </button>
          }
        />
      ) : compactView ? (
        /* ── Compact list ── */
        <div className="bg-white rounded-xl border border-linen-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-linen-100">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-warm-500">Produkt</th>
                <th className="text-left px-3 py-2.5 text-xs font-medium text-warm-500 hidden sm:table-cell">Färg</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-warm-500">I lager</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-warm-500 hidden sm:table-cell">Pris</th>
                <th className="px-3 py-2.5 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-linen-50">
              {filtered.map(item => {
                const isLow = item.quantity_in_stock <= item.low_stock_threshold
                const isOut = item.quantity_in_stock === 0
                return (
                  <tr key={item.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-warm-900">{item.product_name}</span>
                      {item.colorway && (
                        <span className="text-warm-400 ml-1.5 sm:hidden">{item.colorway}</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-warm-500 hidden sm:table-cell">{item.colorway ?? '—'}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`font-semibold tabular-nums ${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-warm-900'}`}>
                        {item.quantity_in_stock}
                      </span>
                      {isLow && !isOut && <AlertTriangle className="w-3 h-3 text-amber-400 inline ml-1" />}
                      {isOut && <AlertTriangle className="w-3 h-3 text-red-400 inline ml-1" />}
                    </td>
                    <td className="px-4 py-2.5 text-right text-warm-500 tabular-nums hidden sm:table-cell">
                      {item.retail_price ? `${item.retail_price} kr` : '—'}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => { setEditingItem(item); setShowForm(true) }}
                          className="p-1 text-warm-300 hover:text-warm-700 hover:bg-cream-200 rounded transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeletingId(item.id)}
                          className="p-1 text-warm-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* ── Detailed cards ── */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => (
            <InventoryCard
              key={item.id}
              item={item}
              onEdit={() => { setEditingItem(item); setShowForm(true) }}
              onDelete={() => setDeletingId(item.id)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <Modal
          title={editingItem ? 'Redigera produkt' : 'Ny produkt'}
          onClose={() => { setShowForm(false); setEditingItem(null) }}
          size="lg"
        >
          <InventoryForm
            initial={editingItem ?? undefined}
            suppliers={suppliers}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditingItem(null) }}
            submitting={submitting}
          />
        </Modal>
      )}

      {deletingId && (
        <ConfirmDialog
          title="Radera produkt"
          message="Är du säker på att du vill radera denna produkt från lagret?"
          confirmLabel="Radera"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
