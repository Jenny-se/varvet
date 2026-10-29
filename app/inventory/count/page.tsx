'use client'

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Check, Minus, Plus, ClipboardCheck, AlertTriangle, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { InventoryItem, InventoryCategory, Stocktake, StocktakeCount } from '@/lib/types'
import { logActivity } from '@/lib/activity'
import { useAuth } from '@/components/auth/AuthProvider'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

const CATEGORY_LABELS: Record<InventoryCategory, string> = { yarn: 'Garn', needles: 'Stickor', accessories: 'Tillbehör' }
const REFRESH_MS = 20000

type ShowFilter = 'all' | 'uncounted' | 'diff'

// Garn med färger grupperas per garn, övrigt per kategori
function groupOf(item: InventoryItem) {
  return item.colorway ? item.product_name : CATEGORY_LABELS[item.category]
}

function labelOf(item: InventoryItem) {
  return item.colorway ?? item.product_name
}

export default function StocktakePage() {
  const { session } = useAuth()
  const userEmail = session?.user?.email ?? null

  const [items, setItems] = useState<InventoryItem[]>([])
  const [stocktake, setStocktake] = useState<Stocktake | null>(null)
  const [history, setHistory] = useState<Stocktake[]>([])
  const [counts, setCounts] = useState<Record<string, StocktakeCount>>({})
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [group, setGroup] = useState('')
  const [show, setShow] = useState<ShowFilter>('all')

  const [showReview, setShowReview] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [applying, setApplying] = useState(false)
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null)

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const pending = useRef<Set<string>>(new Set())

  const fetchCounts = useCallback(async (stocktakeId: string) => {
    const { data } = await supabase.from('stocktake_counts').select('*').eq('stocktake_id', stocktakeId)
    setCounts(prev => {
      const next: Record<string, StocktakeCount> = {}
      for (const c of (data as StocktakeCount[]) ?? []) next[c.inventory_id] = c
      // Behåll egna ändringar som inte hunnit sparas
      for (const id of Array.from(pending.current)) if (prev[id]) next[id] = prev[id]
      return next
    })
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [{ data: itemData }, { data: stData }] = await Promise.all([
      supabase.from('inventory').select('*').eq('active', true).order('product_name'),
      supabase.from('stocktakes').select('*').order('created_at', { ascending: false }).limit(10),
    ])
    const list = (stData as Stocktake[]) ?? []
    const open = list.find(s => s.status === 'open') ?? null
    setItems((itemData as InventoryItem[]) ?? [])
    setStocktake(open)
    setHistory(list.filter(s => s.status !== 'open'))
    if (open) await fetchCounts(open.id)
    else setCounts({})
    setLoading(false)
  }, [fetchCounts])

  useEffect(() => { fetchData() }, [fetchData])

  // Hämta andras räkningar regelbundet när flera räknar samtidigt
  useEffect(() => {
    if (!stocktake) return
    const t = setInterval(() => fetchCounts(stocktake.id), REFRESH_MS)
    return () => clearInterval(t)
  }, [stocktake, fetchCounts])

  const itemById = useMemo(() => Object.fromEntries(items.map(i => [i.id, i])), [items])

  const groups = useMemo(() => {
    const names: string[] = []
    for (const i of items) { const g = groupOf(i); if (!names.includes(g)) names.push(g) }
    return names
  }, [items])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter(i => {
      if (group && groupOf(i) !== group) return false
      if (q && !i.product_name.toLowerCase().includes(q) &&
          !(i.colorway?.toLowerCase().includes(q)) &&
          !(i.sku?.toLowerCase().includes(q))) return false
      const c = counts[i.id]
      if (show === 'uncounted' && c) return false
      if (show === 'diff' && (!c || c.counted_qty === c.system_qty)) return false
      return true
    })
  }, [items, counts, search, group, show])

  const grouped = useMemo(() => {
    const map = new Map<string, InventoryItem[]>()
    for (const i of filtered) {
      const g = groupOf(i)
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(i)
    }
    return Array.from(map.entries())
  }, [filtered])

  const countedTotal = Object.keys(counts).filter(id => itemById[id]).length
  const deviations = useMemo(() =>
    Object.values(counts)
      .filter(c => itemById[c.inventory_id] && c.counted_qty !== c.system_qty)
      .map(c => {
        const item = itemById[c.inventory_id]
        const diff = c.counted_qty - c.system_qty
        return { item, count: c, diff, value: diff * (item.cost_price ?? 0) }
      })
      .sort((a, b) => a.item.product_name.localeCompare(b.item.product_name, 'sv') ||
        labelOf(a.item).localeCompare(labelOf(b.item), 'sv'))
  , [counts, itemById])
  const deviationValue = deviations.reduce((sum, d) => sum + d.value, 0)

  async function startStocktake() {
    setError(null)
    const name = `Inventering ${new Date().toLocaleDateString('sv-SE')}`
    const { data, error } = await supabase.from('stocktakes')
      .insert({ name, created_by: userEmail }).select().single()
    if (error) { setError('Kunde inte starta inventeringen. Pågår redan en?'); return }
    await logActivity('Startade inventering', 'stocktake', data.id, name)
    setAppliedMessage(null)
    fetchData()
  }

  function saveCount(item: InventoryItem, qty: number | null) {
    if (!stocktake) return
    const id = item.id
    pending.current.add(id)
    if (qty === null) {
      setCounts(prev => { const n = { ...prev }; delete n[id]; return n })
    } else {
      setCounts(prev => ({
        ...prev,
        [id]: {
          ...(prev[id] ?? { id: '', stocktake_id: stocktake.id, inventory_id: id, counted_at: '' }),
          counted_qty: qty,
          system_qty: prev[id]?.system_qty ?? item.quantity_in_stock,
          counted_by: userEmail,
        } as StocktakeCount,
      }))
    }
    clearTimeout(timers.current[id])
    timers.current[id] = setTimeout(async () => {
      setSaving(s => ({ ...s, [id]: true }))
      const { error } = qty === null
        ? await supabase.from('stocktake_counts').delete().eq('stocktake_id', stocktake.id).eq('inventory_id', id)
        : await supabase.from('stocktake_counts').upsert({
            stocktake_id: stocktake.id,
            inventory_id: id,
            counted_qty: qty,
            // Saldot i appen just nu, så att försäljning efter räkningen räknas med
            system_qty: item.quantity_in_stock,
            counted_by: userEmail,
            counted_at: new Date().toISOString(),
          }, { onConflict: 'stocktake_id,inventory_id' })
      pending.current.delete(id)
      setSaving(s => { const n = { ...s }; delete n[id]; return n })
      if (error) setError(`Kunde inte spara ${item.product_name} ${item.colorway ?? ''}. Försök igen.`)
    }, 400)
  }

  // Markera alla oräknade i gruppen (som visas just nu) med appens saldo
  function confirmRest(list: InventoryItem[]) {
    for (const item of list) {
      if (!counts[item.id] && drafts[item.id] === undefined) saveCount(item, item.quantity_in_stock)
    }
  }

  function commitDraft(item: InventoryItem) {
    const raw = drafts[item.id]
    if (raw === undefined) return
    setDrafts(d => { const n = { ...d }; delete n[item.id]; return n })
    if (raw.trim() === '') { saveCount(item, null); return }
    const n = parseInt(raw, 10)
    if (!isNaN(n) && n >= 0) saveCount(item, n)
  }

  async function applyStocktake() {
    if (!stocktake) return
    setApplying(true)
    setError(null)
    // Vänta in räkningar som inte hunnit sparas (högst några sekunder)
    for (let i = 0; i < 25 && pending.current.size > 0; i++) await new Promise(r => setTimeout(r, 200))
    if (pending.current.size > 0) { setApplying(false); setError('Några räkningar sparas fortfarande. Försök igen om en stund.'); return }
    const { data, error } = await supabase.rpc('apply_stocktake', { p_stocktake_id: stocktake.id })
    setApplying(false)
    if (error) { setError('Kunde inte uppdatera lagret: ' + error.message); return }
    await logActivity('Godkände inventering', 'stocktake', stocktake.id, `${stocktake.name} – ${data} saldon ändrade`)
    setShowReview(false)
    setAppliedMessage(`Lagret är uppdaterat. ${data} saldon ändrades.`)
    fetchData()
  }

  async function cancelStocktake() {
    if (!stocktake) return
    await supabase.from('stocktakes').update({ status: 'cancelled' }).eq('id', stocktake.id)
    await logActivity('Avbröt inventering', 'stocktake', stocktake.id, stocktake.name)
    setConfirmCancel(false)
    fetchData()
  }

  if (loading) {
    return <div className="p-6 md:p-8 max-w-3xl mx-auto text-sm text-warm-500">Laddar…</div>
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto pb-32">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/inventory" className="p-1.5 rounded-lg text-warm-500 hover:bg-cream-200">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-semibold text-warm-900">Inventering</h1>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {appliedMessage && (
        <div className="bg-sage-50 border border-sage-200 text-sage-800 text-sm rounded-xl px-4 py-3 mb-4">
          {appliedMessage}
        </div>
      )}

      {!stocktake ? (
        <div className="card p-6">
          <p className="text-sm text-warm-600 mb-4">
            Starta en inventering och räkna artiklarna, gärna på mobilen vid hyllorna.
            Flera kan räkna samtidigt. Lagret ändras först när ni godkänner inventeringen.
          </p>
          <button onClick={startStocktake} className="btn-primary flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" />
            Starta inventering
          </button>

          {history.length > 0 && (
            <div className="mt-6">
              <p className="label">Tidigare inventeringar</p>
              <ul className="divide-y divide-linen-100 text-sm">
                {history.map(s => (
                  <li key={s.id} className="py-2 flex justify-between gap-3">
                    <span className="text-warm-800">{s.name}</span>
                    <span className="text-warm-400">
                      {s.status === 'applied'
                        ? `Godkänd ${new Date(s.applied_at!).toLocaleDateString('sv-SE')}`
                        : 'Avbruten'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="card p-4 mb-4">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-sm font-medium text-warm-900">{stocktake.name}</p>
              <p className="text-sm text-warm-500 tabular-nums">{countedTotal} / {items.length} räknade</p>
            </div>
            <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
              <div className="h-full bg-sage-500 transition-all" style={{ width: `${items.length ? (countedTotal / items.length) * 100 : 0}%` }} />
            </div>
            <p className="text-xs text-warm-400 mt-2">
              {deviations.length} avvikelser · Allt sparas direkt. Andras räkningar hämtas automatiskt.
            </p>
          </div>

          {/* Filters */}
          <div className="sticky top-0 z-10 bg-cream-100 pb-3 pt-1 space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                <input className="input-field pl-9" placeholder="Sök färg, garn eller artikelnummer…"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="input-field w-40" value={group} onChange={e => setGroup(e.target.value)}>
                <option value="">Alla</option>
                {groups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex bg-white border border-linen-200 rounded-lg p-0.5 gap-0.5 w-max">
              {([['all', 'Alla'], ['uncounted', 'Oräknade'], ['diff', 'Avvikelser']] as [ShowFilter, string][]).map(([v, l]) => (
                <button key={v} onClick={() => setShow(v)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    show === v ? 'bg-sage-100 text-sage-700' : 'text-warm-500 hover:text-warm-700'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Count list */}
          {grouped.length === 0 ? (
            <p className="text-sm text-warm-500 py-8 text-center">Inga artiklar matchar filtret.</p>
          ) : grouped.map(([g, list]) => (
            <section key={g} className="mb-4">
              <div className="flex items-center justify-between px-1 mb-1.5">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-warm-500">{g}</h2>
                {list.some(i => !counts[i.id]) && (
                  <button type="button" onClick={() => confirmRest(list)}
                    className="flex items-center gap-1 text-xs font-medium text-sage-700 hover:text-sage-800 px-2 py-1 rounded-md hover:bg-sage-50">
                    <Check className="w-3.5 h-3.5" />
                    Resten stämmer
                  </button>
                )}
              </div>
              <div className="bg-white rounded-xl border border-linen-200 divide-y divide-linen-100">
                {list.map(item => {
                  const c = counts[item.id]
                  const draft = drafts[item.id]
                  const value = draft ?? (c ? String(c.counted_qty) : '')
                  const diff = c ? c.counted_qty - c.system_qty : 0
                  return (
                    <div key={item.id} className={`flex items-center gap-2 px-3 py-2.5 ${c ? (diff !== 0 ? 'bg-amber-50/60' : 'bg-sage-50/50') : ''}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-warm-900 truncate">{labelOf(item)}</p>
                        <p className="text-xs text-warm-400">
                          I appen: <span className="tabular-nums">{item.quantity_in_stock}</span>
                          {c && diff !== 0 && (
                            <span className="ml-2 font-semibold text-amber-700 tabular-nums">{diff > 0 ? '+' : ''}{diff}</span>
                          )}
                          {saving[item.id] && <span className="ml-2 text-warm-300">sparar…</span>}
                        </p>
                      </div>
                      <button type="button" aria-label="Minska"
                        onClick={() => saveCount(item, Math.max(0, (c?.counted_qty ?? item.quantity_in_stock) - 1))}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-cream-400 text-warm-600 active:bg-cream-200">
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="text" inputMode="numeric" pattern="[0-9]*" aria-label={`Antal ${labelOf(item)}`}
                        className="w-14 h-9 text-center border border-cream-400 rounded-lg text-base font-semibold tabular-nums placeholder:font-normal placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-sage-300"
                        placeholder={String(item.quantity_in_stock)}
                        value={value}
                        onChange={e => setDrafts(d => ({ ...d, [item.id]: e.target.value.replace(/[^0-9]/g, '') }))}
                        onBlur={() => commitDraft(item)}
                        onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                      />
                      <button type="button" aria-label="Öka"
                        onClick={() => saveCount(item, (c?.counted_qty ?? item.quantity_in_stock) + 1)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-cream-400 text-warm-600 active:bg-cream-200">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button type="button" aria-label="Stämmer med appen" title="Stämmer med appen"
                        onClick={() => saveCount(item, item.quantity_in_stock)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg border ${
                          c && diff === 0 ? 'bg-sage-500 border-sage-500 text-white' : 'border-sage-300 text-sage-600 active:bg-sage-100'}`}>
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}

          {/* Bottom bar */}
          <div className="fixed bottom-0 left-0 right-0 md:left-56 bg-white border-t border-linen-200 px-4 py-3 flex items-center gap-3 z-20">
            <button onClick={() => setConfirmCancel(true)} className="btn-secondary">Avbryt</button>
            <button onClick={() => setShowReview(true)} disabled={countedTotal === 0}
              className="btn-primary flex-1 disabled:opacity-50">
              Granska och godkänn ({countedTotal})
            </button>
          </div>
        </>
      )}

      {showReview && stocktake && (
        <Modal title="Granska inventeringen" onClose={() => setShowReview(false)} size="lg">
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-cream-100 rounded-lg p-3">
                <p className="text-xs text-warm-500">Räknade</p>
                <p className="text-lg font-semibold tabular-nums">{countedTotal}</p>
              </div>
              <div className="bg-cream-100 rounded-lg p-3">
                <p className="text-xs text-warm-500">Avvikelser</p>
                <p className="text-lg font-semibold tabular-nums">{deviations.length}</p>
              </div>
              <div className="bg-cream-100 rounded-lg p-3">
                <p className="text-xs text-warm-500">Värde (inköp)</p>
                <p className={`text-lg font-semibold tabular-nums ${deviationValue < 0 ? 'text-red-600' : ''}`}>
                  {Math.round(deviationValue).toLocaleString('sv-SE')} kr
                </p>
              </div>
            </div>

            {deviations.length > 0 ? (
              <div className="max-h-80 overflow-y-auto border border-linen-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-linen-100 text-xs text-warm-500">
                      <th className="text-left px-3 py-2 font-medium">Artikel</th>
                      <th className="text-right px-2 py-2 font-medium">Appen</th>
                      <th className="text-right px-2 py-2 font-medium">Räknat</th>
                      <th className="text-right px-3 py-2 font-medium">Diff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-linen-50">
                    {deviations.map(({ item, count, diff }) => (
                      <tr key={item.id}>
                        <td className="px-3 py-1.5">
                          <span className="text-warm-900">{item.colorway ? `${item.product_name} – ${item.colorway}` : item.product_name}</span>
                        </td>
                        <td className="px-2 py-1.5 text-right tabular-nums text-warm-500">{count.system_qty}</td>
                        <td className="px-2 py-1.5 text-right tabular-nums">{count.counted_qty}</td>
                        <td className={`px-3 py-1.5 text-right tabular-nums font-semibold ${diff < 0 ? 'text-red-600' : 'text-sage-700'}`}>
                          {diff > 0 ? '+' : ''}{diff}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-warm-600">Inga avvikelser – allt som räknats stämmer med appen.</p>
            )}

            <p className="text-xs text-warm-500">
              {items.length - countedTotal > 0 && <>{items.length - countedTotal} artiklar är inte räknade och lämnas orörda. </>}
              Säljs något efter att det räknats dras det av från det räknade antalet.
            </p>

            <div className="flex justify-end gap-3 pt-2 pb-2">
              <button onClick={() => setShowReview(false)} className="btn-secondary">Fortsätt räkna</button>
              <button onClick={applyStocktake} disabled={applying} className="btn-primary disabled:opacity-60">
                {applying ? 'Uppdaterar…' : 'Godkänn och uppdatera lagret'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {confirmCancel && (
        <ConfirmDialog
          title="Avbryt inventering"
          message="Inventeringen avslutas utan att lagret ändras. Det ni har räknat förs inte in. Vill du avbryta?"
          confirmLabel="Avbryt inventeringen"
          danger
          onConfirm={cancelStocktake}
          onCancel={() => setConfirmCancel(false)}
        />
      )}
    </div>
  )
}
