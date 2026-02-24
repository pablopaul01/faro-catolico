'use client'

import { useEffect } from 'react'
import { CategoryList } from '@/components/admin/categories/CategoryList'
import { fetchAllMusicCategories, deleteMusicCategory } from '@/services/musicCategories.service'
import { useMusicCategoriesStore } from '@/stores/useMusicCategoriesStore'
import { ROUTES } from '@/lib/constants'

export default function AdminMusicCategoriesPage() {
  const { categories, isLoading, setCategories, setLoading, setError, removeCategory } =
    useMusicCategoriesStore()

  useEffect(() => {
    setLoading(true)
    fetchAllMusicCategories()
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [setCategories, setLoading, setError])

  const handleDelete = async (id: string) => {
    await deleteMusicCategory(id)
    removeCategory(id)
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Categorías de música</h1>
      <p className="text-light/50 text-sm mb-8">Gestiona los momentos o géneros musicales</p>
      <CategoryList
        categories={categories}
        isLoading={isLoading}
        createHref={`${ROUTES.ADMIN_MUSIC_CATEGORIES}/new`}
        editHref={(id) => `${ROUTES.ADMIN_MUSIC_CATEGORIES}/${id}`}
        onDelete={handleDelete}
        entityLabel="categoría"
      />
    </div>
  )
}
