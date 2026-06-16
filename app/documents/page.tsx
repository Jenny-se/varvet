'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import {
  Upload, Search, FolderOpen, FileText, FileImage, FileSpreadsheet,
  Trash2, Download, Tag, X
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DocumentFile } from '@/lib/types'
import { logActivity } from '@/lib/activity'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'

const BUCKET = 'documents'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileIcon({ type }: { type: string | null }) {
  if (!type) return <FileText className="w-5 h-5 text-warm-400" />
  if (type.includes('image')) return <FileImage className="w-5 h-5 text-blue-500" />
  if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv'))
    return <FileSpreadsheet className="w-5 h-5 text-sage-600" />
  return <FileText className="w-5 h-5 text-warm-400" />
}

function fileTypeBadge(type: string | null) {
  if (!type) return 'Okänd'
  if (type.includes('pdf')) return 'PDF'
  if (type.includes('image')) return 'Bild'
  if (type.includes('spreadsheet') || type.includes('excel')) return 'Excel'
  if (type.includes('csv')) return 'CSV'
  if (type.includes('word') || type.includes('document')) return 'Word'
  if (type.includes('text')) return 'Text'
  return type.split('/')[1]?.toUpperCase() ?? 'Fil'
}

export default function DocumentFilesPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [documents, setDocumentFiles] = useState<DocumentFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Upload form state
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [docName, setDocName] = useState('')
  const [docDescription, setDocDescription] = useState('')
  const [docTags, setDocTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const fetchDocumentFiles = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
    setDocumentFiles(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchDocumentFiles() }, [fetchDocumentFiles])

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    setDocName(file.name.replace(/\.[^.]+$/, ''))
    setShowUploadForm(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!pendingFile) return
    setUploading(true)
    setUploadError(null)

    const safeName = pendingFile.name
      .split('').map(c => {
        if (c === ' ') return '_'
        if (c.charCodeAt(0) > 127) return '_'
        if (!/[a-zA-Z0-9._-]/.test(c)) return '_'
        return c
      }).join('')
    const path = `${Date.now()}_${safeName}`

    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .upload(path, pendingFile, { upsert: false })

    if (storageError) {
      setUploadError(`Uppladdning misslyckades: ${storageError.message}`)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)

    const { data, error: dbError } = await supabase.from('documents').insert({
      name: docName.trim() || pendingFile.name,
      description: docDescription.trim() || null,
      file_url: publicUrl,
      file_path: path,
      file_size: pendingFile.size,
      file_type: pendingFile.type,
      tags: docTags,
    }).select().single()

    if (!dbError && data) {
      await logActivity('Laddade upp dokument', 'document', data.id, data.name)
    }

    setUploading(false)
    setShowUploadForm(false)
    setPendingFile(null)
    setDocName('')
    setDocDescription('')
    setDocTags([])
    fetchDocumentFiles()
  }

  async function handleDelete() {
    if (!deletingId) return
    const doc = documents.find(d => d.id === deletingId)
    if (doc?.file_path) {
      await supabase.storage.from(BUCKET).remove([doc.file_path])
    }
    await supabase.from('documents').delete().eq('id', deletingId)
    if (doc) await logActivity('Raderade dokument', 'document', deletingId, doc.name)
    setDeletingId(null)
    fetchDocumentFiles()
  }

  const filtered = documents.filter(doc => {
    if (search && !doc.name.toLowerCase().includes(search.toLowerCase()) &&
        !doc.description?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterType === 'pdf' && !doc.file_type?.includes('pdf')) return false
    if (filterType === 'image' && !doc.file_type?.includes('image')) return false
    if (filterType === 'spreadsheet' && !doc.file_type?.includes('spreadsheet') &&
        !doc.file_type?.includes('excel') && !doc.file_type?.includes('csv')) return false
    return true
  })

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Dokument</h1>
          <p className="text-sm text-warm-500 mt-0.5">{documents.length} filer</p>
        </div>
        <div>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Ladda upp
          </button>
        </div>
      </div>

      {/* Upload form */}
      {showUploadForm && pendingFile && (
        <div className="card p-5 mb-6 border-sage-300">
          <div className="flex items-center gap-3 mb-4">
            <FileIcon type={pendingFile.type} />
            <div>
              <p className="text-sm font-medium text-warm-800">{pendingFile.name}</p>
              <p className="text-xs text-warm-400">{formatBytes(pendingFile.size)}</p>
            </div>
          </div>
          <form onSubmit={handleUpload} className="space-y-3">
            <div>
              <label className="label">Namn</label>
              <input className="input-field" value={docName} onChange={e => setDocName(e.target.value)} required />
            </div>
            <div>
              <label className="label">Beskrivning</label>
              <input className="input-field" value={docDescription} onChange={e => setDocDescription(e.target.value)} placeholder="Valfri beskrivning…" />
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
                      if (t && !docTags.includes(t)) setDocTags(p => [...p, t])
                      setTagInput('')
                    }
                  }}
                />
                <button type="button" className="btn-secondary flex-shrink-0" onClick={() => {
                  const t = tagInput.trim()
                  if (t && !docTags.includes(t)) setDocTags(p => [...p, t])
                  setTagInput('')
                }}>+</button>
              </div>
              {docTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {docTags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-cream-200 text-warm-700 rounded-full text-xs">
                      {tag}
                      <button type="button" onClick={() => setDocTags(t => t.filter(x => x !== tag))} className="text-warm-400 hover:text-warm-700">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {uploadError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{uploadError}</p>
            )}
            <div className="flex gap-3 justify-end pt-1">
              <button type="button" className="btn-secondary" onClick={() => { setShowUploadForm(false); setPendingFile(null) }}>Avbryt</button>
              <button type="submit" disabled={uploading} className="btn-primary disabled:opacity-60">
                {uploading ? 'Laddar upp…' : 'Ladda upp'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
            <input
              className="input-field pl-9"
              placeholder="Sök dokument…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field sm:w-40" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">Alla typer</option>
            <option value="pdf">PDF</option>
            <option value="image">Bilder</option>
            <option value="spreadsheet">Kalkylark</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-4 h-16 animate-pulse bg-cream-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Inga dokument"
          description="Ladda upp PDF:er, bilder, kalkylark eller andra filer."
          action={
            <button onClick={() => fileInputRef.current?.click()} className="btn-primary flex items-center gap-2 mx-auto">
              <Upload className="w-4 h-4" /> Ladda upp fil
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(doc => (
            <div key={doc.id} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
                <FileIcon type={doc.file_type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-warm-900 truncate">{doc.name}</p>
                  <span className="text-xs bg-cream-200 text-warm-600 px-2 py-0.5 rounded-full flex-shrink-0">
                    {fileTypeBadge(doc.file_type)}
                  </span>
                </div>
                {doc.description && (
                  <p className="text-xs text-warm-500 mt-0.5 truncate">{doc.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {doc.file_size && (
                    <span className="text-xs text-warm-400">{formatBytes(doc.file_size)}</span>
                  )}
                  <span className="text-xs text-warm-400">
                    {format(new Date(doc.created_at), 'd MMM yyyy', { locale: sv })}
                  </span>
                  {doc.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 text-xs text-warm-500">
                      <Tag className="w-2.5 h-2.5" />{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="p-2 rounded-lg text-warm-400 hover:text-sage-600 hover:bg-sage-100 transition-colors"
                  title="Ladda ner"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setDeletingId(doc.id)}
                  className="p-2 rounded-lg text-warm-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Radera"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deletingId && (
        <ConfirmDialog
          title="Radera dokument"
          message="Filen raderas permanent. Är du säker?"
          confirmLabel="Radera"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
