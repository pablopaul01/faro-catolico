'use client'

import { useEffect } from 'react'
import { CategoryList } from '@/components/admin/categories/CategoryList'
import { fetchAllMoviePlatforms, deleteMoviePlatform } from '@/services/moviePlatforms.service'
import { useMoviePlatformsStore } from '@/stores/useMoviePlatformsStore'
import { ROUTES } from '@/lib/constants'

export default function AdminMoviePlatformsPage() {
  const { platforms, isLoading, setPlatforms, setLoading, setError, removePlatform } =
    useMoviePlatformsStore()

  useEffect(() => {
    setLoading(true)
    fetchAllMoviePlatforms()
      .then(setPlatforms)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [setPlatforms, setLoading, setError])

  const handleDelete = async (id: string) => {
    await deleteMoviePlatform(id)
    removePlatform(id)
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Plataformas de streaming</h1>
      <p className="text-light/50 text-sm mb-8">
        Gestiona las plataformas disponibles (Netflix, Prime Video, etc.) para asociarlas a las películas
      </p>

      <CategoryList
        categories={platforms}
        isLoading={isLoading}
        createHref={`${ROUTES.ADMIN_MOVIE_PLATFORMS}/new`}
        editHref={(id) => `${ROUTES.ADMIN_MOVIE_PLATFORMS}/${id}`}
        onDelete={handleDelete}
        entityLabel="plataforma"
      />
    </div>
  )
}
