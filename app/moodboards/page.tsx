'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ImageIcon, Trash2, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Moodboard, MoodboardItem } from '@/lib/types'
import Image from 'next/image'
import { logActivity } from '@/lib/activity'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'

export default function MoodboardsPage() {
  const router = useRouter()
  const [boards, setBoards] = useState<Moodboard[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const fetchBoards = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('moodboards')
      .select('*, items:moodboard_items(id, type, image_url, position)')
      .order('created_at', { ascending: false })
    setBoards((data as Moodboard[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchBoards() }, [fetchBoards])

  function resetForm() {
    setTitle(''); setDescription(''); setTagInput(''); setTags([])
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const { data, error } = await supabase
      .from('moodboards')
      .insert({ title, description: description || null, tags })
      .select()
      .single()
    if (!error && data) {
      await logActivity('Skapade moodboard', 'moodboard', data.id, title)
      setShowForm(false)
      resetForm()
      router.push(`/moodboards/${data.id}`)
    }
    setSubmitting(false)
  }

  async function handleDelete() {
    if (!deletingId) return
    const board = boards.find(b => b.id === deletingId)
    await supabase.from('moodboards').delete().eq('id', deletingId)
    if (board) await logActivity('Raderade moodboard', 'moodboard', deletingId, board.title)
    setDeletingId(null)
    fetchBoards()
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Moodboards</h1>
          <p className="text-sm text-warm-500 mt-0.5">{boards.length} boards</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ny moodboard
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-48 animate-pulse bg-cream-200" />
          ))}
        </div>
      ) : boards.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Inga moodboards ännu"
          description="Skapa din första moodboard för inspiration och idéer."
          action={
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" /> Ny moodboard
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map(board => (
            <div
              key={board.id}
              className="card overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group"
              onClick={() => router.push(`/moodboards/${board.id}`)}
            >
              {/* Cover image */}
              <div className="h-36 bg-gradient-to-br from-cream-200 to-linen-200 flex items-center justify-center relative overflow-hidden">
                {(() => {
                  const cover = (board.items as unknown as MoodboardItem[] | undefined)
                    ?.filter(i => i.type === 'image' && i.image_url)
                    .sort((a, b) => a.position - b.position)[0]
                  return cover?.image_url
                    ? <Image src={cover.image_url} alt="" fill className="object-cover" sizes="400px" />
                    : <ImageIcon className="w-10 h-10 text-warm-300" />
                })()}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-warm-900 text-sm truncate">{board.title}</h3>
                    {board.description && (
                      <p className="text-xs text-warm-500 mt-0.5 line-clamp-1">{board.description}</p>
                    )}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setDeletingId(board.id) }}
                    className="p-1.5 rounded-lg text-warm-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {board.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {board.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-cream-200 text-warm-600 rounded-full text-xs">
                        <Tag className="w-2.5 h-2.5" />{tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-warm-400 mt-2">
                  {format(new Date(board.created_at), 'd MMM yyyy', { locale: sv })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showForm && (
        <Modal title="Ny moodboard" onClose={() => { setShowForm(false); resetForm() }} size="sm">
          <form onSubmit={handleCreate} className="px-6 py-4 space-y-4">
            <div>
              <label className="label">Titel *</label>
              <input className="input-field" required autoFocus value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="label">Beskrivning</label>
              <textarea className="input-field resize-none min-h-[64px]" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div>
              <label className="label">Taggar</label>
              <div className="flex gap-2">
                <input
                  className="input-field flex-1"
                  placeholder="Lägg till tagg…"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const t = tagInput.trim()
                      if (t && !tags.includes(t)) setTags(prev => [...prev, t])
                      setTagInput('')
                    }
                  }}
                />
                <button type="button" className="btn-secondary flex-shrink-0" onClick={() => {
                  const t = tagInput.trim()
                  if (t && !tags.includes(t)) setTags(prev => [...prev, t])
                  setTagInput('')
                }}>+</button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-cream-200 text-warm-700 rounded-full text-xs">
                      {tag}
                      <button type="button" onClick={() => setTags(t => t.filter(x => x !== tag))} className="text-warm-400 hover:text-warm-700">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2 pb-2">
              <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); resetForm() }}>Avbryt</button>
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                {submitting ? 'Skapar…' : 'Skapa'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deletingId && (
        <ConfirmDialog
          title="Radera moodboard"
          message="Alla bilder och färger i denna moodboard raderas. Är du säker?"
          confirmLabel="Radera"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
