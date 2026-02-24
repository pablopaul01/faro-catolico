'use client'

import { useEffect } from 'react'
import { CategoryList } from '@/components/admin/categories/CategoryList'
import { fetchAllMovieCategories, deleteMovieCategory } from '@/services/movieCategories.service'
import { useMovieCategoriesStore } from '@/stores/useMovieCategoriesStore'
import { ROUTES } from '@/lib/constants'

export default function AdminMovieCategoriesPage() {
  const { categories, isLoading, setCategories, setLoading, setError, removeCategory } =
    useMovieCategoriesStore()

  useEffect(() => {
    setLoading(true)
    fetchAllMovieCategories()
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [setCategories, setLoading, setError])

  const handleDelete = async (id: string) => {
    await deleteMovieCategory(id)
    removeCategory(id)
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Categorías de películas</h1>
      <p className="text-light/50 text-sm mb-8">
        Organiza las películas por categoría para facilitar la navegación
      </p>

      <CategoryList
        categories={categories}
        isLoading={isLoading}
        createHref={`${ROUTES.ADMIN_MOVIE_CATEGORIES}/new`}
        editHref={(id) => `${ROUTES.ADMIN_MOVIE_CATEGORIES}/${id}`}
        onDelete={handleDelete}
        entityLabel="categoría"
      />
    </div>
  )
}
