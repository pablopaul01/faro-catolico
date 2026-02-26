'use client'

import { useEffect, useState, useMemo } from 'react'
import { Flag, CheckCircle, Trash2 } from 'lucide-react'
import {
  fetchAllReports,
  updateReportStatus,
  deleteReport,
} from '@/services/reports.service'
import type { Report, ReportContentType } from '@/types/app.types'

type Filter = 'todos' | 'pendiente' | 'resuelto'

const TYPE_LABELS: Record<ReportContentType, string> = {
  pelicula:        'Película',
  libro:           'Libro',
  cancion:         'Canción',
  playlist:        'Playlist',
  youtube_playlist: 'Playlist YT',
  youtube_channel:  'Canal YT',
}

const TYPE_COLORS: Record<ReportContentType, string> = {
  pelicula:        'bg-blue-900/30 text-blue-300 border-blue-700/40',
  libro:           'bg-green-900/30 text-green-300 border-green-700/40',
  cancion:         'bg-yellow-900/30 text-yellow-300 border-yellow-700/40',
  playlist:        'bg-emerald-900/30 text-emerald-300 border-emerald-700/40',
  youtube_playlist: 'bg-red-900/30 text-red-300 border-red-700/40',
  youtube_channel:  'bg-orange-900/30 text-orange-300 border-orange-700/40',
}

export default function AdminReportesPage() {
  const [reports,   setReports]   = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter,    setFilter]    = useState<Filter>('pendiente')
  const [confirming, setConfirming] = useState<string | null>(null)

  useEffect(() => {
    fetchAllReports()
      .then(setReports)
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'todos') return reports
    return reports.filter((r) => r.status === filter)
  }, [reports, filter])

  const pendingCount = reports.filter((r) => r.status === 'pendiente').length

  const handleResolve = async (id: string) => {
    await updateReportStatus(id, 'resuelto')
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resuelto' } : r))
    )
  }

  const handleDelete = async (id: string) => {
    await deleteReport(id)
    setReports((prev) => prev.filter((r) => r.id !== id))
    setConfirming(null)
  }

  const TABS: { value: Filter; label: string }[] = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'resuelto',  label: 'Resuelto'  },
    { value: 'todos',     label: 'Todos'      },
  ]

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-1">Reportes</h1>
      <p className="text-light/50 text-sm mb-6">
        Problemas reportados por los visitantes
        {pendingCount > 0 && (
          <span className="ml-2 px-2 py-0.5 rounded-full bg-red-900/30 text-red-300 border border-red-700/40 text-xs font-medium">
            {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
          </span>
        )}
      </p>

      <div className="flex gap-2 mb-6">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-1.5 rounded-sm text-sm transition-colors ${
              filter === value
                ? 'bg-accent text-primary font-semibold'
                : 'border border-border text-light/50 hover:text-light'
            }`}
          >
            {label}
            {value === 'pendiente' && pendingCount > 0 && (
              <span className="ml-1.5 text-xs bg-red-900/40 text-red-300 px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-secondary rounded-sm animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-light/30">
          <Flag size={36} />
          <p>No hay reportes{filter !== 'todos' ? ` ${filter === 'pendiente' ? 'pendientes' : 'resueltos'}` : ''}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className={`bg-secondary border rounded-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-colors ${
                r.status === 'pendiente' ? 'border-red-700/30' : 'border-border'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-sm border ${TYPE_COLORS[r.contentType]}`}>
                    {TYPE_LABELS[r.contentType]}
                  </span>
                  {r.status === 'resuelto' && (
                    <span className="text-xs px-2 py-0.5 rounded-sm border bg-green-900/20 text-green-400 border-green-700/40">
                      Resuelto
                    </span>
                  )}
                  <p className="text-light text-sm font-medium truncate">{r.contentTitle}</p>
                </div>

                <p className="text-light/50 text-sm">
                  <span className="text-light/30">Motivo: </span>{r.reason}
                </p>

                <p className="text-light/30 text-xs mt-1">
                  {new Date(r.createdAt).toLocaleDateString('es-AR', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {r.status === 'pendiente' && (
                  <button
                    onClick={() => handleResolve(r.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-sm border border-green-700/40 text-green-400 hover:bg-green-900/20 transition-colors"
                  >
                    <CheckCircle size={13} />
                    Resuelto
                  </button>
                )}

                {confirming === r.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="px-2 py-1.5 text-xs rounded-sm bg-red-900/30 border border-red-700/40 text-red-400 hover:bg-red-900/50 transition-colors"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setConfirming(null)}
                      className="px-2 py-1.5 text-xs rounded-sm border border-border text-light/40 hover:text-light transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirming(r.id)}
                    className="p-1.5 text-light/30 hover:text-red-400 hover:bg-red-900/10 rounded-sm transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
