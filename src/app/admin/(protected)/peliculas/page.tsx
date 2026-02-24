'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { DataTable, type TableColumn } from '@/components/admin/DataTable'
import { fetchAllMovies, deleteMovie, updateMovie } from '@/services/movies.service'
import { fetchAllMovieCategories } from '@/services/movieCategories.service'
import { useMoviesStore } from '@/stores/useMoviesStore'
import { useMovieCategoriesStore } from '@/stores/useMovieCategoriesStore'
import { ROUTES } from '@/lib/constants'
import type { Movie } from '@/types/app.types'

export default function AdminMoviesPage() {
  const { movies, isLoading, setMovies, setLoading, setError, removeMovie, updateMovie: updateInStore } = useMoviesStore()
  const { categories, setCategories } = useMovieCategoriesStore()

  const [search,      setSearch]      = useState('')
  const [filterCatId, setFilterCatId] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchAllMovies(), fetchAllMovieCategories()])
      .then(([movs, cats]) => { setMovies(movs); setCategories(cats) })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [setMovies, setCategories, setLoading, setError])

  const filtered = useMemo(() => {
    let result = movies
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((m) => m.title.toLowerCase().includes(q))
    }
    if (filterCatId) {
      result = result.filter((m) => m.categoryId === filterCatId)
    }
    return result
  }, [movies, search, filterCatId])

  // Mapa id → nombre para mostrar en la tabla
  const catMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories]
  )

  const columns: TableColumn<Movie>[] = [
    { key: 'title', label: 'Título' },
    {
      key: 'categoryId',
      label: 'Categoría',
      render: (m) => (
        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
          {m.categoryId ? (catMap[m.categoryId] ?? '—') : <span className="text-light/30">Sin categoría</span>}
        </span>
      ),
    },
    {
      key: 'year',
      label: 'Año',
      render: (m) => <span className="text-light/50">{m.year ?? '—'}</span>,
    },
    {
      key: 'youtubeId',
      label: 'YouTube ID',
      render: (m) => <code className="text-xs text-accent/70 bg-primary px-1.5 py-0.5 rounded">{m.youtubeId}</code>,
    },
  ]

  const handleDelete = async (id: string) => {
    await deleteMovie(id)
    removeMovie(id)
  }

  const handleTogglePublish = async (id: string, current: boolean) => {
    const updated = await updateMovie(id, { isPublished: !current })
    updateInStore(id, updated)
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Películas</h1>
      <p className="text-light/50 text-sm mb-6">Gestiona el catálogo de películas recomendadas</p>

      {/* Buscador + filtro */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-light/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por título..."
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
        createHref={`${ROUTES.ADMIN_MOVIES}/new`}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        editHref={(id) => `${ROUTES.ADMIN_MOVIES}/${id}`}
        entityLabel="película"
      />
    </div>
  )
}
