'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Eye, EyeOff, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TableColumn<T> {
  key:    keyof T | string
  label:  string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T extends { id: string; isPublished: boolean }> {
  columns:         TableColumn<T>[]
  data:            T[]
  isLoading:       boolean
  createHref:      string
  onDelete:        (id: string) => Promise<void>
  onTogglePublish: (id: string, current: boolean) => Promise<void>
  editHref:        (id: string) => string
  entityLabel:     string
}

export const DataTable = <T extends { id: string; isPublished: boolean }>({
  columns,
  data,
  isLoading,
  createHref,
  onDelete,
  onTogglePublish,
  editHref,
  entityLabel,
}: DataTableProps<T>) => {
  const [deletingId, setDeletingId]   = useState<string | null>(null)
  const [togglingId,  setTogglingId]  = useState<string | null>(null)
  const [confirmId,   setConfirmId]   = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id)
    try {
      await onTogglePublish(id, current)
    } finally {
      setTogglingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-secondary rounded-sm animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Header con botón crear */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-light/50 text-sm">{data.length} {entityLabel}(s) en total</p>
        <Link
          href={createHref}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-primary text-sm font-semibold rounded-sm hover:bg-accent/90 transition-colors"
        >
          <Plus size={16} />
          Agregar
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-16 text-light/30">
          <p>No hay {entityLabel}s todavía.</p>
          <Link href={createHref} className="text-accent text-sm hover:underline mt-2 inline-block">
            Agregar el primero
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/80 border-b border-border">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="px-4 py-3 text-left text-light/50 font-medium text-xs uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-light/50 font-medium text-xs uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-white/2 transition-colors">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-light/80">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {/* Toggle publicar */}
                      <button
                        onClick={() => handleToggle(row.id, row.isPublished)}
                        disabled={togglingId === row.id}
                        title={row.isPublished ? 'Despublicar' : 'Publicar'}
                        className={cn(
                          'p-1.5 rounded-sm transition-colors',
                          row.isPublished
                            ? 'text-green-400 hover:bg-green-900/20'
                            : 'text-light/30 hover:bg-white/5'
                        )}
                      >
                        {row.isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>

                      {/* Editar */}
                      <Link
                        href={editHref(row.id)}
                        className="p-1.5 rounded-sm text-light/50 hover:text-accent hover:bg-accent/10 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </Link>

                      {/* Eliminar */}
                      {confirmId === row.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(row.id)}
                            disabled={deletingId === row.id}
                            className="px-2 py-1 text-xs bg-red-700 text-white rounded-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
                          >
                            {deletingId === row.id ? '...' : 'Confirmar'}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="px-2 py-1 text-xs text-light/40 hover:text-light transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(row.id)}
                          className="p-1.5 rounded-sm text-light/30 hover:text-red-400 hover:bg-red-900/10 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
