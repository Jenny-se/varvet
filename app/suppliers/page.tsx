'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Supplier } from '@/lib/types'
import { logActivity } from '@/lib/activity'
import { SupplierCard } from '@/components/suppliers/SupplierCard'
import { SupplierForm } from '@/components/suppliers/SupplierForm'
import { SupplierDetailModal } from '@/components/suppliers/SupplierDetailModal'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'

const FIBER_FILTER_OPTIONS = ['Alla', 'Merino', 'Alpaca', 'Linen', 'Cotton', 'Mohair', 'Silk', 'Cashmere', 'Bamboo', 'Wool']
const COUNTRY_FILTER_OPTIONS = ['Alla', 'Sverige', 'Norge', 'UK', 'Italien', 'Nya Zeeland', 'Peru', 'USA', 'Japan']

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCountry, setFilterCountry] = useState('Alla')
  const [filterFiber, setFilterFiber] = useState('Alla')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchSuppliers = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('suppliers')
      .select('*')
      .order('company_name')
    setSuppliers(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchSuppliers() }, [fetchSuppliers])

  const filtered = suppliers.filter(s => {
    if (search && !s.company_name.toLowerCase().includes(search.toLowerCase()) &&
        !(s.contact_person?.toLowerCase().includes(search.toLowerCase()))) return false
    if (filterCountry !== 'Alla' && s.country_of_origin !== filterCountry) return false
    if (filterFiber !== 'Alla' && !s.fiber_specialties.includes(filterFiber)) return false
    if (filterStatus === 'active' && s.status !== 'active') return false
    if (filterStatus === 'inactive' && s.status !== 'inactive') return false
    return true
  })

  async function handleSubmit(data: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) {
    setSubmitting(true)
    if (editingSupplier) {
      const { error } = await supabase
        .from('suppliers')
        .update(data)
        .eq('id', editingSupplier.id)
      if (!error) {
        await logActivity('Uppdaterade leverantör', 'supplier', editingSupplier.id, data.company_name)
      }
    } else {
      const { data: created, error } = await supabase
        .from('suppliers')
        .insert(data)
        .select()
        .single()
      if (!error && created) {
        await logActivity('Lade till leverantör', 'supplier', created.id, data.company_name)
      }
    }
    setSubmitting(false)
    setShowForm(false)
    setEditingSupplier(null)
    fetchSuppliers()
  }

  async function handleDelete() {
    if (!deletingId) return
    const s = suppliers.find(s => s.id === deletingId)
    const { error } = await supabase.from('suppliers').delete().eq('id', deletingId)
    if (!error && s) {
      await logActivity('Raderade leverantör', 'supplier', deletingId, s.company_name)
    }
    setDeletingId(null)
    fetchSuppliers()
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Leverantörer</h1>
          <p className="text-sm text-warm-500 mt-0.5">
            {suppliers.filter(s => s.status === 'active').length} aktiva leverantörer
          </p>
        </div>
        <button
          onClick={() => { setEditingSupplier(null); setShowForm(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Lägg till
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
            <input
              className="input-field pl-9"
              placeholder="Sök leverantör…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field sm:w-40"
            value={filterCountry}
            onChange={e => setFilterCountry(e.target.value)}
          >
            {COUNTRY_FILTER_OPTIONS.map(c => (
              <option key={c} value={c}>{c === 'Alla' ? 'Alla länder' : c}</option>
            ))}
          </select>
          <select
            className="input-field sm:w-40"
            value={filterFiber}
            onChange={e => setFilterFiber(e.target.value)}
          >
            {FIBER_FILTER_OPTIONS.map(f => (
              <option key={f} value={f}>{f === 'Alla' ? 'Alla fibrer' : f}</option>
            ))}
          </select>
          <select
            className="input-field sm:w-36"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
          >
            <option value="all">Alla statusar</option>
            <option value="active">Aktiva</option>
            <option value="inactive">Inaktiva</option>
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
              <div className="h-3 bg-cream-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Inga leverantörer hittades"
          description="Lägg till din första leverantör eller justera filtren."
          action={
            <button
              onClick={() => { setEditingSupplier(null); setShowForm(true) }}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Lägg till leverantör
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(supplier => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onView={() => setViewingSupplier(supplier)}
              onEdit={() => { setEditingSupplier(supplier); setShowForm(true) }}
              onDelete={() => setDeletingId(supplier.id)}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {viewingSupplier && (
        <SupplierDetailModal
          supplier={viewingSupplier}
          onClose={() => setViewingSupplier(null)}
          onEdit={() => {
            setEditingSupplier(viewingSupplier)
            setViewingSupplier(null)
            setShowForm(true)
          }}
        />
      )}

      {/* Form modal */}
      {showForm && (
        <Modal
          title={editingSupplier ? 'Redigera leverantör' : 'Ny leverantör'}
          onClose={() => { setShowForm(false); setEditingSupplier(null) }}
          size="lg"
        >
          <SupplierForm
            initial={editingSupplier ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditingSupplier(null) }}
            submitting={submitting}
          />
        </Modal>
      )}

      {/* Delete confirm */}
      {deletingId && (
        <ConfirmDialog
          title="Radera leverantör"
          message="Är du säker? Lageraktier kopplade till denna leverantör påverkas inte."
          confirmLabel="Radera"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
