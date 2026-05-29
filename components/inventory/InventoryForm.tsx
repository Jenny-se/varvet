'use client'

import { useState } from 'react'
import { InventoryItem, Supplier, YarnWeight, InventoryCategory } from '@/lib/types'

type InventoryInput = Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'supplier'>

const WEIGHT_OPTIONS: YarnWeight[] = ['lace', 'fingering', 'DK', 'worsted', 'bulky']
const CATEGORY_OPTIONS: InventoryCategory[] = ['yarn', 'needles', 'accessories']
const CATEGORY_LABELS: Record<InventoryCategory, string> = {
  yarn: 'Garn',
  needles: 'Stickor',
  accessories: 'Tillbehör',
}

interface InventoryFormProps {
  initial?: Partial<InventoryInput>
  suppliers: Supplier[]
  onSubmit: (data: InventoryInput) => Promise<void>
  onCancel: () => void
  submitting: boolean
}

export function InventoryForm({ initial, suppliers, onSubmit, onCancel, submitting }: InventoryFormProps) {
  const [form, setForm] = useState<InventoryInput>({
    product_name: initial?.product_name ?? '',
    colorway: initial?.colorway ?? '',
    dye_lot: initial?.dye_lot ?? '',
    yarn_weight: initial?.yarn_weight ?? null,
    fiber_content: initial?.fiber_content ?? '',
    meterage_per_skein: initial?.meterage_per_skein ?? null,
    needle_size_recommendation: initial?.needle_size_recommendation ?? '',
    quantity_in_stock: initial?.quantity_in_stock ?? 0,
    cost_price: initial?.cost_price ?? null,
    retail_price: initial?.retail_price ?? null,
    supplier_id: initial?.supplier_id ?? null,
    low_stock_threshold: initial?.low_stock_threshold ?? 5,
    category: initial?.category ?? 'yarn',
    tags: initial?.tags ?? [],
    notes: initial?.notes ?? '',
  })

  const [tagInput, setTagInput] = useState('')

  function set<K extends keyof InventoryInput>(key: K, value: InventoryInput[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, t] }))
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Produktnamn *</label>
          <input
            className="input-field"
            required
            value={form.product_name}
            onChange={e => set('product_name', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Kategori</label>
          <select
            className="input-field"
            value={form.category}
            onChange={e => set('category', e.target.value as InventoryCategory)}
          >
            {CATEGORY_OPTIONS.map(c => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Garnvikt</label>
          <select
            className="input-field"
            value={form.yarn_weight ?? ''}
            onChange={e => set('yarn_weight', e.target.value as YarnWeight || null)}
          >
            <option value="">Välj vikt</option>
            {WEIGHT_OPTIONS.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Färgväg</label>
          <input
            className="input-field"
            value={form.colorway ?? ''}
            onChange={e => set('colorway', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Färgparti (dye lot)</label>
          <input
            className="input-field"
            value={form.dye_lot ?? ''}
            onChange={e => set('dye_lot', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Fiberinnehåll</label>
          <input
            className="input-field"
            placeholder="t.ex. 100% merino"
            value={form.fiber_content ?? ''}
            onChange={e => set('fiber_content', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Meter per härva</label>
          <input
            type="number"
            min={0}
            className="input-field"
            value={form.meterage_per_skein ?? ''}
            onChange={e => set('meterage_per_skein', e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
        <div>
          <label className="label">Rekommenderad nålstorlek</label>
          <input
            className="input-field"
            placeholder="t.ex. 3,5 mm"
            value={form.needle_size_recommendation ?? ''}
            onChange={e => set('needle_size_recommendation', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Antal i lager *</label>
          <input
            type="number"
            min={0}
            required
            className="input-field"
            value={form.quantity_in_stock}
            onChange={e => set('quantity_in_stock', parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="label">Låglagergräns</label>
          <input
            type="number"
            min={0}
            className="input-field"
            value={form.low_stock_threshold}
            onChange={e => set('low_stock_threshold', parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="label">Kostnadspris (kr)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            className="input-field"
            value={form.cost_price ?? ''}
            onChange={e => set('cost_price', e.target.value ? parseFloat(e.target.value) : null)}
          />
        </div>
        <div>
          <label className="label">Försäljningspris (kr)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            className="input-field"
            value={form.retail_price ?? ''}
            onChange={e => set('retail_price', e.target.value ? parseFloat(e.target.value) : null)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Leverantör</label>
          <select
            className="input-field"
            value={form.supplier_id ?? ''}
            onChange={e => set('supplier_id', e.target.value || null)}
          >
            <option value="">Ingen leverantör</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.company_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="label">Taggar</label>
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder="Lägg till tagg…"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
          />
          <button type="button" onClick={addTag} className="btn-secondary flex-shrink-0">
            Lägg till
          </button>
        </div>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-cream-200 text-warm-700 rounded-full text-xs"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-warm-400 hover:text-warm-700 ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="label">Anteckningar</label>
        <textarea
          className="input-field min-h-[80px] resize-none"
          value={form.notes ?? ''}
          onChange={e => set('notes', e.target.value)}
        />
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
