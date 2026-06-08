'use client'

import { useEffect, useState, useRef } from 'react'
import { Supplier, SupplierLog, SupplierLogType, SupplierFile } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import {
  Globe, Mail, Phone, MapPin, Clock, ShoppingBag,
  Edit2, Phone as PhoneIcon, Mail as MailIcon,
  Coffee, ShoppingCart, FileText, MessageSquare, Plus,
  Paperclip, Upload, Download, Trash2, File
} from 'lucide-react'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'

const FILE_BUCKET = 'supplier-files'

function formatBytes(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const LOG_TYPES: { value: SupplierLogType; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'note',    label: 'Anteckning', icon: FileText,      color: 'text-warm-500' },
  { value: 'call',    label: 'Samtal',     icon: PhoneIcon,     color: 'text-sage-600' },
  { value: 'email',   label: 'E-post',     icon: MailIcon,      color: 'text-blue-600' },
  { value: 'meeting', label: 'Möte',       icon: Coffee,        color: 'text-amber-600' },
  { value: 'order',   label: 'Beställning',icon: ShoppingCart,  color: 'text-bark-500' },
]

interface SupplierDetailModalProps {
  supplier: Supplier
  onClose: () => void
  onEdit: () => void
}

export function SupplierDetailModal({ supplier, onClose, onEdit }: SupplierDetailModalProps) {
  const [tab, setTab] = useState<'info' | 'log' | 'files'>('info')
  const [logs, setLogs] = useState<SupplierLog[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [logType, setLogType] = useState<SupplierLogType>('note')
  const [logMessage, setLogMessage] = useState('')
  const [logDate, setLogDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [logError, setLogError] = useState<string | null>(null)

  const [files, setFiles] = useState<SupplierFile[]>([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (tab === 'log') fetchLogs()
    if (tab === 'files') fetchFiles()
  }, [tab])

  async function fetchFiles() {
    setLoadingFiles(true)
    const { data } = await supabase
      .from('supplier_files')
      .select('*')
      .eq('supplier_id', supplier.id)
      .order('created_at', { ascending: false })
    setFiles(data ?? [])
    setLoadingFiles(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setFileError(null)
    const path = `${supplier.id}/${Date.now()}_${file.name}`
    const { error: storageError } = await supabase.storage
      .from(FILE_BUCKET)
      .upload(path, file)
    if (storageError) {
      setFileError(`Uppladdning misslyckades: ${storageError.message}`)
    } else {
      const { data: { publicUrl } } = supabase.storage.from(FILE_BUCKET).getPublicUrl(path)
      const { data: saved } = await supabase
        .from('supplier_files')
        .insert({ supplier_id: supplier.id, name: file.name, file_path: path, file_url: publicUrl, file_size: file.size, file_type: file.type })
        .select()
        .single()
      if (saved) setFiles(prev => [saved, ...prev])
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleDeleteFile(fileId: string) {
    const f = files.find(f => f.id === fileId)
    if (!f) return
    await supabase.storage.from(FILE_BUCKET).remove([f.file_path])
    await supabase.from('supplier_files').delete().eq('id', fileId)
    setFiles(prev => prev.filter(f => f.id !== fileId))
    setDeletingFileId(null)
  }

  async function fetchLogs() {
    setLoadingLogs(true)
    const { data } = await supabase
      .from('supplier_logs')
      .select('*')
      .eq('supplier_id', supplier.id)
      .order('created_at', { ascending: false })
    setLogs(data ?? [])
    setLoadingLogs(false)
  }

  async function handleAddLog(e: React.FormEvent) {
    e.preventDefault()
    if (!logMessage.trim()) return
    setSaving(true)
    setLogError(null)
    const { data, error } = await supabase
      .from('supplier_logs')
      .insert({ supplier_id: supplier.id, type: logType, message: logMessage.trim(), log_date: logDate || null })
      .select()
      .single()
    if (error) {
      setLogError(`Kunde inte spara: ${error.message}`)
    } else if (data) {
      setLogs(prev => [data, ...prev])
      setLogMessage('')
      setLogDate('')
    }
    setSaving(false)
  }

  const logConfig = (type: SupplierLogType) => LOG_TYPES.find(t => t.value === type)!

  return (
    <Modal title={supplier.company_name} onClose={onClose} size="lg">
      {/* Tabs + Edit button */}
      <div className="flex items-center justify-between px-6 pt-2 pb-0 border-b border-cream-300">
        <div className="flex gap-1">
          {([['info', 'Information'], ['log', 'Logg'], ['files', 'Filer']] as const).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? 'border-sage-500 text-sage-700'
                  : 'border-transparent text-warm-500 hover:text-warm-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button onClick={onEdit} className="flex items-center gap-1.5 text-xs text-warm-500 hover:text-warm-800 mb-1 mr-1 px-2 py-1.5 rounded-lg hover:bg-cream-200 transition-colors">
          <Edit2 className="w-3.5 h-3.5" /> Redigera
        </button>
      </div>

      {/* INFO TAB */}
      {tab === 'info' && (
        <div className="px-6 py-5 space-y-5">
          {/* Status + contact person */}
          <div className="flex items-center gap-3">
            <span className={`badge ${supplier.status === 'active' ? 'bg-sage-100 text-sage-700' : 'bg-warm-100 text-warm-500'}`}>
              {supplier.status === 'active' ? 'Aktiv' : 'Inaktiv'}
            </span>
            {supplier.contact_person && (
              <span className="text-sm text-warm-700">{supplier.contact_person}</span>
            )}
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {supplier.email && (
              <a href={`mailto:${supplier.email}`} className="flex items-center gap-2 text-sm text-warm-700 hover:text-sage-600 transition-colors">
                <Mail className="w-4 h-4 text-warm-400 flex-shrink-0" />
                {supplier.email}
              </a>
            )}
            {supplier.phone && (
              <a href={`tel:${supplier.phone}`} className="flex items-center gap-2 text-sm text-warm-700 hover:text-sage-600 transition-colors">
                <Phone className="w-4 h-4 text-warm-400 flex-shrink-0" />
                {supplier.phone}
              </a>
            )}
            {supplier.website && (
              <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-warm-700 hover:text-sage-600 transition-colors">
                <Globe className="w-4 h-4 text-warm-400 flex-shrink-0" />
                {supplier.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {supplier.country_of_origin && (
              <span className="flex items-center gap-2 text-sm text-warm-700">
                <MapPin className="w-4 h-4 text-warm-400 flex-shrink-0" />
                {supplier.country_of_origin}
              </span>
            )}
          </div>

          {supplier.address && (
            <p className="text-sm text-warm-600 bg-cream-100 rounded-lg px-3 py-2">{supplier.address}</p>
          )}

          {/* Order info */}
          {(supplier.minimum_order_quantity || supplier.lead_time_days) && (
            <div className="flex gap-6">
              {supplier.minimum_order_quantity && (
                <div className="flex items-center gap-2 text-sm text-warm-700">
                  <ShoppingBag className="w-4 h-4 text-warm-400" />
                  <span>Min. order: <strong>{supplier.minimum_order_quantity} st</strong></span>
                </div>
              )}
              {supplier.lead_time_days && (
                <div className="flex items-center gap-2 text-sm text-warm-700">
                  <Clock className="w-4 h-4 text-warm-400" />
                  <span>Ledtid: <strong>{supplier.lead_time_days} dagar</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Fibers */}
          {supplier.fiber_specialties.length > 0 && (
            <div>
              <p className="text-xs font-medium text-warm-500 uppercase tracking-wide mb-2">Fiberspecialiteter</p>
              <div className="flex flex-wrap gap-1.5">
                {supplier.fiber_specialties.map(f => <Badge key={f} label={f} variant="sage" />)}
              </div>
            </div>
          )}

          {/* Certifications */}
          {supplier.certifications.length > 0 && (
            <div>
              <p className="text-xs font-medium text-warm-500 uppercase tracking-wide mb-2">Certifieringar</p>
              <div className="flex flex-wrap gap-1.5">
                {supplier.certifications.map(c => <Badge key={c} label={c} variant="linen" />)}
              </div>
            </div>
          )}

          {/* Notes */}
          {supplier.notes && (
            <div>
              <p className="text-xs font-medium text-warm-500 uppercase tracking-wide mb-2">Anteckningar</p>
              <p className="text-sm text-warm-700 bg-cream-100 rounded-lg px-3 py-2 leading-relaxed">{supplier.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* LOG TAB */}
      {tab === 'log' && (
        <div className="px-6 py-5 space-y-4">
          {/* Add log entry */}
          <form onSubmit={handleAddLog} className="space-y-3 bg-cream-100 rounded-xl p-4">
            <div className="flex gap-2 flex-wrap">
              {LOG_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLogType(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    logType === value
                      ? 'bg-sage-500 border-sage-500 text-white'
                      : 'bg-white border-cream-400 text-warm-600 hover:border-sage-400'
                  }`}
                >
                  <Icon className="w-3 h-3" />{label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-start">
              <textarea
                className="input-field flex-1 resize-none min-h-[64px] text-sm"
                placeholder="Skriv en anteckning…"
                value={logMessage}
                onChange={e => setLogMessage(e.target.value)}
              />
              <div className="flex-shrink-0">
                <label className="label">Datum</label>
                <input
                  type="date"
                  className="input-field text-sm w-36"
                  value={logDate}
                  onChange={e => setLogDate(e.target.value)}
                />
              </div>
            </div>
            {logError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{logError}</p>
            )}
            <div className="flex justify-end">
              <button type="submit" disabled={saving || !logMessage.trim()} className="btn-primary flex items-center gap-1.5 disabled:opacity-60">
                <Plus className="w-3.5 h-3.5" />
                {saving ? 'Sparar…' : 'Lägg till'}
              </button>
            </div>
          </form>

          {/* Log entries */}
          {loadingLogs ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-cream-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-warm-300 mx-auto mb-2" />
              <p className="text-sm text-warm-400">Ingen logg ännu</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map(log => {
                const cfg = logConfig(log.type)
                const Icon = cfg.icon
                return (
                  <div key={log.id} className="flex gap-3 p-3 bg-white rounded-xl border border-cream-300">
                    <div className="w-7 h-7 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-warm-600">{cfg.label}</span>
                        <span className="text-xs text-warm-400">
                          {log.log_date
                            ? format(new Date(log.log_date), 'd MMM yyyy', { locale: sv })
                            : format(new Date(log.created_at), 'd MMM yyyy', { locale: sv })}
                        </span>
                      </div>
                      <p className="text-sm text-warm-800 leading-relaxed">{log.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* FILES TAB */}
      {tab === 'files' && (
        <div className="px-6 py-5 space-y-4">
          {/* Upload button */}
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
          <div className="flex items-center justify-between">
            <p className="text-sm text-warm-600">{files.length} {files.length === 1 ? 'fil' : 'filer'}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-primary flex items-center gap-2 disabled:opacity-60"
            >
              <Upload className="w-3.5 h-3.5" />
              {uploading ? 'Laddar upp…' : 'Ladda upp fil'}
            </button>
          </div>

          {fileError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{fileError}</p>
          )}

          {loadingFiles ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-cream-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8">
              <Paperclip className="w-8 h-8 text-warm-300 mx-auto mb-2" />
              <p className="text-sm text-warm-400">Inga filer uppladdade</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map(f => (
                <div key={f.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-cream-300 group">
                  <div className="w-8 h-8 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
                    <File className="w-4 h-4 text-warm-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-warm-800 truncate">{f.name}</p>
                    <p className="text-xs text-warm-400">
                      {formatBytes(f.file_size)}{f.file_size ? ' · ' : ''}{format(new Date(f.created_at), 'd MMM yyyy', { locale: sv })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={f.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={f.name}
                      className="p-1.5 rounded-lg text-warm-400 hover:text-sage-600 hover:bg-sage-50 transition-colors"
                      title="Ladda ner"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => {
                        if (confirm(`Radera "${f.name}"?`)) handleDeleteFile(f.id)
                      }}
                      className="p-1.5 rounded-lg text-warm-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Radera"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
