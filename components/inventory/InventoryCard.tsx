'use client'

import { InventoryItem } from '@/lib/types'
import { AlertTriangle, Edit2, Trash2, Layers } from 'lucide-react'
import { Badge, WeightBadge } from '@/components/ui/Badge'

interface InventoryCardProps {
  item: InventoryItem
  onEdit: () => void
  onDelete: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  yarn: 'Garn',
  needles: 'Stickor',
  accessories: 'Tillbehör',
}

export function InventoryCard({ item, onEdit, onDelete }: InventoryCardProps) {
  const isLowStock = item.quantity_in_stock <= item.low_stock_threshold
  const isOutOfStock = item.quantity_in_stock === 0

  return (
    <div className={`card p-5 hover:shadow-md transition-shadow duration-200 ${
      isLowStock ? 'border-amber-200' : ''
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-warm-900 text-sm">{item.product_name}</h3>
          {item.colorway && (
            <p className="text-xs text-warm-500 mt-0.5">{item.colorway}{item.dye_lot ? ` · Parti ${item.dye_lot}` : ''}</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-warm-400 hover:text-warm-700 hover:bg-cream-200 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-warm-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Badges row */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge label={CATEGORY_LABELS[item.category] ?? item.category} variant="linen" />
        {item.yarn_weight && <WeightBadge weight={item.yarn_weight} />}
        {item.fiber_content && <Badge label={item.fiber_content} variant="default" />}
      </div>

      {/* Stock indicator */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-warm-400" />
          <span className={`text-sm font-semibold ${
            isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-warm-800'
          }`}>
            {item.quantity_in_stock}
          </span>
          <span className="text-xs text-warm-400">i lager</span>
          {isLowStock && !isOutOfStock && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
              <AlertTriangle className="w-3 h-3" />
              Lågt lager
            </span>
          )}
          {isOutOfStock && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              <AlertTriangle className="w-3 h-3" />
              Slut
            </span>
          )}
        </div>
        {item.retail_price && (
          <span className="text-sm font-medium text-warm-700">{item.retail_price.toFixed(0)} kr</span>
        )}
      </div>

      {/* Meta row */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {item.meterage_per_skein && (
          <span className="text-xs text-warm-500">{item.meterage_per_skein} m/härva</span>
        )}
        {item.needle_size_recommendation && (
          <span className="text-xs text-warm-500">Nål {item.needle_size_recommendation}</span>
        )}
        {item.supplier && (
          <span className="text-xs text-warm-500">{item.supplier.company_name}</span>
        )}
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-cream-200 text-warm-600 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Prices */}
      {(item.cost_price || item.retail_price) && (
        <div className="mt-3 pt-3 border-t border-cream-300 flex gap-4">
          {item.cost_price && (
            <div>
              <p className="text-xs text-warm-400">Inköpspris</p>
              <p className="text-xs font-medium text-warm-700">{item.cost_price.toFixed(2)} kr</p>
            </div>
          )}
          {item.cost_price && item.retail_price && (
            <div>
              <p className="text-xs text-warm-400">Marginal</p>
              <p className="text-xs font-medium text-sage-600">
                {(((item.retail_price - item.cost_price) / item.retail_price) * 100).toFixed(0)}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
