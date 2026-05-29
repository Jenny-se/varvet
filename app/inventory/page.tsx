'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Boxes, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { InventoryItem, Supplier, YarnWeight, InventoryCategory } from '@/lib/types'
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

  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [{ data: itemData }, { data: supplierData }] = await Promise.all([
      supabase
        .from('inventory')
        .select('*, supplier:suppliers(id, company_name, status)')
        .order('product_name'),
      supabase.from('suppliers').select('*').eq('status', 'active').order('company_name'),
    ])
    setItems((itemData as InventoryItem[]) ?? [])
    setSuppliers(supplierData ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const lowStockCount = items.filter(i => i.quantity_in_stock <= i.low_stock_threshold).length
  const totalValue = items.reduce((sum, i) => sum + (i.retail_price ?? 0) * i.quantity_in_stock, 0)

  const filtered = items.filter(item => {
    if (search && !item.product_name.toLowerCase().includes(search.toLowerCase()) &&
        !(item.colorway?.toLowerCase().includes(search.toLowerCase())) &&
        !(item.fiber_content?.toLowerCase().includes(search.toLowerCase()))) return false
    if (filterWeight !== 'all' && item.yarn_weight !== filterWeight) return false
    if (filterCategory !== 'all' && item.category !== filterCategory) return false
    if (filterSupplier && item.supplier_id !== filterSupplier) return false
    if (showLowOnly && item.quantity_in_stock > item.low_stock_threshold) return false
    return true
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Lager</h1>
          <p className="text-sm text-warm-500 mt-0.5">
            {items.length} produkter · {totalValue.toLocaleString('sv-SE')} kr totalt värde
          </p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Lägg till
        </button>
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
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-cream-300 rounded w-2/3 mb-3" />
              <div className="h-3 bg-cream-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-cream-200 rounded w-full" />
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
      ) : (
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
