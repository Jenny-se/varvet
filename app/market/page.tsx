'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { TrendingUp, ShoppingCart, Copy, Check, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { supabase } from '@/lib/supabase'
import { InventoryItem } from '@/lib/types'
import {
  MARKET_YARNS, MarketColorStats, MarketWeek, OrderSettings, DEFAULT_SETTINGS,
  matchColor, recommend, Recommendation,
} from '@/lib/market'

const SETTINGS_KEY = 'varvet-market-settings'
const AXIS = { fontSize: 12, fill: '#9c8f85' }
const fmt = (n: number, d = 1) => n.toLocaleString('sv-SE', { maximumFractionDigits: d })

function loadSettings(): OrderSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch { return DEFAULT_SETTINGS }
}

export default function MarketPage() {
  const [yarnUrl, setYarnUrl] = useState(MARKET_YARNS[0].url)
  const [stats, setStats] = useState<MarketColorStats[]>([])
  const [weeks, setWeeks] = useState<MarketWeek[]>([])
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<OrderSettings>(DEFAULT_SETTINGS)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [history, setHistory] = useState<{ date: string; quantity: number }[]>([])
  const [copied, setCopied] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const yarn = MARKET_YARNS.find(y => y.url === yarnUrl)!

  useEffect(() => { setSettings(loadSettings()) }, [])

  function updateSettings(patch: Partial<OrderSettings>) {
    const next = { ...settings, ...patch }
    setSettings(next)
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)) } catch { /* inställningen sparas bara för sessionen */ }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [{ data: s }, { data: w }, { data: inv }] = await Promise.all([
      supabase.from('market_color_stats').select('*'),
      supabase.from('market_weekly').select('*').order('week'),
      supabase.from('inventory').select('*').eq('active', true),
    ])
    setStats((s as MarketColorStats[]) ?? [])
    setWeeks((w as MarketWeek[]) ?? [])
    setItems((inv as InventoryItem[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    setSelectedColor(null)
    setShowAll(false)
  }, [yarnUrl])

  useEffect(() => {
    if (!selectedColor) { setHistory([]); return }
    supabase.from('market_daily').select('snapshot_date, quantity')
      .eq('product_url', yarnUrl).eq('color_number', selectedColor).order('snapshot_date')
      .then(({ data }) => setHistory((data ?? []).map(r => ({ date: r.snapshot_date.slice(5), quantity: r.quantity }))))
  }, [selectedColor, yarnUrl])

  const ourItems = useMemo(
    () => items.filter(i => yarn.productName && i.product_name === yarn.productName),
    [items, yarn],
  )

  const recs: Recommendation[] = useMemo(() =>
    stats.filter(s => s.product_url === yarnUrl)
      .map(s => recommend(s, yarn.productName ? matchColor(s, ourItems) : null, settings))
      .sort((a, b) => b.marketRate - a.marketRate)
  , [stats, yarnUrl, yarn, ourItems, settings])

  const chartWeeks = weeks.filter(w => w.product_url === yarnUrl)
    // Första veckan är ofullständig (mätningen började mitt i veckan)
    .slice(1)
    .map(w => ({ week: w.week.slice(5), sold: w.sold }))

  const totalRate = recs.reduce((sum, r) => sum + r.marketRate, 0)
  const toOrder = recs.filter(r => r.order > 0).sort((a, b) => b.order - a.order || b.marketRate - a.marketRate)
  const orderUnits = toOrder.reduce((sum, r) => sum + r.order, 0)
  const orderCost = toOrder.reduce((sum, r) => sum + r.order * (r.item?.cost_price ?? 0), 0)
  const missingInRange = yarn.productName ? recs.filter(r => !r.item && r.marketRate >= 1).slice(0, 8) : []
  const slowMovers = recs.filter(r => r.item && r.marketRate < 0.5 && (r.item.quantity_in_stock ?? 0) > 0)
    .sort((a, b) => a.marketRate - b.marketRate)
  const matchedIds = new Set(recs.map(r => r.item?.id).filter(Boolean))
  const notAtMarket = ourItems.filter(i => !matchedIds.has(i.id))

  async function copyOrder() {
    const lines = toOrder.map(r => `${r.item!.sku ?? ''}\t${r.item!.colorway ?? r.item!.product_name}\t${r.order} st`)
    const text = `Beställning ${yarn.label}\n${lines.join('\n')}\nTotalt ${orderUnits} st`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* urklipp ej tillgängligt */ }
  }

  if (loading) {
    return <div className="p-6 md:p-8 max-w-6xl mx-auto text-sm text-warm-500">Laddar…</div>
  }

  if (stats.length === 0) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <h1 className="text-xl font-semibold text-warm-900 mb-4">Marknadsdata</h1>
        <div className="card p-6 text-sm text-warm-600">
          Ingen marknadsdata hittades. Har skript <code>022_market_views.sql</code> körts i Supabase?
        </div>
      </div>
    )
  }

  const visible = showAll ? recs : recs.slice(0, 20)

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-warm-900">Marknadsdata</h1>
        <p className="text-sm text-warm-500 mt-1">
          Uppskattad försäljning hos garnr.se, beräknad från hur deras lager minskar. Uppdateras varje morgon.
        </p>
      </div>

      {/* Yarn tabs */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {MARKET_YARNS.map(y => (
          <button key={y.url} onClick={() => setYarnUrl(y.url)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              y.url === yarnUrl ? 'bg-sage-100 text-sage-700 border-sage-200' : 'bg-white text-warm-600 border-linen-200 hover:bg-cream-100'}`}>
            {y.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white border border-linen-200 rounded-xl p-4">
          <p className="text-xs text-warm-400 mb-1">Garnr säljer</p>
          <p className="text-2xl font-semibold text-warm-900 tabular-nums">{fmt(totalRate, 0)} <span className="text-base font-normal text-warm-500">st/v</span></p>
          <p className="text-xs text-warm-400 mt-0.5">senaste 4 veckorna</p>
        </div>
        <div className="bg-white border border-linen-200 rounded-xl p-4">
          <p className="text-xs text-warm-400 mb-1">Färger hos garnr</p>
          <p className="text-2xl font-semibold text-warm-900 tabular-nums">{recs.length}</p>
          <p className="text-xs text-warm-400 mt-0.5">{recs.filter(r => r.stats.current_quantity === 0).length} slut just nu</p>
        </div>
        <div className="bg-white border border-linen-200 rounded-xl p-4">
          <p className="text-xs text-warm-400 mb-1">Era färger</p>
          <p className="text-2xl font-semibold text-warm-900 tabular-nums">{ourItems.length}</p>
          <p className="text-xs text-warm-400 mt-0.5">{yarn.productName ? `${matchedIds.size} finns hos garnr` : 'garnet finns inte i lagret'}</p>
        </div>
        <div className={`border rounded-xl p-4 ${orderUnits > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-linen-200'}`}>
          <p className="text-xs text-warm-400 mb-1">Förslag att beställa</p>
          <p className={`text-2xl font-semibold tabular-nums ${orderUnits > 0 ? 'text-amber-700' : 'text-sage-600'}`}>{orderUnits} <span className="text-base font-normal">st</span></p>
          <p className="text-xs text-warm-400 mt-0.5">{orderUnits > 0 ? `${toOrder.length} färger · ${fmt(orderCost, 0)} kr i inköp` : 'lagret räcker'}</p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="card p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-sage-600" />
          <h2 className="text-sm font-semibold text-warm-900">Försäljning per vecka hos garnr – {yarn.label}</h2>
        </div>
        {chartWeeks.length > 1 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartWeeks} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d8" vertical={false} />
              <XAxis dataKey="week" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} width={40} />
              <Tooltip formatter={v => [`${v} st`, 'Sålt']} labelFormatter={l => `Vecka från ${l}`}
                contentStyle={{ borderRadius: 8, border: '1px solid #e8e0d8', fontSize: 12 }} />
              <Bar dataKey="sold" fill="#8aab94" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-warm-500">För lite data än – det behövs minst ett par veckors mätningar.</p>
        )}
      </div>

      {yarn.productName && (
        <>
          {/* Order recommendation */}
          <div className="card p-5 mb-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <ShoppingCart className="w-4 h-4 text-sage-600" />
              <h2 className="text-sm font-semibold text-warm-900 flex-1">Beställningsförslag – {yarn.label}</h2>
              {toOrder.length > 0 && (
                <button onClick={copyOrder} className="btn-secondary flex items-center gap-1.5 text-xs px-3 py-1.5">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Kopierad' : 'Kopiera beställning'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 bg-cream-100 rounded-lg p-3">
              <label className="text-xs text-warm-600">
                Vår försäljning jämfört med garnr
                <div className="flex items-center gap-1.5 mt-1">
                  <input type="number" min={1} max={100} className="input-field w-20"
                    value={settings.share} onChange={e => updateSettings({ share: Math.max(1, Number(e.target.value) || 1) })} />
                  <span>%</span>
                </div>
              </label>
              <label className="text-xs text-warm-600">
                Lagret ska räcka
                <div className="flex items-center gap-1.5 mt-1">
                  <input type="number" min={1} max={52} className="input-field w-20"
                    value={settings.coverWeeks} onChange={e => updateSettings({ coverWeeks: Math.max(1, Number(e.target.value) || 1) })} />
                  <span>veckor</span>
                </div>
              </label>
              <label className="text-xs text-warm-600">
                Beställ i förpackningar om
                <div className="flex items-center gap-1.5 mt-1">
                  <input type="number" min={1} max={50} className="input-field w-20"
                    value={settings.packSize} onChange={e => updateSettings({ packSize: Math.max(1, Number(e.target.value) || 1) })} />
                  <span>st</span>
                </div>
              </label>
            </div>

            {toOrder.length === 0 ? (
              <p className="text-sm text-warm-600">Lagret räcker för alla färger med de här inställningarna.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-linen-100 text-xs text-warm-500">
                      <th className="text-left py-2 pr-3 font-medium">Färg</th>
                      <th className="text-right py-2 px-2 font-medium">Garnr/v</th>
                      <th className="text-right py-2 px-2 font-medium">Vår/v</th>
                      <th className="text-right py-2 px-2 font-medium">I lager</th>
                      <th className="text-right py-2 px-2 font-medium">Mål</th>
                      <th className="text-right py-2 pl-2 font-medium">Beställ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-linen-50">
                    {toOrder.map(r => (
                      <tr key={r.stats.color_number}>
                        <td className="py-2 pr-3 text-warm-900">{r.item!.colorway}</td>
                        <td className="py-2 px-2 text-right tabular-nums text-warm-500">{fmt(r.marketRate)}</td>
                        <td className="py-2 px-2 text-right tabular-nums text-warm-500">{fmt(r.ourRate)}</td>
                        <td className={`py-2 px-2 text-right tabular-nums ${r.item!.quantity_in_stock === 0 ? 'text-red-600 font-semibold' : ''}`}>{r.item!.quantity_in_stock}</td>
                        <td className="py-2 px-2 text-right tabular-nums text-warm-500">{r.target}</td>
                        <td className="py-2 pl-2 text-right tabular-nums font-semibold text-amber-700">{r.order}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-xs text-warm-400 mt-3">
              Mål = garnrs försäljning de senaste 4 veckorna × {settings.share} % × {settings.coverWeeks} veckor.
              Beställ = det som fattas upp till målet, avrundat uppåt till hela förpackningar.
              Justera procenten när ni ser hur er egen försäljning går.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Missing colours */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-warm-900 mb-1">Säljer bra hos garnr – saknas hos er</h2>
              <p className="text-xs text-warm-400 mb-3">Färger att överväga att ta in.</p>
              {missingInRange.length === 0 ? (
                <p className="text-sm text-warm-600">Ni har alla färger som säljer minst 1 st/vecka.</p>
              ) : (
                <ul className="divide-y divide-linen-50 text-sm">
                  {missingInRange.map(r => (
                    <li key={r.stats.color_number} className="py-1.5 flex justify-between gap-3">
                      <span className="text-warm-900">{r.stats.color_number} {r.stats.color_name}</span>
                      <span className="tabular-nums text-warm-500">{fmt(r.marketRate)} st/v</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Slow movers */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-warm-900 mb-1">Säljer långsamt hos garnr</h2>
              <p className="text-xs text-warm-400 mb-3">Färger ni har i lager men som garnr säljer under 0,5 st/vecka. Vänta med att köpa in fler.</p>
              {slowMovers.length === 0 ? (
                <p className="text-sm text-warm-600">Inga.</p>
              ) : (
                <ul className="divide-y divide-linen-50 text-sm">
                  {slowMovers.map(r => (
                    <li key={r.stats.color_number} className="py-1.5 flex justify-between gap-3">
                      <span className="text-warm-900">{r.item!.colorway}</span>
                      <span className="tabular-nums text-warm-500">{fmt(r.marketRate)} st/v · ni har {r.item!.quantity_in_stock}</span>
                    </li>
                  ))}
                </ul>
              )}
              {notAtMarket.length > 0 && (
                <p className="text-xs text-warm-400 mt-3">
                  Finns inte hos garnr: {notAtMarket.map(i => i.colorway).join(', ')}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* All colours */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-warm-900 mb-1">Alla färger hos garnr</h2>
        <p className="text-xs text-warm-400 mb-3">Klicka på en färg för att se garnrs lager över tid.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-linen-100 text-xs text-warm-500">
                <th className="text-left py-2 pr-3 font-medium">Färg</th>
                <th className="text-right py-2 px-2 font-medium">Sålt/v</th>
                <th className="text-right py-2 px-2 font-medium hidden sm:table-cell">Sålt totalt</th>
                <th className="text-right py-2 px-2 font-medium hidden sm:table-cell">Slut (dagar)</th>
                <th className="text-right py-2 px-2 font-medium">Garnr har</th>
                {yarn.productName && <th className="text-right py-2 pl-2 font-medium">Ni har</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-linen-50">
              {visible.map(r => {
                const open = selectedColor === r.stats.color_number
                return (
                  <tr key={r.stats.color_number} onClick={() => setSelectedColor(open ? null : r.stats.color_number)}
                    className={`cursor-pointer hover:bg-cream-50 ${open ? 'bg-sage-50' : ''}`}>
                    <td className="py-2 pr-3 text-warm-900">{r.stats.color_number} {r.stats.color_name}</td>
                    <td className="py-2 px-2 text-right tabular-nums font-medium">{fmt(r.marketRate)}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-warm-500 hidden sm:table-cell">{r.stats.sold_total}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-warm-500 hidden sm:table-cell">{r.stats.out_days || '–'}</td>
                    <td className={`py-2 px-2 text-right tabular-nums ${r.stats.current_quantity === 0 ? 'text-red-600 font-semibold' : 'text-warm-500'}`}>
                      {r.stats.current_quantity === 0 ? 'slut' : r.stats.current_quantity}
                    </td>
                    {yarn.productName && (
                      <td className="py-2 pl-2 text-right tabular-nums">{r.item ? r.item.quantity_in_stock : <span className="text-warm-300">–</span>}</td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {recs.length > 20 && (
          <button onClick={() => setShowAll(!showAll)} className="mt-3 text-xs font-medium text-sage-700 flex items-center gap-1">
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showAll ? 'Visa färre' : `Visa alla ${recs.length} färger`}
          </button>
        )}

        {selectedColor && (
          <div className="mt-4 border-t border-linen-100 pt-4">
            <p className="text-sm font-medium text-warm-900 mb-2">
              Garnrs lager – {recs.find(r => r.stats.color_number === selectedColor)?.stats.color_name}
            </p>
            {history.length > 1 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d8" vertical={false} />
                  <XAxis dataKey="date" tick={AXIS} axisLine={false} tickLine={false} minTickGap={24} />
                  <YAxis tick={AXIS} axisLine={false} tickLine={false} width={36} allowDecimals={false} />
                  <Tooltip formatter={v => [`${v} st`, 'I lager']}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e8e0d8', fontSize: 12 }} />
                  <Line type="stepAfter" dataKey="quantity" stroke="#35643A" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-warm-500">Laddar…</p>
            )}
          </div>
        )}
      </div>

      <p className="flex items-start gap-2 text-xs text-warm-400 mt-5">
        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        Siffrorna är uppskattningar: garnr säljer även i butik, och justeringar eller påfyllning samma dag syns inte.
        Slutsålda dagar räknas som 0 i lager.
      </p>
    </div>
  )
}
