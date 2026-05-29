'use client'

import { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { KanbanColumn as KanbanColumnType, KanbanCard as KanbanCardType, Supplier, InventoryItem } from '@/lib/types'
import { KanbanCard } from './KanbanCard'
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

interface KanbanColumnProps {
  column: KanbanColumnType
  cards: KanbanCardType[]
  suppliers: Supplier[]
  inventoryItems: InventoryItem[]
  onAddCard: (columnId: string) => void
  onEditCard: (card: KanbanCardType) => void
  onDeleteCard: (cardId: string) => void
  onRenameColumn: (columnId: string, title: string) => void
  onDeleteColumn: (columnId: string) => void
}

export function KanbanColumn({
  column, cards, onAddCard, onEditCard, onDeleteCard, onRenameColumn, onDeleteColumn
}: KanbanColumnProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameVal, setRenameVal] = useState(column.title)

  function submitRename() {
    if (renameVal.trim()) onRenameColumn(column.id, renameVal.trim())
    setRenaming(false)
  }

  return (
    <div className="flex flex-col bg-cream-200 rounded-2xl p-3 w-72 flex-shrink-0 max-h-[calc(100vh-11rem)] overflow-hidden">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        {renaming ? (
          <input
            className="input-field text-sm font-semibold py-1 px-2 flex-1 mr-2"
            value={renameVal}
            autoFocus
            onChange={e => setRenameVal(e.target.value)}
            onBlur={submitRename}
            onKeyDown={e => { if (e.key === 'Enter') submitRename(); if (e.key === 'Escape') setRenaming(false) }}
          />
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-warm-800 truncate">{column.title}</h3>
            <span className="text-xs bg-warm-200 text-warm-600 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
              {cards.length}
            </span>
          </div>
        )}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg text-warm-400 hover:text-warm-700 hover:bg-cream-300 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-cream-300 py-1 min-w-[140px]">
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-warm-700 hover:bg-cream-100 transition-colors"
                  onClick={() => { setShowMenu(false); setRenaming(true) }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Byt namn
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                  onClick={() => { setShowMenu(false); onDeleteColumn(column.id) }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Radera kolumn
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cards */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto space-y-2.5 scrollbar-thin min-h-[2rem] rounded-xl transition-colors ${
              snapshot.isDraggingOver ? 'bg-sage-100/50' : ''
            }`}
          >
            {cards.map((card, index) => (
              <KanbanCard
                key={card.id}
                card={card}
                index={index}
                onEdit={() => onEditCard(card)}
                onDelete={() => onDeleteCard(card.id)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add card button */}
      <button
        onClick={() => onAddCard(column.id)}
        className="mt-3 flex items-center gap-1.5 w-full px-3 py-2 text-xs text-warm-500 hover:text-warm-800 hover:bg-cream-300 rounded-lg transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Lägg till kort
      </button>
    </div>
  )
}
