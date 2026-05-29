'use client'

import { Draggable } from '@hello-pangea/dnd'
import { KanbanCard as KanbanCardType } from '@/lib/types'
import { Calendar, Link2, Edit2, Trash2, User } from 'lucide-react'
import { PriorityBadge, CardCategoryBadge } from '@/components/ui/Badge'
import { format, isPast, isToday } from 'date-fns'
import { sv } from 'date-fns/locale'

interface KanbanCardProps {
  card: KanbanCardType
  index: number
  onEdit: () => void
  onDelete: () => void
}

export function KanbanCard({ card, index, onEdit, onDelete }: KanbanCardProps) {
  const dueDate = card.due_date ? new Date(card.due_date) : null
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate)
  const isDueToday = dueDate && isToday(dueDate)

  const priorityBorder = {
    high: 'border-l-red-400',
    medium: 'border-l-amber-400',
    low: 'border-l-sage-400',
  }[card.priority]

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-xl border border-cream-300 border-l-4 ${priorityBorder} p-3.5 shadow-sm select-none transition-shadow ${
            snapshot.isDragging ? 'shadow-lg rotate-1 opacity-95' : 'hover:shadow-md'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-warm-900 leading-snug flex-1">{card.title}</p>
            <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit() }}
                className="p-1 rounded text-warm-400 hover:text-warm-700 hover:bg-cream-200 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete() }}
                className="p-1 rounded text-warm-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {card.description && (
            <p className="text-xs text-warm-500 mt-1.5 line-clamp-2 leading-relaxed">{card.description}</p>
          )}

          {/* Badges */}
          <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
            <PriorityBadge priority={card.priority} />
            {card.category_tag && <CardCategoryBadge category={card.category_tag} />}
            {card.assignee && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-linen-100 text-bark-600">
                <User className="w-2.5 h-2.5" />
                {card.assignee}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {dueDate && (
                <span
                  className={`flex items-center gap-1 text-xs ${
                    isOverdue ? 'text-red-600 font-medium' : isDueToday ? 'text-amber-600 font-medium' : 'text-warm-400'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  {isToday(dueDate) ? 'Idag' : format(dueDate, 'd MMM', { locale: sv })}
                </span>
              )}
              {(card.supplier || card.inventory) && (
                <span className="flex items-center gap-1 text-xs text-warm-400">
                  <Link2 className="w-3 h-3" />
                  {card.supplier?.company_name ?? card.inventory?.product_name}
                </span>
              )}
            </div>
            <div className="flex gap-1 ml-auto">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit() }}
                className="p-1 rounded text-warm-300 hover:text-warm-600 hover:bg-cream-100 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete() }}
                className="p-1 rounded text-warm-300 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
