'use client'

import { useState } from 'react'
import { Supplier } from '@/lib/types'

const FIBER_OPTIONS = ['Merino', 'Alpaca', 'Mohair', 'Cashmere', 'Linen', 'Cotton', 'Silk', 'Bamboo', 'Nylon', 'Wool', 'Yak', 'Qiviut']
const CERT_OPTIONS = ['GOTS', 'Mulesing-free', 'ZQ Merino', 'Oeko-Tex', 'RWS', 'Bluesign', 'REACH']

type SupplierInput = Omit<Supplier, 'id' | 'created_at' | 'updated_at'>

interface SupplierFormProps {
  initial?: Partial<SupplierInput>
  onSubmit: (data: SupplierInput) => Promise<void>
  onCancel: () => void
  submitting: boolean
}

export function SupplierForm({ initial, onSubmit, onCancel, submitting }: SupplierFormProps) {
  const [form, setForm] = useState<SupplierInput>({
    company_name: initial?.company_name ?? '',
    contact_person: initial?.contact_person ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    website: initial?.website ?? '',
    country_of_origin: initial?.country_of_origin ?? '',
    address: initial?.address ?? '',
    notes: initial?.notes ?? '',
    fiber_specialties: initial?.fiber_specialties ?? [],
    certifications: initial?.certifications ?? [],
    minimum_order_quantity: initial?.minimum_order_quantity ?? null,
    lead_time_days: initial?.lead_time_days ?? null,
    status: initial?.status ?? 'active',
  })

  function set<K extends keyof SupplierInput>(key: K, value: SupplierInput[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleArray(key: 'fiber_specialties' | 'certifications', value: string) {
    setForm(prev => {
      const arr = prev[key]
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
      {/* Basic info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Företagsnamn *</label>
          <input
            className="input-field"
            required
            value={form.company_name}
            onChange={e => set('company_name', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Kontaktperson</label>
          <input
            className="input-field"
            value={form.contact_person ?? ''}
            onChange={e => set('contact_person', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Status</label>
          <select
            className="input-field"
            value={form.status}
            onChange={e => set('status', e.target.value as 'active' | 'inactive')}
          >
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
          </select>
        </div>
        <div>
          <label className="label">E-post</label>
          <input
            type="email"
            className="input-field"
            value={form.email ?? ''}
            onChange={e => set('email', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Telefon</label>
          <input
            className="input-field"
            value={form.phone ?? ''}
            onChange={e => set('phone', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Webbplats</label>
          <input
            type="url"
            className="input-field"
            placeholder="https://"
            value={form.website ?? ''}
            onChange={e => set('website', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Ursprungsland</label>
          <input
            className="input-field"
            value={form.country_of_origin ?? ''}
            onChange={e => set('country_of_origin', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Adress</label>
          <input
            className="input-field"
            value={form.address ?? ''}
            onChange={e => set('address', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Minsta orderkvantitet</label>
          <input
            type="number"
            min={0}
            className="input-field"
            value={form.minimum_order_quantity ?? ''}
            onChange={e => set('minimum_order_quantity', e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
        <div>
          <label className="label">Ledtid (dagar)</label>
          <input
            type="number"
            min={0}
            className="input-field"
            value={form.lead_time_days ?? ''}
            onChange={e => set('lead_time_days', e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
      </div>

      {/* Fiber specialties */}
      <div>
        <label className="label">Fiberspecialiteter</label>
        <div className="flex flex-wrap gap-2">
          {FIBER_OPTIONS.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => toggleArray('fiber_specialties', f)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                form.fiber_specialties.includes(f)
                  ? 'bg-sage-500 border-sage-500 text-white'
                  : 'bg-white border-cream-400 text-warm-600 hover:border-sage-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <label className="label">Certifieringar</label>
        <div className="flex flex-wrap gap-2">
          {CERT_OPTIONS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => toggleArray('certifications', c)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                form.certifications.includes(c)
                  ? 'bg-sage-500 border-sage-500 text-white'
                  : 'bg-white border-cream-400 text-warm-600 hover:border-sage-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
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

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 pb-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Avbryt
        </button>
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? 'Sparar…' : 'Spara'}
        </button>
      </div>
    </form>
  )
}
