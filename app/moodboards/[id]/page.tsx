'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { supabase } from '@/lib/supabase'
import { Moodboard, MoodboardItem } from '@/lib/types'
import { signedUrl, signedUrls } from '@/lib/storage'
import { ArrowLeft, ImagePlus, Palette, StickyNote, Trash2, GripVertical, Pencil, Check, X } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import Image from 'next/image'

const BUCKET = 'moodboard-images'

export default function MoodboardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [board, setBoard] = useState<Moodboard | null>(null)
  const [items, setItems] = useState<MoodboardItem[]>([])
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleVal, setTitleVal] = useState('')

  const [uploadError, setUploadError] = useState<string | null>(null)

  // Inline edit for note/color label
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingVal, setEditingVal] = useState('')

  const fetchBoard = useCallback(async () => {
    setLoading(true)
    const { data: boardData } = await supabase
      .from('moodboards')
      .select('*')
      .eq('id', id)
      .single()

    const { data: itemData } = await supabase
      .from('moodboard_items')
      .select('*')
      .eq('moodboard_id', id)
      .order('position')

    setBoard(boardData ?? null)
    setTitleVal(boardData?.title ?? '')
    const loadedItems: MoodboardItem[] = itemData ?? []
    setItems(loadedItems)

    // Generate signed URLs for all image items
    const imageItems = loadedItems
      .filter(i => i.type === 'image' && i.image_url)
      .map(i => ({ id: i.id, pathOrUrl: i.image_url! }))
    if (imageItems.length > 0) {
      const urls = await signedUrls(BUCKET, imageItems)
      setImageUrls(urls)
    }
    setLoading(false)
  }, [id])

  useEffect(() => { fetchBoard() }, [fetchBoard])

  // ── Image upload ────────────────────────────────────────────
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)

    const ext = file.name.split('.').pop()
    const path = `${id}/${Date.now()}.${ext}`

    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false })

    if (storageError) {
      setUploadError(`Uppladdning misslyckades: ${storageError.message}`)
    } else {
      const { data: saved } = await supabase
        .from('moodboard_items')
        .insert({ moodboard_id: id, position: items.length, type: 'image', image_url: path })
        .select()
        .single()
      if (saved) {
        const url = await signedUrl(BUCKET, path)
        setItems(prev => [...prev, saved])
        if (url) setImageUrls(prev => ({ ...prev, [saved.id]: url }))
      }
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Add color ───────────────────────────────────────────────
  async function handleAddColor() {
    await addItem({ type: 'color', color_hex: '#C89C00', label: '' })
  }

  // ── Add note ────────────────────────────────────────────────
  async function handleAddNote() {
    await addItem({ type: 'note', note_text: 'Ny anteckning…' })
  }

  async function addItem(partial: Partial<MoodboardItem>) {
    const position = items.length
    const { data } = await supabase
      .from('moodboard_items')
      .insert({ moodboard_id: id, position, ...partial })
      .select()
      .single()
    if (data) setItems(prev => [...prev, data])
  }

  // ── Delete item ─────────────────────────────────────────────
  async function handleDeleteItem() {
    if (!deletingId) return
    const item = items.find(i => i.id === deletingId)

    if (item?.type === 'image' && item.image_url) {
      const path = item.image_url.split(`${BUCKET}/`)[1]
      if (path) await supabase.storage.from(BUCKET).remove([path])
    }

    await supabase.from('moodboard_items').delete().eq('id', deletingId)
    setItems(prev => prev.filter(i => i.id !== deletingId))
    setDeletingId(null)
  }

  // ── Reorder ─────────────────────────────────────────────────
  async function onDragEnd(result: DropResult) {
    if (!result.destination) return
    const reordered = Array.from(items)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    const updated = reordered.map((item, i) => ({ ...item, position: i }))
    setItems(updated)
    await Promise.all(updated.map(item =>
      supabase.from('moodboard_items').update({ position: item.position }).eq('id', item.id)
    ))
  }

  // ── Edit title ──────────────────────────────────────────────
  async function saveTitle() {
    if (!titleVal.trim()) return
    await supabase.from('moodboards').update({ title: titleVal }).eq('id', id)
    setBoard(prev => prev ? { ...prev, title: titleVal } : prev)
    setEditingTitle(false)
  }

  // ── Edit item inline ─────────────────────────────────────────
  async function saveItemEdit(item: MoodboardItem) {
    const field = item.type === 'note' ? 'note_text' : item.type === 'color' ? 'label' : 'label'
    await supabase.from('moodboard_items').update({ [field]: editingVal }).eq('id', item.id)
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, [field]: editingVal } : i))
    setEditingItemId(null)
  }

  async function updateColorHex(itemId: string, hex: string) {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, color_hex: hex } : i))
    await supabase.from('moodboard_items').update({ color_hex: hex }).eq('id', itemId)
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="h-6 bg-cream-300 rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-cream-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!board) return null

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/moodboards')} className="p-1.5 rounded-lg text-warm-400 hover:text-warm-700 hover:bg-cream-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input
                className="input-field text-lg font-semibold py-1"
                value={titleVal}
                autoFocus
                onChange={e => setTitleVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditingTitle(false) }}
              />
              <button onClick={saveTitle} className="p-1.5 text-sage-600 hover:bg-sage-100 rounded-lg transition-colors"><Check className="w-4 h-4" /></button>
              <button onClick={() => setEditingTitle(false)} className="p-1.5 text-warm-400 hover:bg-cream-200 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <button onClick={() => setEditingTitle(true)} className="flex items-center gap-2 group">
              <h1 className="text-xl font-semibold text-warm-900">{board.title}</h1>
              <Pencil className="w-3.5 h-3.5 text-warm-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-secondary flex items-center gap-2 text-xs"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            {uploading ? 'Laddar…' : 'Bild'}
          </button>
          <button onClick={handleAddColor} className="btn-secondary flex items-center gap-2 text-xs">
            <Palette className="w-3.5 h-3.5" /> Färg
          </button>
          <button onClick={handleAddNote} className="btn-secondary flex items-center gap-2 text-xs">
            <StickyNote className="w-3.5 h-3.5" /> Not
          </button>
        </div>
      </div>

      {/* Upload error */}
      {uploadError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-4 text-sm text-red-700">
          {uploadError}
          <button onClick={() => setUploadError(null)} className="ml-auto text-red-400 hover:text-red-700">✕</button>
        </div>
      )}

      {/* Tags */}
      {board.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {board.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-cream-200 text-warm-600 rounded-full text-xs">{tag}</span>
          ))}
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center mb-4">
            <ImagePlus className="w-8 h-8 text-warm-300" />
          </div>
          <p className="text-sm font-medium text-warm-700">Tom moodboard</p>
          <p className="text-sm text-warm-400 mt-1">Lägg till bilder, färger eller anteckningar med knapparna ovan</p>
        </div>
      )}

      {/* Grid with drag-and-drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="moodboard" direction="horizontal">
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-wrap gap-4"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative group rounded-xl overflow-hidden border border-cream-300 bg-white shadow-sm transition-shadow ${
                        snapshot.isDragging ? 'shadow-lg rotate-1' : 'hover:shadow-md'
                      } ${item.type === 'image' ? 'w-64 h-48' : item.type === 'color' ? 'w-40 h-40' : 'w-56 h-auto min-h-[7rem]'}`}
                    >
                      {/* Drag handle */}
                      <div
                        {...provided.dragHandleProps}
                        className="absolute top-2 left-2 z-10 p-1 rounded bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                      >
                        <GripVertical className="w-3.5 h-3.5 text-warm-400" />
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => setDeletingId(item.id)}
                        className="absolute top-2 right-2 z-10 p-1 rounded bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity text-warm-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* IMAGE */}
                      {item.type === 'image' && imageUrls[item.id] && (
                        <Image src={imageUrls[item.id]} alt="" fill className="object-cover" sizes="256px" />
                      )}

                      {/* COLOR */}
                      {item.type === 'color' && (
                        <div className="w-full h-full flex flex-col">
                          <div className="flex-1 relative">
                            <div className="absolute inset-0" style={{ backgroundColor: item.color_hex ?? '#ccc' }} />
                            <input
                              type="color"
                              value={item.color_hex ?? '#cccccc'}
                              onChange={e => updateColorHex(item.id, e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              title="Välj färg"
                            />
                          </div>
                          <div className="px-3 py-2 bg-white border-t border-cream-300">
                            <p className="text-xs font-mono text-warm-600">{item.color_hex?.toUpperCase()}</p>
                            {editingItemId === item.id ? (
                              <div className="flex items-center gap-1 mt-1">
                                <input
                                  className="input-field text-xs py-0.5 flex-1"
                                  value={editingVal}
                                  autoFocus
                                  onChange={e => setEditingVal(e.target.value)}
                                  onKeyDown={e => { if (e.key === 'Enter') saveItemEdit(item); if (e.key === 'Escape') setEditingItemId(null) }}
                                />
                                <button onClick={() => saveItemEdit(item)} className="text-sage-600"><Check className="w-3 h-3" /></button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setEditingItemId(item.id); setEditingVal(item.label ?? '') }}
                                className="text-xs text-warm-400 hover:text-warm-700 mt-0.5 text-left w-full"
                              >
                                {item.label || <span className="italic">Namnlös</span>}
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* NOTE */}
                      {item.type === 'note' && (
                        <div className="p-4 h-full bg-mustard-100">
                          {editingItemId === item.id ? (
                            <div className="flex flex-col gap-2 h-full">
                              <textarea
                                className="input-field flex-1 text-sm resize-none min-h-[4rem]"
                                value={editingVal}
                                autoFocus
                                onChange={e => setEditingVal(e.target.value)}
                              />
                              <div className="flex gap-1 justify-end">
                                <button onClick={() => saveItemEdit(item)} className="btn-primary text-xs py-1 px-2">Spara</button>
                                <button onClick={() => setEditingItemId(null)} className="btn-secondary text-xs py-1 px-2">Avbryt</button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setEditingItemId(item.id); setEditingVal(item.note_text ?? '') }}
                              className="text-sm text-warm-800 text-left w-full h-full leading-relaxed"
                            >
                              {item.note_text || <span className="italic text-warm-400">Klicka för att redigera…</span>}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {deletingId && (
        <ConfirmDialog
          title="Radera element"
          message="Är du säker på att du vill radera detta element?"
          confirmLabel="Radera"
          danger
          onConfirm={handleDeleteItem}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
