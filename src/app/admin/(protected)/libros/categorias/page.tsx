'use client'

import { useEffect } from 'react'
import { CategoryList } from '@/components/admin/categories/CategoryList'
import { fetchAllBookCategories, deleteBookCategory } from '@/services/bookCategories.service'
import { useBookCategoriesStore } from '@/stores/useBookCategoriesStore'
import { ROUTES } from '@/lib/constants'

export default function AdminBookCategoriesPage() {
  const { categories, isLoading, setCategories, setLoading, setError, removeCategory } =
    useBookCategoriesStore()

  useEffect(() => {
    setLoading(true)
    fetchAllBookCategories()
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [setCategories, setLoading, setError])

  const handleDelete = async (id: string) => {
    await deleteBookCategory(id)
    removeCategory(id)
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Categorías de libros</h1>
      <p className="text-light/50 text-sm mb-8">
        Organiza los libros por categoría para facilitar la navegación
      </p>

      <CategoryList
        categories={categories}
        isLoading={isLoading}
        createHref={`${ROUTES.ADMIN_BOOK_CATEGORIES}/new`}
        editHref={(id) => `${ROUTES.ADMIN_BOOK_CATEGORIES}/${id}`}
        onDelete={handleDelete}
        entityLabel="categoría"
      />
    </div>
  )
}
