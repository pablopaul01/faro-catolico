'use client'

import { useEffect, useState, useMemo } from 'react'
import { CheckCheck, Trash2, Lightbulb } from 'lucide-react'
import {
  fetchAllSuggestions,
  markSuggestionReviewed,
  deleteSuggestion,
} from '@/services/suggestions.service'
import type { Suggestion } from '@/types/app.types'

const TYPE_LABELS: Record<Suggestion['type'], string> = {
  pelicula: 'Película',
  libro:    'Libro',
  cancion:  'Canción',
}

const TYPE_COLORS: Record<Suggestion['type'], string> = {
  pelicula: 'bg-blue-900/30 text-blue-300 border-blue-700/30',
  libro:    'bg-emerald-900/30 text-emerald-300 border-emerald-700/30',
  cancion:  'bg-purple-900/30 text-purple-300 border-purple-700/30',
}

type Filter = 'todas' | 'pendiente' | 'revisado'

export default function AdminSugerenciasPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading,   setIsLoading]   = useState(true)
  const [filter,      setFilter]      = useState<Filter>('todas')

  useEffect(() => {
    fetchAllSuggestions()
      .then(setSuggestions)
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'todas') return suggestions
    return suggestions.filter((s) => s.status === filter)
  }, [suggestions, filter])

  const handleMarkReviewed = async (id: string) => {
    await markSuggestionReviewed(id)
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'revisado' } : s))
    )
  }

  const handleDelete = async (id: string) => {
    await deleteSuggestion(id)
    setSuggestions((prev) => prev.filter((s) => s.id !== id))
  }

  const pendingCount = suggestions.filter((s) => s.status === 'pendiente').length

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-1">Sugerencias</h1>
      <p className="text-light/50 text-sm mb-6">
        Contenido propuesto por los visitantes
        {pendingCount > 0 && (
          <span className="ml-2 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
            {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
          </span>
        )}
      </p>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {(['todas', 'pendiente', 'revisado'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-sm text-sm capitalize transition-colors ${
              filter === f
                ? 'bg-accent text-primary font-semibold'
                : 'border border-border text-light/50 hover:text-light'
            }`}
          >
            {f === 'todas' ? 'Todas' : f === 'pendiente' ? 'Pendientes' : 'Revisadas'}
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
          <Lightbulb size={36} />
          <p>No hay sugerencias{filter !== 'todas' ? ` ${filter === 'pendiente' ? 'pendientes' : 'revisadas'}` : ''}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="bg-secondary border border-border rounded-sm p-4 flex flex-col sm:flex-row sm:items-start gap-3"
            >
              {/* Info principal */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[s.type]}`}>
                    {TYPE_LABELS[s.type]}
                  </span>
                  {s.status === 'revisado' && (
                    <span className="text-xs text-light/30">✓ Revisado</span>
                  )}
                </div>

                <p className="text-light text-sm font-medium truncate">{s.title}</p>

                {s.notes && (
                  <p className="text-light/40 text-xs mt-1 line-clamp-2">{s.notes}</p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-light/30">
                  {s.email && <span>✉ {s.email}</span>}
                  <span>{new Date(s.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 shrink-0">
                {s.status === 'pendiente' && (
                  <button
                    onClick={() => handleMarkReviewed(s.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-sm border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
                    title="Marcar como revisado"
                  >
                    <CheckCheck size={13} />
                    Revisado
                  </button>
                )}
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 text-light/30 hover:text-red-400 hover:bg-red-900/10 rounded-sm transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
