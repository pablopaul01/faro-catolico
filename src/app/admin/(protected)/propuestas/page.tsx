'use client'

import { useEffect, useState, useMemo } from 'react'
import { CheckCircle, XCircle, Trash2, Inbox, Pencil, X, Save, ExternalLink } from 'lucide-react'
import {
  fetchAllSubmissions,
  approveSubmission,
  rejectSubmission,
  deleteSubmission,
  updateSubmission,
} from '@/services/submissions.service'
import { cn } from '@/lib/utils'
import type { Submission } from '@/types/app.types'

const YOUTUBE_WATCH = 'https://www.youtube.com/watch?v='

const TYPE_LABELS: Record<string, string> = { pelicula: 'Película', libro: 'Libro', cancion: 'Canción' }
const TYPE_COLORS: Record<string, string> = {
  pelicula: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
  libro:    'bg-emerald-900/40 text-emerald-300 border-emerald-700/40',
  cancion:  'bg-purple-900/40 text-purple-300 border-purple-700/40',
}
const STATUS_COLORS: Record<string, string> = {
  pendiente: 'text-yellow-400',
  aprobado:  'text-green-400',
  rechazado: 'text-red-400',
}

type Tab = 'todas' | 'pendiente' | 'aprobado' | 'rechazado'
type EditDraft = {
  title?:        string | null
  description?:  string | null
  year?:         number | null
  youtubeId?:    string | null
  externalUrl?:  string | null
  thumbnailUrl?: string | null
  author?:       string | null
  coverUrl?:     string | null
  purchaseUrl?:  string | null
  pdfUrl?:       string | null
  artist?:       string | null
  spotifyUrl?:   string | null
}

const inputCls = 'w-full px-2.5 py-1.5 rounded-sm bg-primary border border-border text-light text-xs placeholder-light/30 focus:outline-none focus:border-accent transition-colors'
const labelCls = 'block text-xs text-light/40 mb-0.5'

function LinkCell({ label, href, text }: { label: string; href: string; text: string }) {
  return (
    <span>
      <span className="text-light/30">{label}:</span>{' '}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent/80 hover:text-accent transition-colors inline-flex items-center gap-1 underline underline-offset-2 break-all"
      >
        {text} <ExternalLink size={10} className="shrink-0" />
      </a>
    </span>
  )
}

function SubmissionCard({
  sub,
  onApprove,
  onReject,
  onDelete,
  onUpdate,
}: {
  sub:       Submission
  onApprove: (s: Submission) => Promise<void>
  onReject:  (id: string) => Promise<void>
  onDelete:  (id: string) => Promise<void>
  onUpdate:  (id: string, draft: EditDraft) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [draft,   setDraft]   = useState<EditDraft>({})

  const startEdit = () => {
    setDraft({
      title:        sub.title,
      description:  sub.description,
      year:         sub.year,
      youtubeId:    sub.youtubeId,
      externalUrl:  sub.externalUrl,
      thumbnailUrl: sub.thumbnailUrl,
      author:       sub.author,
      coverUrl:     sub.coverUrl,
      purchaseUrl:  sub.purchaseUrl,
      pdfUrl:       sub.pdfUrl,
      artist:       sub.artist,
      spotifyUrl:   sub.spotifyUrl,
    })
    setEditing(true)
  }

  const cancelEdit = () => { setEditing(false); setDraft({}) }

  const saveEdit = async () => {
    setSaving(true)
    try { await onUpdate(sub.id, draft) } finally { setSaving(false); setEditing(false) }
  }

  const set = (key: keyof EditDraft) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft((prev) => ({ ...prev, [key]: e.target.value || null }))

  // merged view for read mode (after save, parent state is updated; during edit show draft)
  const view = editing ? { ...sub, ...draft } : sub

  return (
    <div className="bg-secondary border border-border rounded-card p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('text-xs px-2 py-0.5 rounded-full border', TYPE_COLORS[sub.type])}>
            {TYPE_LABELS[sub.type]}
          </span>
          {editing ? (
            <input
              value={draft.title ?? ''}
              onChange={set('title')}
              className="px-2 py-1 rounded-sm bg-primary border border-accent/40 text-light text-sm focus:outline-none focus:border-accent transition-colors"
            />
          ) : (
            <h3 className="text-sm font-medium text-light">{sub.title}</h3>
          )}
          <span className={cn('text-xs font-medium', STATUS_COLORS[sub.status])}>
            • {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
          </span>
        </div>
        <p className="text-xs text-light/30 shrink-0">
          {new Date(sub.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Cuerpo */}
      {editing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="sm:col-span-2">
            <label className={labelCls}>Descripción</label>
            <textarea
              value={draft.description ?? ''}
              onChange={set('description')}
              rows={2}
              className={cn(inputCls, 'resize-none')}
            />
          </div>
          <div>
            <label className={labelCls}>Año</label>
            <input
              type="number"
              value={draft.year ?? ''}
              onChange={set('year')}
              className={inputCls}
            />
          </div>

          {(sub.type === 'pelicula' || sub.type === 'cancion') && (
            <div>
              <label className={labelCls}>YouTube ID</label>
              <input
                value={draft.youtubeId ?? ''}
                onChange={set('youtubeId')}
                placeholder="Ej: dQw4w9WgXcQ"
                className={inputCls}
              />
              {draft.youtubeId && (
                <a
                  href={`${YOUTUBE_WATCH}${draft.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent/70 hover:text-accent mt-0.5 inline-flex items-center gap-1"
                >
                  Ver en YouTube <ExternalLink size={9} />
                </a>
              )}
            </div>
          )}

          {sub.type === 'libro' && (
            <>
              <div>
                <label className={labelCls}>Autor</label>
                <input value={draft.author ?? ''} onChange={set('author')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>URL portada</label>
                <input value={draft.coverUrl ?? ''} onChange={set('coverUrl')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>URL compra</label>
                <input value={draft.purchaseUrl ?? ''} onChange={set('purchaseUrl')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>URL PDF</label>
                <input value={draft.pdfUrl ?? ''} onChange={set('pdfUrl')} className={inputCls} />
              </div>
            </>
          )}

          {sub.type === 'cancion' && (
            <>
              <div>
                <label className={labelCls}>Artista</label>
                <input value={draft.artist ?? ''} onChange={set('artist')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Spotify URL</label>
                <input value={draft.spotifyUrl ?? ''} onChange={set('spotifyUrl')} className={inputCls} />
              </div>
            </>
          )}

          <div>
            <label className={labelCls}>URL externa</label>
            <input value={draft.externalUrl ?? ''} onChange={set('externalUrl')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Thumbnail URL</label>
            <input value={draft.thumbnailUrl ?? ''} onChange={set('thumbnailUrl')} className={inputCls} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-light/50 mb-3">
          {view.author      && <span><span className="text-light/30">Autor:</span> {view.author}</span>}
          {view.artist      && <span><span className="text-light/30">Artista:</span> {view.artist}</span>}
          {view.year        && <span><span className="text-light/30">Año:</span> {view.year}</span>}
          {view.youtubeId   && (
            <LinkCell label="YouTube" href={`${YOUTUBE_WATCH}${view.youtubeId}`} text={`${YOUTUBE_WATCH}${view.youtubeId}`} />
          )}
          {view.spotifyUrl  && <LinkCell label="Spotify"    href={view.spotifyUrl}  text={view.spotifyUrl} />}
          {view.externalUrl && <LinkCell label="URL"        href={view.externalUrl} text={view.externalUrl} />}
          {view.purchaseUrl && <LinkCell label="Compra"     href={view.purchaseUrl} text={view.purchaseUrl} />}
          {view.pdfUrl      && <LinkCell label="PDF"        href={view.pdfUrl}      text={view.pdfUrl} />}
          {view.thumbnailUrl && <LinkCell label="Thumbnail" href={view.thumbnailUrl} text={view.thumbnailUrl} />}
          {view.description && (
            <span className="col-span-2 line-clamp-2">
              <span className="text-light/30">Desc:</span> {view.description}
            </span>
          )}
          {sub.notes          && <span className="col-span-2 italic"><span className="text-light/30">Nota:</span> {sub.notes}</span>}
          {sub.submitterName  && <span><span className="text-light/30">De:</span> {sub.submitterName}</span>}
          {sub.submitterEmail && <span><span className="text-light/30">Email:</span> {sub.submitterEmail}</span>}
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
        {editing ? (
          <>
            <button
              onClick={saveEdit}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-accent/20 text-accent border border-accent/40 rounded-sm hover:bg-accent/30 transition-colors disabled:opacity-50"
            >
              <Save size={12} />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-light/40 border border-border rounded-sm hover:text-light transition-colors"
            >
              <X size={12} />
              Cancelar
            </button>
          </>
        ) : (
          <>
            {sub.status === 'pendiente' && (
              <>
                <button
                  onClick={() => onApprove(sub)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-900/30 text-green-400 border border-green-700/40 rounded-sm hover:bg-green-900/50 transition-colors"
                >
                  <CheckCircle size={12} /> Aprobar
                </button>
                <button
                  onClick={() => onReject(sub.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-900/30 text-red-400 border border-red-700/40 rounded-sm hover:bg-red-900/50 transition-colors"
                >
                  <XCircle size={12} /> Rechazar
                </button>
              </>
            )}
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-light/40 border border-border rounded-sm hover:text-accent hover:border-accent/40 transition-colors"
            >
              <Pencil size={12} /> Editar
            </button>
          </>
        )}
        <button
          onClick={() => onDelete(sub.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-light/40 border border-border rounded-sm hover:text-red-400 hover:border-red-700/40 transition-colors ml-auto"
        >
          <Trash2 size={12} /> Eliminar
        </button>
      </div>
    </div>
  )
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading,   setIsLoading]   = useState(true)
  const [activeTab,   setActiveTab]   = useState<Tab>('pendiente')
  const [error,       setError]       = useState<string | null>(null)

  useEffect(() => {
    fetchAllSubmissions()
      .then(setSubmissions)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(
    () => activeTab === 'todas' ? submissions : submissions.filter((s) => s.status === activeTab),
    [submissions, activeTab]
  )

  const pendingCount = useMemo(
    () => submissions.filter((s) => s.status === 'pendiente').length,
    [submissions]
  )

  const handleApprove = async (sub: Submission) => {
    try {
      await approveSubmission(sub)
      setSubmissions((prev) => prev.map((s) => s.id === sub.id ? { ...s, status: 'aprobado' as const } : s))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al aprobar')
    }
  }

  const handleReject = async (id: string) => {
    await rejectSubmission(id)
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status: 'rechazado' as const } : s))
  }

  const handleDelete = async (id: string) => {
    await deleteSubmission(id)
    setSubmissions((prev) => prev.filter((s) => s.id !== id))
  }

  const handleUpdate = async (id: string, draft: EditDraft) => {
    await updateSubmission(id, draft)
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, ...draft } as Submission : s))
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pendiente', label: `Pendientes${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
    { key: 'todas',     label: 'Todas' },
    { key: 'aprobado',  label: 'Aprobadas' },
    { key: 'rechazado', label: 'Rechazadas' },
  ]

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Propuestas</h1>
      <p className="text-light/50 text-sm mb-6">Contenido enviado por los usuarios para revisión</p>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700/40 rounded-sm text-red-400 text-sm">{error}</div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              'px-4 py-2 rounded-sm text-sm transition-all duration-150',
              activeTab === t.key
                ? 'bg-accent text-primary font-semibold'
                : 'border border-border text-light/50 hover:text-light hover:border-accent/40'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-secondary rounded-card animate-pulse" />)}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16 text-light/30 border border-border rounded-card">
          <Inbox size={32} className="mx-auto mb-3 opacity-40" />
          <p>No hay propuestas en esta categoría</p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((sub) => (
            <SubmissionCard
              key={sub.id}
              sub={sub}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
