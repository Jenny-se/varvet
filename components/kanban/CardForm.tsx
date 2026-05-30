'use client'

import { useState } from 'react'
import { KanbanCard, KanbanColumn, Supplier, InventoryItem, Priority, CardCategory, Moodboard } from '@/lib/types'

type CardInput = Omit<KanbanCard, 'id' | 'created_at' | 'updated_at' | 'supplier' | 'inventory' | 'moodboard'>

const PRIORITIES: Priority[] = ['low', 'medium', 'high']
const PRIORITY_LABELS: Record<Priority, string> = { low: 'Låg', medium: 'Medel', high: 'Hög' }
const CATEGORIES: CardCategory[] = ['Workshop', 'Order', 'Marketing', 'Admin', 'Event']

interface CardFormProps {
  columns: KanbanColumn[]
  suppliers: Supplier[]
  inventoryItems: InventoryItem[]
  moodboards: Moodboard[]
  initial?: Partial<CardInput>
  onSubmit: (data: CardInput) => Promise<void>
  onCancel: () => void
  submitting: boolean
}

export function CardForm({ columns, suppliers, inventoryItems, moodboards, initial, onSubmit, onCancel, submitting }: CardFormProps) {
  const [form, setForm] = useState<CardInput>({
    column_id: initial?.column_id ?? columns[0]?.id ?? '',
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    due_date: initial?.due_date ?? null,
    priority: initial?.priority ?? 'medium',
    category_tag: initial?.category_tag ?? null,
    assignee: initial?.assignee ?? null,
    supplier_id: initial?.supplier_id ?? null,
    inventory_id: initial?.inventory_id ?? null,
    moodboard_id: initial?.moodboard_id ?? null,
    position: initial?.position ?? 0,
  })

  function set<K extends keyof CardInput>(key: K, value: CardInput[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
      <div>
        <label className="label">Titel *</label>
        <input
          className="input-field"
          required
          value={form.title}
          onChange={e => set('title', e.target.value)}
          autoFocus
        />
      </div>

      <div>
        <label className="label">Beskrivning</label>
        <textarea
          className="input-field min-h-[80px] resize-none"
          value={form.description ?? ''}
          onChange={e => set('description', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Kolumn</label>
          <select className="input-field" value={form.column_id} onChange={e => set('column_id', e.target.value)}>
            {columns.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Prioritet</label>
          <select className="input-field" value={form.priority} onChange={e => set('priority', e.target.value as Priority)}>
            {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Kategoritagg</label>
          <select className="input-field" value={form.category_tag ?? ''} onChange={e => set('category_tag', (e.target.value as CardCategory) || null)}>
            <option value="">Ingen kategori</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Ansvarig</label>
          <select className="input-field" value={form.assignee ?? ''} onChange={e => set('assignee', (e.target.value as 'Jenny' | 'Cissi' | 'Båda') || null)}>
            <option value="">Ingen</option>
            <option value="Jenny">Jenny</option>
            <option value="Cissi">Cissi</option>
            <option value="Båda">Båda</option>
          </select>
        </div>
        <div>
          <label className="label">Förfallodatum</label>
          <input type="date" className="input-field" value={form.due_date ?? ''} onChange={e => set('due_date', e.target.value || null)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Länkad leverantör</label>
          <select className="input-field" value={form.supplier_id ?? ''} onChange={e => set('supplier_id', e.target.value || null)}>
            <option value="">Ingen</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.company_name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Länkad lagerpost</label>
          <select className="input-field" value={form.inventory_id ?? ''} onChange={e => set('inventory_id', e.target.value || null)}>
            <option value="">Ingen</option>
            {inventoryItems.map(i => <option key={i.id} value={i.id}>{i.product_name}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="label">Länkad moodboard</label>
          <select className="input-field" value={form.moodboard_id ?? ''} onChange={e => set('moodboard_id', e.target.value || null)}>
            <option value="">Ingen</option>
            {moodboards.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 pb-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Avbryt</button>
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? 'Sparar…' : 'Spara'}
        </button>
      </div>
    </form>
  )
}
