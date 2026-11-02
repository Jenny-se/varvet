import { InventoryItem } from './types'

// Garner som skrapas från garnr.se och vilket garn i vårt lager de motsvarar
export const MARKET_YARNS: { url: string; label: string; productName: string | null }[] = [
  { url: 'https://garnr.se/p/rauma-finull/', label: 'Rauma Finull', productName: 'Rauma Finull' },
  { url: 'https://garnr.se/p/istex-lettlopi/', label: 'Ístex Léttlopi', productName: 'Ístex Lettlopi' },
  { url: 'https://garnr.se/p/rauma-fivel/', label: 'Rauma Fivel', productName: 'Rauma Fivel' },
  { url: 'https://garnr.se/p/rauma-lamull/', label: 'Rauma Lamull', productName: 'Rauma Lamull' },
  { url: 'https://garnr.se/p/rauma-mild-mohair/', label: 'Rauma Mild Mohair', productName: null },
]

export interface MarketColorStats {
  product_url: string
  color_number: string
  color_name: string
  first_date: string
  last_date: string
  sold_total: number
  sold_28d: number
  out_days: number
  out_days_28d: number
  current_quantity: number
}

export interface MarketWeek {
  product_url: string
  week: string
  sold: number
}

export interface OrderSettings {
  share: number      // vår försäljning i procent av garnrs
  coverWeeks: number // hur många veckors försäljning lagret ska räcka
  packSize: number   // beställs i hela förpackningar
}

export const DEFAULT_SETTINGS: OrderSettings = { share: 10, coverWeeks: 8, packSize: 10 }

function normalize(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/ø/g, 'o').replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim()
}

function splitColorway(colorway: string | null) {
  const m = (colorway ?? '').match(/^(\d+)\s*(.*)$/)
  return { code: m ? m[1] : '', name: normalize(m ? m[2] : colorway ?? '') }
}

// Vår färg har artikelkoden först, t.ex. "004401 Natur", medan garnr har "401".
// Matcha på slutet av koden och ta namnet till hjälp när flera koder passar.
export function matchColor(stats: MarketColorStats, items: InventoryItem[]): InventoryItem | null {
  const num = stats.color_number.replace(/^0+/, '')
  const name = normalize(stats.color_name)
  const parsed = items.map(item => ({ item, ...splitColorway(item.colorway) }))
  let candidates = parsed.filter(p => num && p.code.replace(/^0+/, '').endsWith(num))
  if (candidates.length > 1) {
    candidates = candidates.filter(p => p.name === name || name.startsWith(p.name) || p.name.startsWith(name))
  }
  if (candidates.length !== 1) candidates = parsed.filter(p => p.name === name)
  return candidates.length === 1 ? candidates[0].item : null
}

// Försäljning per vecka: de senaste fyra veckorna om det finns så mycket data, annars hela perioden
export function weeklyRate(s: MarketColorStats) {
  const days = (new Date(s.last_date).getTime() - new Date(s.first_date).getTime()) / 86400000
  if (days >= 28) return s.sold_28d / 4
  return days > 0 ? s.sold_total / (days / 7) : 0
}

export interface Recommendation {
  stats: MarketColorStats
  item: InventoryItem | null
  marketRate: number   // garnrs försäljning per vecka
  ourRate: number      // uppskattad egen försäljning per vecka
  target: number       // önskat lager
  order: number        // förslag att beställa
}

export function recommend(stats: MarketColorStats, item: InventoryItem | null, settings: OrderSettings): Recommendation {
  const marketRate = weeklyRate(stats)
  const ourRate = marketRate * settings.share / 100
  const target = Math.ceil(ourRate * settings.coverWeeks)
  const stock = item?.quantity_in_stock ?? 0
  const missing = Math.max(0, target - stock)
  const pack = Math.max(1, settings.packSize)
  const order = item && missing > 0 ? Math.ceil(missing / pack) * pack : 0
  return { stats, item, marketRate, ourRate, target, order }
}
