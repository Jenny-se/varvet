'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Expense, Supplier } from '@/lib/types'
import { logActivity } from '@/lib/activity'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns'
import { sv } from 'date-fns/locale'
import { Plus, Trash2, CheckCircle2, Circle, Receipt, TrendingDown, X } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const PRESET_CATEGORIES = ['Hyra', 'Garn', 'Accessoarer', 'Representation']

function formatAmount(amount: number) {
  return amount.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kr'
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form state
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(PRESET_CATEGORIES[0])
  const [customCategory, setCustomCategory] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [paid, setPaid] = useState(false)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const isCustom = category === 'Egen'
  const effectiveCategory = isCustom ? customCategory.trim() : category

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [{ data: expData }, { data: supData }] = await Promise.all([
      supabase.from('expenses').select('*').order('date', { ascending: false }),
      supabase.from('suppliers').select('id, company_name').order('company_name'),
    ])
    setExpenses((expData as Expense[]) ?? [])
    setSuppliers((supData as Supplier[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  function resetForm() {
    setAmount('')
    setDescription('')
    setCategory(PRESET_CATEGORIES[0])
    setCustomCategory('')
    setSupplierId('')
    setPaid(false)
    setDate(format(new Date(), 'yyyy-MM-dd'))
    setFormError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(amount.replace(',', '.'))
    if (isNaN(parsed) || parsed <= 0) { setFormError('Ange ett giltigt belopp'); return }
    if (isCustom && !customCategory.trim()) { setFormError('Ange en kategori'); return }
    setSaving(true)
    setFormError(null)
    const { data, error } = await supabase.from('expenses').insert({
      amount: parsed,
      description: description.trim() || null,
      category: effectiveCategory,
      supplier_id: supplierId || null,
      paid,
      date,
    }).select().single()
    if (error) {
      setFormError('Kunde inte spara utgiften')
    } else if (data) {
      await logActivity('Lade till utgift', 'expense', data.id, effectiveCategory)
      setExpenses(prev => [data as Expense, ...prev])
      setShowForm(false)
      resetForm()
    }
    setSaving(false)
  }

  async function togglePaid(expense: Expense) {
    const { data } = await supabase
      .from('expenses')
      .update({ paid: !expense.paid })
      .eq('id', expense.id)
      .select()
      .single()
    if (data) setExpenses(prev => prev.map(e => e.id === expense.id ? data as Expense : e))
  }

  async function handleDelete() {
    if (!deletingId) return
    const exp = expenses.find(e => e.id === deletingId)
    await supabase.from('expenses').delete().eq('id', deletingId)
    if (exp) await logActivity('Raderade utgift', 'expense', deletingId, exp.category)
    setExpenses(prev => prev.filter(e => e.id !== deletingId))
    setDeletingId(null)
  }

  // Monthly chart data — last 6 months
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(new Date(), 5 - i)
    const start = startOfMonth(month)
    const end = endOfMonth(month)
    const total = expenses
      .filter(e => {
        const d = parseISO(e.date)
        return d >= start && d <= end
      })
      .reduce((sum, e) => sum + Number(e.amount), 0)
    return {
      month: format(month, 'MMM', { locale: sv }),
      total: Math.round(total),
    }
  })

  const totalUnpaid = expenses.filter(e => !e.paid).reduce((s, e) => s + Number(e.amount), 0)
  const totalAll = expenses.reduce((s, e) => s + Number(e.amount), 0)

  const supplierMap = Object.fromEntries(suppliers.map(s => [s.id, s.company_name]))

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Utgifter</h1>
          <p className="text-sm text-warm-500 mt-0.5">{expenses.length} poster</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Lägg till
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-xs text-warm-500 mb-1">Totalt (alla)</p>
          <p className="text-xl font-bold text-warm-900">{formatAmount(totalAll)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-warm-500 mb-1">Obetalt</p>
          <p className={`text-xl font-bold ${totalUnpaid > 0 ? 'text-red-600' : 'text-sage-600'}`}>
            {formatAmount(totalUnpaid)}
          </p>
        </div>
      </div>

      {/* Monthly chart */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-4 h-4 text-bark-500" />
          <h2 className="text-sm font-semibold text-warm-900">Utgifter per månad</h2>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d8" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9c8f85' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9c8f85' }} axisLine={false} tickLine={false} width={60}
              tickFormatter={v => v.toLocaleString('sv-SE')} />
            <Tooltip
              formatter={(v) => [formatAmount(Number(v)), 'Summa']}
              contentStyle={{ borderRadius: 8, border: '1px solid #e8e0d8', fontSize: 12 }}
            />
            <Bar dataKey="total" fill="#8aab94" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card p-5 mb-6 border-sage-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-warm-900">Ny utgift</h2>
            <button onClick={() => { setShowForm(false); resetForm() }} className="text-warm-400 hover:text-warm-700">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Belopp (kr) *</label>
                <input
                  className="input-field"
                  placeholder="0,00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Datum</label>
                <input
                  type="date"
                  className="input-field"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label">Beskrivning</label>
              <input
                className="input-field"
                placeholder="Valfri beskrivning…"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Kategori</label>
                <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
                  {PRESET_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  <option value="Egen">Egen…</option>
                </select>
              </div>
              {isCustom && (
                <div>
                  <label className="label">Egen kategori</label>
                  <input
                    className="input-field"
                    placeholder="T.ex. Frakt"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                  />
                </div>
              )}
              {!isCustom && (
                <div>
                  <label className="label">Leverantör</label>
                  <select className="input-field" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                    <option value="">– Ingen –</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.company_name}</option>)}
                  </select>
                </div>
              )}
            </div>
            {isCustom && (
              <div>
                <label className="label">Leverantör</label>
                <select className="input-field" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                  <option value="">– Ingen –</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.company_name}</option>)}
                </select>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="paid"
                checked={paid}
                onChange={e => setPaid(e.target.checked)}
                className="rounded border-cream-400 text-sage-600 focus:ring-sage-500"
              />
              <label htmlFor="paid" className="text-sm text-warm-700">Markera som betald</label>
            </div>
            {formError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>
            )}
            <div className="flex gap-3 justify-end pt-1">
              <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); resetForm() }}>Avbryt</button>
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? 'Sparar…' : 'Spara'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <div key={i} className="card h-14 animate-pulse bg-cream-200" />)}
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-12">
          <Receipt className="w-10 h-10 text-warm-300 mx-auto mb-2" />
          <p className="text-sm text-warm-400">Inga utgifter registrerade</p>
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map(exp => (
            <div key={exp.id} className="card p-4 flex items-center gap-4 group hover:shadow-md transition-shadow">
              <button onClick={() => togglePaid(exp)} className="flex-shrink-0" title={exp.paid ? 'Markera som obetald' : 'Markera som betald'}>
                {exp.paid
                  ? <CheckCircle2 className="w-5 h-5 text-sage-500" />
                  : <Circle className="w-5 h-5 text-warm-300 hover:text-sage-400 transition-colors" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-warm-900">{formatAmount(Number(exp.amount))}</span>
                  <span className="text-xs bg-cream-200 text-warm-600 px-2 py-0.5 rounded-full">{exp.category}</span>
                  {exp.supplier_id && supplierMap[exp.supplier_id] && (
                    <span className="text-xs text-warm-500">{supplierMap[exp.supplier_id]}</span>
                  )}
                  {!exp.paid && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Obetald</span>
                  )}
                </div>
                {exp.description && (
                  <p className="text-xs text-warm-500 mt-0.5 truncate">{exp.description}</p>
                )}
                <p className="text-xs text-warm-400 mt-0.5">
                  {format(parseISO(exp.date), 'd MMM yyyy', { locale: sv })}
                </p>
              </div>
              <button
                onClick={() => setDeletingId(exp.id)}
                className="p-1.5 rounded-lg text-warm-300 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                title="Radera"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {deletingId && (
        <ConfirmDialog
          title="Radera utgift"
          message="Utgiften raderas permanent. Är du säker?"
          confirmLabel="Radera"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
