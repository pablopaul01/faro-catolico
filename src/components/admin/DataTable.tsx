'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Eye, EyeOff, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
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

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

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
  const [deletingId, setDeletingId]  = useState<string | null>(null)
  const [togglingId, setTogglingId]  = useState<string | null>(null)
  const [confirmId,  setConfirmId]   = useState<string | null>(null)
  const [page,       setPage]        = useState(1)
  const [pageSize,   setPageSize]    = useState(10)

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

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
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

  // ── Paginación ────────────────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(data.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start       = (currentPage - 1) * pageSize
  const pageData    = data.slice(start, start + pageSize)

  // ── Cabecera ──────────────────────────────────────────────────────────
  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <p className="text-light/50 text-sm">{data.length} {entityLabel}(s) en total</p>
        <div className="flex items-center gap-1.5">
          <span className="text-light/30 text-xs hidden sm:inline">Por página:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="bg-secondary border border-border text-light text-xs rounded-sm px-2 py-1 focus:outline-none focus:border-accent"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <Link
        href={createHref}
        className="flex items-center gap-2 px-4 py-2 bg-accent text-primary text-sm font-semibold rounded-sm hover:bg-accent/90 transition-colors"
      >
        <Plus size={16} />
        Agregar
      </Link>
    </div>
  )

  if (data.length === 0) {
    return (
      <div>
        {header}
        <div className="text-center py-16 text-light/30">
          <p>No hay {entityLabel}s todavía.</p>
          <Link href={createHref} className="text-accent text-sm hover:underline mt-2 inline-block">
            Agregar el primero
          </Link>
        </div>
      </div>
    )
  }

  // ── Controles de paginación ───────────────────────────────────────────
  const pagination = (
    <div className="flex flex-wrap items-center justify-end gap-3 mt-4">
      {/* Info + navegación */}
      <div className="flex items-center gap-3">
        <span className="text-light/40 text-xs">
          {start + 1}–{Math.min(start + pageSize, data.length)} de {data.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-sm text-light/40 hover:text-light hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>
          {/* Números de página */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .reduce<(number | '...')[]>((acc, p, idx, arr) => {
              if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                acc.push('...')
              }
              acc.push(p)
              return acc
            }, [])
            .map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-1 text-light/30 text-xs">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={cn(
                    'w-7 h-7 rounded-sm text-xs font-medium transition-colors',
                    currentPage === p
                      ? 'bg-accent text-primary'
                      : 'text-light/50 hover:text-light hover:bg-white/5'
                  )}
                >
                  {p}
                </button>
              )
            )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-sm text-light/40 hover:text-light hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Página siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  // ── Acciones ──────────────────────────────────────────────────────────
  const renderActions = (row: T) => (
    <div className="flex items-center flex-wrap gap-2">
      <button
        onClick={() => handleToggle(row.id, row.isPublished)}
        disabled={togglingId === row.id}
        title={row.isPublished ? 'Despublicar' : 'Publicar'}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border transition-colors',
          row.isPublished
            ? 'border-green-700/50 text-green-400 hover:bg-green-900/20'
            : 'border-border text-light/40 hover:bg-white/5'
        )}
      >
        {row.isPublished ? <Eye size={13} /> : <EyeOff size={13} />}
        {row.isPublished ? 'Publicado' : 'Borrador'}
      </button>
      <Link
        href={editHref(row.id)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border border-border text-light/50 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-colors"
      >
        <Pencil size={13} />
        Editar
      </Link>
      {confirmId === row.id ? (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleDelete(row.id)}
            disabled={deletingId === row.id}
            className="px-3 py-1.5 text-xs bg-red-700 text-white rounded-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {deletingId === row.id ? '...' : 'Confirmar'}
          </button>
          <button
            onClick={() => setConfirmId(null)}
            className="px-2 py-1.5 text-xs text-light/40 hover:text-light transition-colors"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmId(row.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border border-border text-light/30 hover:text-red-400 hover:border-red-800/50 hover:bg-red-900/10 transition-colors"
        >
          <Trash2 size={13} />
          Eliminar
        </button>
      )}
    </div>
  )

  return (
    <div>
      {header}

      {/* ── Vista CARDS — mobile (< md) ───────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {pageData.map((row) => (
          <div key={row.id} className="bg-secondary border border-border rounded-card p-4 space-y-3">
            {columns.map((col) => (
              <div key={String(col.key)}>
                <p className="text-light/40 text-xs mb-0.5">{col.label}</p>
                <div className="text-light/80 text-sm">
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-border">
              {renderActions(row)}
            </div>
          </div>
        ))}
      </div>

      {/* ── Vista TABLA — desktop (md+) ───────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto rounded-card border border-border">
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
            {pageData.map((row) => (
              <tr key={row.id} className="hover:bg-white/2 transition-colors">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-light/80">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
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
                    <Link
                      href={editHref(row.id)}
                      className="p-1.5 rounded-sm text-light/50 hover:text-accent hover:bg-accent/10 transition-colors"
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </Link>
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

      {/* Paginación — siempre visible con datos */}
      {pagination}
    </div>
  )
}
