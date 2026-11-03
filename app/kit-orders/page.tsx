'use client'

import { useEffect, useState, useCallback } from 'react'
import { ShoppingBag, Mail, Phone, MapPin, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { KitOrder, KitOrderStatus } from '@/lib/types'
import { logActivity } from '@/lib/activity'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'

const STATUS_LABELS: Record<KitOrderStatus, string> = {
  ny: 'Ny',
  bekraftad: 'Bekräftad',
  skickad: 'Skickad',
  hamtad: 'Hämtad',
  avbruten: 'Avbruten',
}

const STATUS_COLORS: Record<KitOrderStatus, string> = {
  ny: 'bg-amber-100 text-amber-800',
  bekraftad: 'bg-sky-100 text-sky-800',
  skickad: 'bg-sage-100 text-sage-700',
  hamtad: 'bg-sage-100 text-sage-700',
  avbruten: 'bg-cream-200 text-warm-500',
}

const STATUS_ORDER: KitOrderStatus[] = ['ny', 'bekraftad', 'skickad', 'hamtad', 'avbruten']

const KIT_LABELS: Record<string, string> = { 'haugvag-chamotte': 'Haugvag i Chamotte' }

function orderLines(o: KitOrder) {
  return [
    [o.qty_dark, 'Chamotte mörk'],
    [o.qty_mid, 'Chamotte mellan'],
    [o.qty_light, 'Chamotte ljus'],
    [o.qty_accent, 'Accentfärg 20 g'],
    [o.qty_book, 'Boken Ön och skogen'],
  ].filter(([n]) => (n as number) > 0) as [number, string][]
}

export default function KitOrdersPage() {
  const [orders, setOrders] = useState<KitOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<KitOrderStatus | 'open' | 'all'>('open')
  const [openId, setOpenId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<KitOrder | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('kit_orders').select('*').order('created_at', { ascending: false })
    setOrders((data as KitOrder[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  async function setStatus(order: KitOrder, status: KitOrderStatus) {
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status } : o))
    const { error } = await supabase.from('kit_orders')
      .update({ status, updated_at: new Date().toISOString() }).eq('id', order.id)
    if (error) { fetchOrders(); return }
    await logActivity(`Kitbeställning: ${STATUS_LABELS[status]}`, 'kit_order', order.id, order.name)
  }

  async function handleDelete() {
    if (!deleting) return
    const { error } = await supabase.from('kit_orders').delete().eq('id', deleting.id)
    if (!error) await logActivity('Raderade kitbeställning', 'kit_order', deleting.id, deleting.name)
    setDeleting(null)
    fetchOrders()
  }

  const isOpen = (o: KitOrder) => o.status === 'ny' || o.status === 'bekraftad'
  const filtered = orders.filter(o =>
    filter === 'all' ? true : filter === 'open' ? isOpen(o) : o.status === filter)

  const active = orders.filter(o => o.status !== 'avbruten')
  const totals = {
    dark: active.reduce((s, o) => s + o.qty_dark, 0),
    mid: active.reduce((s, o) => s + o.qty_mid, 0),
    light: active.reduce((s, o) => s + o.qty_light, 0),
    accent: active.reduce((s, o) => s + o.qty_accent, 0),
    book: active.reduce((s, o) => s + o.qty_book, 0),
    sek: active.reduce((s, o) => s + Number(o.total_sek), 0),
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-warm-900">Kitbeställningar</h1>
        <p className="text-sm text-warm-500 mt-1">Beställningar från formuläret på hemsidan.</p>
      </div>

      {/* Totals, so you know how much yarn and how many books to set aside */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-5">
        {([
          ['Nya', orders.filter(o => o.status === 'ny').length, 'att bekräfta'],
          ['Chamotte mörk', totals.dark, 'härvor'],
          ['Chamotte mellan', totals.mid, 'härvor'],
          ['Chamotte ljus', totals.light, 'härvor'],
          ['Accent / böcker', `${totals.accent} / ${totals.book}`, 'st'],
          ['Summa', Math.round(totals.sek).toLocaleString('sv-SE'), 'kr exkl. frakt'],
        ] as [string, string | number, string][]).map(([label, value, sub]) => (
          <div key={label} className="bg-white border border-linen-200 rounded-xl p-3">
            <p className="text-xs text-warm-400 mb-1">{label}</p>
            <p className="text-xl font-semibold text-warm-900 tabular-nums">{value}</p>
            <p className="text-xs text-warm-400">{sub}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-warm-400 -mt-3 mb-5">Antalen gäller alla beställningar utom avbrutna.</p>

      {/* Filter */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {([['open', 'Att hantera'], ...STATUS_ORDER.map(s => [s, STATUS_LABELS[s]]), ['all', 'Alla']] as [string, string][]).map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v as typeof filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              filter === v ? 'bg-sage-100 text-sage-700 border-sage-200' : 'bg-white text-warm-600 border-linen-200 hover:bg-cream-100'}`}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-warm-500">Laddar…</p>
      ) : filtered.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="Inga beställningar här"
          description={orders.length ? 'Välj ett annat filter för att se fler.' : 'När någon beställer via hemsidan dyker det upp här.'} />
      ) : (
        <div className="space-y-3">
          {filtered.map(o => {
            const open = openId === o.id
            const lines = orderLines(o)
            return (
              <div key={o.id} className="card overflow-hidden">
                <button onClick={() => setOpenId(open ? null : o.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-cream-50">
                  <span className={`badge ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-warm-900 truncate">{o.name}</p>
                    <p className="text-xs text-warm-400 truncate">
                      {new Date(o.created_at).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })}
                      {' · '}{KIT_LABELS[o.kit_slug] ?? o.kit_slug}
                      {' · '}{o.delivery === 'skicka' ? 'Skickas' : 'Hämtas'}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-warm-900">{Number(o.total_sek).toLocaleString('sv-SE')} kr</span>
                  {open ? <ChevronUp className="w-4 h-4 text-warm-400" /> : <ChevronDown className="w-4 h-4 text-warm-400" />}
                </button>

                {open && (
                  <div className="border-t border-linen-100 px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                    <div>
                      <p className="label">Beställning</p>
                      <ul className="space-y-1 mb-3">
                        {lines.map(([n, l]) => (
                          <li key={l} className="flex justify-between gap-3">
                            <span className="text-warm-800">{l}</span>
                            <span className="tabular-nums font-medium">{n} st</span>
                          </li>
                        ))}
                      </ul>
                      {o.accent_colors && <p className="text-warm-600"><span className="text-warm-400">Accentfärg:</span> {o.accent_colors}</p>}
                      {o.size && <p className="text-warm-600"><span className="text-warm-400">Storlek:</span> {o.size}</p>}
                      {o.message && <p className="text-warm-600 mt-2 whitespace-pre-line"><span className="text-warm-400">Meddelande:</span> {o.message}</p>}
                      <p className="text-xs text-warm-400 mt-2">{o.delivery === 'skicka' ? 'Frakt tillkommer.' : 'Hämtas i studion.'}</p>
                    </div>
                    <div>
                      <p className="label">Kund</p>
                      <p className="flex items-center gap-2 text-warm-800 mb-1">
                        <Mail className="w-3.5 h-3.5 text-warm-400" />
                        <a className="underline underline-offset-2"
                          href={`mailto:${o.email}?subject=${encodeURIComponent('Din beställning hos Varvet – Haugvag')}`}>{o.email}</a>
                      </p>
                      {o.phone && (
                        <p className="flex items-center gap-2 text-warm-800 mb-1">
                          <Phone className="w-3.5 h-3.5 text-warm-400" />
                          <a href={`tel:${o.phone}`}>{o.phone}</a>
                        </p>
                      )}
                      {o.address && (
                        <p className="flex items-start gap-2 text-warm-800">
                          <MapPin className="w-3.5 h-3.5 text-warm-400 mt-0.5" />{o.address}
                        </p>
                      )}

                      <p className="label mt-4">Status</p>
                      <div className="flex flex-wrap gap-1.5">
                        {STATUS_ORDER.map(s => (
                          <button key={s} onClick={() => setStatus(o, s)}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                              o.status === s ? 'bg-sage-500 text-white border-sage-500' : 'bg-white text-warm-600 border-linen-200 hover:bg-cream-100'}`}>
                            {STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => setDeleting(o)}
                        className="mt-4 flex items-center gap-1.5 text-xs text-warm-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" /> Ta bort (t.ex. testbeställning)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {deleting && (
        <ConfirmDialog
          title="Ta bort beställning"
          message={`Vill du ta bort beställningen från ${deleting.name}? Det går inte att ångra. Använd hellre status Avbruten för riktiga beställningar.`}
          confirmLabel="Ta bort"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
