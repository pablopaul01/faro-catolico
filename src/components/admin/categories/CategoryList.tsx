'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Plus } from 'lucide-react'
import type { MovieCategory, BookCategory } from '@/types/app.types'

interface CategoryListProps {
  categories:  (MovieCategory | BookCategory)[]
  isLoading:   boolean
  createHref:  string
  editHref:    (id: string) => string
  onDelete:    (id: string) => Promise<void>
  entityLabel: string
}

export const CategoryList = ({
  categories,
  isLoading,
  createHref,
  editHref,
  onDelete,
  entityLabel,
}: CategoryListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId,  setConfirmId]  = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 bg-secondary rounded-sm animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-light/50 text-sm">{categories.length} {entityLabel}(s)</p>
        <Link
          href={createHref}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-primary text-sm font-semibold rounded-sm hover:bg-accent/90 transition-colors"
        >
          <Plus size={16} />
          Agregar
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 text-light/30">
          <p>No hay {entityLabel}s todavía.</p>
          <Link href={createHref} className="text-accent text-sm hover:underline mt-2 inline-block">
            Agregar la primera
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/80 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-light/50 font-medium text-xs uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-light/50 font-medium text-xs uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-4 py-3 text-right text-light/50 font-medium text-xs uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-light/80">{cat.name}</td>
                  <td className="px-4 py-3 text-light/40 text-xs">{cat.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={editHref(cat.id)}
                        className="p-1.5 rounded-sm text-light/50 hover:text-accent hover:bg-accent/10 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </Link>

                      {confirmId === cat.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(cat.id)}
                            disabled={deletingId === cat.id}
                            className="px-2 py-1 text-xs bg-red-700 text-white rounded-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
                          >
                            {deletingId === cat.id ? '...' : 'Confirmar'}
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
                          onClick={() => setConfirmId(cat.id)}
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
