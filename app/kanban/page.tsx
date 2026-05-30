'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { supabase } from '@/lib/supabase'
import { KanbanColumn as KanbanColumnType, KanbanCard as KanbanCardType, Supplier, InventoryItem, Moodboard } from '@/lib/types'
import { logActivity } from '@/lib/activity'
import { KanbanColumn } from '@/components/kanban/KanbanColumn'
import { CardForm } from '@/components/kanban/CardForm'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Plus } from 'lucide-react'

type CardInput = Omit<KanbanCardType, 'id' | 'created_at' | 'updated_at' | 'supplier' | 'inventory'>

const PRIORITY_LABELS: Record<string, string> = { high: 'Hög', medium: 'Medel', low: 'Låg' }

export default function KanbanPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const priorityFilter = searchParams.get('priority')

  const [columns, setColumns] = useState<KanbanColumnType[]>([])
  const [cards, setCards] = useState<KanbanCardType[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [moodboards, setMoodboards] = useState<Moodboard[]>([])
  const [loading, setLoading] = useState(true)

  const [showCardForm, setShowCardForm] = useState(false)
  const [editingCard, setEditingCard] = useState<KanbanCardType | null>(null)
  const [defaultColumnId, setDefaultColumnId] = useState<string | null>(null)
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null)
  const [deletingColumnId, setDeletingColumnId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [addingColumn, setAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [{ data: colData }, { data: cardData }, { data: supData }, { data: invData }, { data: moodData }] = await Promise.all([
      supabase.from('kanban_columns').select('*').order('position'),
      supabase.from('kanban_cards')
        .select('*, supplier:suppliers(id, company_name), inventory:inventory(id, product_name)')
        .order('position'),
      supabase.from('suppliers').select('id, company_name').eq('status', 'active').order('company_name'),
      supabase.from('inventory').select('id, product_name').order('product_name'),
      supabase.from('moodboards').select('id, title').order('title'),
    ])
    setColumns(colData ?? [])
    setCards((cardData as KanbanCardType[]) ?? [])
    setSuppliers((supData as Supplier[]) ?? [])
    setInventoryItems((invData as InventoryItem[]) ?? [])
    setMoodboards((moodData as Moodboard[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  function getCardsForColumn(columnId: string) {
    return cards
      .filter(c => c.column_id === columnId)
      .filter(c => priorityFilter ? c.priority === priorityFilter : true)
      .sort((a, b) => a.position - b.position)
  }

  async function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const movedCard = cards.find(c => c.id === draggableId)
    if (!movedCard) return

    const destColumnCards = getCardsForColumn(destination.droppableId)
      .filter(c => c.id !== draggableId)

    destColumnCards.splice(destination.index, 0, { ...movedCard, column_id: destination.droppableId })

    // Optimistic update
    setCards(prev => {
      const others = prev.filter(c => c.id !== draggableId)
      const updated = destColumnCards.map((c, i) => ({ ...c, position: i }))
      return [...others.filter(c => c.column_id !== destination.droppableId || !updated.find(u => u.id === c.id)), ...updated]
    })

    // Persist reorder
    await Promise.all([
      supabase.from('kanban_cards').update({
        column_id: destination.droppableId,
        position: destination.index,
      }).eq('id', draggableId),
      ...destColumnCards
        .filter(c => c.id !== draggableId)
        .map((c, i) =>
          supabase.from('kanban_cards').update({ position: i >= destination.index ? i + 1 : i }).eq('id', c.id)
        ),
    ])
  }

  async function handleCardSubmit(data: CardInput) {
    setSubmitting(true)
    if (editingCard) {
      const { error } = await supabase.from('kanban_cards').update(data).eq('id', editingCard.id)
      if (!error) await logActivity('Uppdaterade kort', 'kanban_card', editingCard.id, data.title)
    } else {
      const colCards = getCardsForColumn(data.column_id)
      const position = colCards.length
      const { data: created, error } = await supabase
        .from('kanban_cards')
        .insert({ ...data, position })
        .select('*, supplier:suppliers(id, company_name), inventory:inventory(id, product_name)')
        .single()
      if (!error && created) {
        await logActivity('Lade till kort', 'kanban_card', created.id, data.title)
      }
    }
    setSubmitting(false)
    setShowCardForm(false)
    setEditingCard(null)
    fetchData()
  }

  async function handleDeleteCard() {
    if (!deletingCardId) return
    const card = cards.find(c => c.id === deletingCardId)
    await supabase.from('kanban_cards').delete().eq('id', deletingCardId)
    if (card) await logActivity('Raderade kort', 'kanban_card', deletingCardId, card.title)
    setDeletingCardId(null)
    fetchData()
  }

  async function handleRenameColumn(columnId: string, title: string) {
    await supabase.from('kanban_columns').update({ title }).eq('id', columnId)
    setColumns(prev => prev.map(c => c.id === columnId ? { ...c, title } : c))
  }

  async function handleDeleteColumn() {
    if (!deletingColumnId) return
    await supabase.from('kanban_columns').delete().eq('id', deletingColumnId)
    setDeletingColumnId(null)
    fetchData()
  }

  async function handleAddColumn() {
    const title = newColumnTitle.trim()
    if (!title) return
    const maxPos = columns.reduce((m, c) => Math.max(m, c.position), -1)
    const { data: created } = await supabase
      .from('kanban_columns')
      .insert({ title, position: maxPos + 1 })
      .select()
      .single()
    if (created) setColumns(prev => [...prev, created])
    setNewColumnTitle('')
    setAddingColumn(false)
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="h-6 bg-cream-300 rounded w-32 mb-6 animate-pulse" />
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-72 flex-shrink-0 bg-cream-200 rounded-2xl p-3 h-64 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Uppgifter</h1>
          <p className="text-sm text-warm-500 mt-0.5">
            {cards.filter(c => c.column_id !== columns.find(col => col.title === 'Klart')?.id).length} öppna uppgifter
          </p>
        </div>
        {priorityFilter && (
          <div className="flex items-center gap-2 bg-cream-200 border border-cream-300 rounded-lg px-3 py-1.5">
            <span className="text-xs text-warm-700">
              Prioritet: <strong>{PRIORITY_LABELS[priorityFilter] ?? priorityFilter}</strong>
            </span>
            <button
              onClick={() => router.push('/kanban')}
              className="text-warm-400 hover:text-warm-700 text-xs ml-1"
            >
              ✕ Rensa
            </button>
          </div>
        )}
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6 flex-1 scrollbar-thin items-start">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={getCardsForColumn(column.id)}
              suppliers={suppliers}
              inventoryItems={inventoryItems}
              onAddCard={(colId) => { setDefaultColumnId(colId); setEditingCard(null); setShowCardForm(true) }}
              onEditCard={(card) => { setEditingCard(card); setShowCardForm(true) }}
              onDeleteCard={(cardId) => setDeletingCardId(cardId)}
              onRenameColumn={handleRenameColumn}
              onDeleteColumn={(colId) => setDeletingColumnId(colId)}
            />
          ))}

          {/* Add column */}
          <div className="flex-shrink-0 w-72">
            {addingColumn ? (
              <div className="bg-cream-200 rounded-2xl p-3">
                <input
                  className="input-field text-sm mb-2"
                  placeholder="Kolumnnamn…"
                  value={newColumnTitle}
                  autoFocus
                  onChange={e => setNewColumnTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddColumn(); if (e.key === 'Escape') setAddingColumn(false) }}
                />
                <div className="flex gap-2">
                  <button onClick={handleAddColumn} className="btn-primary flex-1 py-1.5 text-xs">Lägg till</button>
                  <button onClick={() => setAddingColumn(false)} className="btn-secondary flex-1 py-1.5 text-xs">Avbryt</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingColumn(true)}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-warm-500 hover:text-warm-800 bg-cream-200/60 hover:bg-cream-200 rounded-2xl border-2 border-dashed border-cream-400 hover:border-cream-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ny kolumn
              </button>
            )}
          </div>
        </div>
      </DragDropContext>

      {/* Card form modal */}
      {showCardForm && (
        <Modal
          title={editingCard ? 'Redigera kort' : 'Nytt kort'}
          onClose={() => { setShowCardForm(false); setEditingCard(null) }}
          size="md"
        >
          <CardForm
            columns={columns}
            suppliers={suppliers}
            inventoryItems={inventoryItems}
            moodboards={moodboards}
            initial={editingCard ?? (defaultColumnId ? { column_id: defaultColumnId } : undefined)}
            onSubmit={handleCardSubmit}
            onCancel={() => { setShowCardForm(false); setEditingCard(null) }}
            submitting={submitting}
          />
        </Modal>
      )}

      {/* Delete card confirm */}
      {deletingCardId && (
        <ConfirmDialog
          title="Radera kort"
          message="Är du säker på att du vill radera detta kort?"
          confirmLabel="Radera"
          danger
          onConfirm={handleDeleteCard}
          onCancel={() => setDeletingCardId(null)}
        />
      )}

      {/* Delete column confirm */}
      {deletingColumnId && (
        <ConfirmDialog
          title="Radera kolumn"
          message="Alla kort i denna kolumn raderas med. Är du säker?"
          confirmLabel="Radera"
          danger
          onConfirm={handleDeleteColumn}
          onCancel={() => setDeletingColumnId(null)}
        />
      )}
    </div>
  )
}
