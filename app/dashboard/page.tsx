'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Supplier, InventoryItem, KanbanCard, ActivityEntry } from '@/lib/types'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { Package, Boxes, KanbanSquare, TrendingUp, AlertTriangle, Calendar } from 'lucide-react'
import { PriorityBadge, CardCategoryBadge } from '@/components/ui/Badge'
import { format, isPast, isToday } from 'date-fns'
import { sv } from 'date-fns/locale'

export default function DashboardPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [cards, setCards] = useState<KanbanCard[]>([])
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [
      { data: supData },
      { data: invData },
      { data: cardData },
      { data: actData },
    ] = await Promise.all([
      supabase.from('suppliers').select('*'),
      supabase.from('inventory').select('*'),
      supabase.from('kanban_cards').select('*, supplier:suppliers(company_name), inventory:inventory(product_name)'),
      supabase.from('activity_feed').select('*').order('created_at', { ascending: false }).limit(20),
    ])
    setSuppliers(supData ?? [])
    setInventory((invData as InventoryItem[]) ?? [])
    setCards((cardData as KanbanCard[]) ?? [])
    setActivity(actData ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const activeSuppliers = suppliers.filter(s => s.status === 'active').length
  const lowStockItems = inventory.filter(i => i.quantity_in_stock <= i.low_stock_threshold)
  const totalInventoryValue = inventory.reduce((sum, i) => sum + (i.retail_price ?? 0) * i.quantity_in_stock, 0)

  const openCards = cards.filter(c => true) // all open tasks shown
  const highPriority = openCards.filter(c => c.priority === 'high').length
  const mediumPriority = openCards.filter(c => c.priority === 'medium').length
  const lowPriority = openCards.filter(c => c.priority === 'low').length

  const upcoming = cards
    .filter(c => c.due_date)
    .filter(c => {
      const d = new Date(c.due_date!)
      return !isPast(d) || isToday(d)
    })
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="h-7 bg-cream-300 rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 h-24 animate-pulse bg-cream-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-warm-900">Välkommen till Varvet</h1>
        <p className="text-sm text-warm-500 mt-0.5">Gustavsberg · Naturfiber &amp; gemenskap</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Aktiva leverantörer"
          value={activeSuppliers}
          subtitle={`${suppliers.length} totalt`}
          icon={Package}
          accent="sage"
        />
        <StatsCard
          title="Lågt lagersaldo"
          value={lowStockItems.length}
          subtitle="produkter under gräns"
          icon={AlertTriangle}
          accent={lowStockItems.length > 0 ? 'amber' : 'sage'}
        />
        <StatsCard
          title="Öppna uppgifter"
          value={cards.length}
          subtitle={`${highPriority} hög prioritet`}
          icon={KanbanSquare}
          accent={highPriority > 0 ? 'red' : 'blue'}
        />
        <StatsCard
          title="Lagervärde"
          value={`${totalInventoryValue.toLocaleString('sv-SE')} kr`}
          subtitle={`${inventory.length} produkter`}
          icon={TrendingUp}
          accent="bark"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Low stock + Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          {/* Low stock warning */}
          {lowStockItems.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-warm-900">Lågt lagersaldo</h2>
              </div>
              <div className="space-y-2">
                {lowStockItems.slice(0, 6).map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-cream-300 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-warm-800">{item.product_name}</p>
                      {item.colorway && <p className="text-xs text-warm-500">{item.colorway}</p>}
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-semibold ${item.quantity_in_stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {item.quantity_in_stock}
                      </span>
                      <span className="text-xs text-warm-400"> / {item.low_stock_threshold}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming due dates */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-sage-500" />
              <h2 className="text-sm font-semibold text-warm-900">Kommande förfallodatum</h2>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-warm-400 py-4 text-center">Inga kommande förfallodatum</p>
            ) : (
              <div className="space-y-2">
                {upcoming.map(card => {
                  const d = new Date(card.due_date!)
                  const isOverdue = isPast(d) && !isToday(d)
                  const todayDue = isToday(d)
                  return (
                    <div key={card.id} className="flex items-center justify-between py-2 border-b border-cream-300 last:border-0">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <PriorityBadge priority={card.priority} />
                        <p className="text-sm text-warm-800 truncate">{card.title}</p>
                        {card.category_tag && <CardCategoryBadge category={card.category_tag} />}
                      </div>
                      <span className={`text-xs flex-shrink-0 ml-3 font-medium ${
                        isOverdue ? 'text-red-600' : todayDue ? 'text-amber-600' : 'text-warm-500'
                      }`}>
                        {todayDue ? 'Idag' : isOverdue ? 'Försenad' : format(d, 'd MMM', { locale: sv })}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Task priority breakdown */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <KanbanSquare className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-semibold text-warm-900">Uppgifter per prioritet</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Hög', count: highPriority, color: 'bg-red-100 text-red-700' },
                { label: 'Medel', count: mediumPriority, color: 'bg-amber-100 text-amber-700' },
                { label: 'Låg', count: lowPriority, color: 'bg-sage-100 text-sage-700' },
              ].map(({ label, count, color }) => (
                <div key={label} className={`rounded-xl p-4 ${color} text-center`}>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs font-medium mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Activity feed */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Boxes className="w-4 h-4 text-bark-500" />
            <h2 className="text-sm font-semibold text-warm-900">Senaste aktivitet</h2>
          </div>
          <ActivityFeed entries={activity} />
        </div>
      </div>
    </div>
  )
}
