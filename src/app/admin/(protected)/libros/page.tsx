'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { DataTable, type TableColumn } from '@/components/admin/DataTable'
import { fetchAllBooks, deleteBook, updateBook } from '@/services/books.service'
import { fetchAllBookCategories } from '@/services/bookCategories.service'
import { useBooksStore } from '@/stores/useBooksStore'
import { useBookCategoriesStore } from '@/stores/useBookCategoriesStore'
import { ROUTES } from '@/lib/constants'
import type { Book } from '@/types/app.types'

export default function AdminBooksPage() {
  const { books, isLoading, setBooks, setLoading, setError, removeBook, updateBook: updateInStore } = useBooksStore()
  const { categories, setCategories } = useBookCategoriesStore()

  const [search,      setSearch]      = useState('')
  const [filterCatId, setFilterCatId] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchAllBooks(), fetchAllBookCategories()])
      .then(([bks, cats]) => { setBooks(bks); setCategories(cats) })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [setBooks, setCategories, setLoading, setError])

  const filtered = useMemo(() => {
    let result = books
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((b) =>
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      )
    }
    if (filterCatId) {
      result = result.filter((b) => b.categoryId === filterCatId)
    }
    return result
  }, [books, search, filterCatId])

  const catMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories]
  )

  const columns: TableColumn<Book>[] = [
    { key: 'title',  label: 'Título' },
    { key: 'author', label: 'Autor' },
    {
      key: 'categoryId',
      label: 'Categoría',
      render: (b) => (
        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
          {b.categoryId ? (catMap[b.categoryId] ?? '—') : <span className="text-light/30">Sin categoría</span>}
        </span>
      ),
    },
    {
      key: 'year',
      label: 'Año',
      render: (b) => <span className="text-light/50">{b.year ?? '—'}</span>,
    },
  ]

  const handleDelete = async (id: string) => {
    await deleteBook(id)
    removeBook(id)
  }

  const handleTogglePublish = async (id: string, current: boolean) => {
    const updated = await updateBook(id, { isPublished: !current })
    updateInStore(id, updated)
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Libros</h1>
      <p className="text-light/50 text-sm mb-6">Gestiona el catálogo de libros recomendados</p>

      {/* Buscador + filtro */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-light/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por título o autor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-secondary border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm"
          />
        </div>
        {categories.length > 0 && (
          <select
            value={filterCatId}
            onChange={(e) => setFilterCatId(e.target.value)}
            className="px-4 py-2.5 rounded-sm bg-secondary border border-border text-light focus:outline-none focus:border-accent transition-colors text-sm cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        createHref={`${ROUTES.ADMIN_BOOKS}/new`}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        editHref={(id) => `${ROUTES.ADMIN_BOOKS}/${id}`}
        entityLabel="libro"
      />
    </div>
  )
}
