'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { DataTable, type TableColumn } from '@/components/admin/DataTable'
import { fetchAllYoutubePlaylists, deleteYoutubePlaylist, toggleYoutubePlaylistPublish } from '@/services/youtubePlaylistsService'
import { fetchAllMovieCategories } from '@/services/movieCategories.service'
import { useYoutubePlaylistsStore } from '@/stores/useYoutubePlaylistsStore'
import { useMovieCategoriesStore } from '@/stores/useMovieCategoriesStore'
import { ROUTES } from '@/lib/constants'
import type { YoutubePlaylist } from '@/types/app.types'

export default function AdminYoutubePlaylistsPage() {
  const { playlists, isLoading, setPlaylists, setLoading, setError, removePlaylist, updatePlaylist } = useYoutubePlaylistsStore()
  const { categories, setCategories } = useMovieCategoriesStore()

  const [search,      setSearch]      = useState('')
  const [filterCatId, setFilterCatId] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchAllYoutubePlaylists(), fetchAllMovieCategories()])
      .then(([pls, cats]) => { setPlaylists(pls); setCategories(cats) })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [setPlaylists, setCategories, setLoading, setError])

  const filtered = useMemo(() => {
    let result = playlists
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.title.toLowerCase().includes(q))
    }
    if (filterCatId) result = result.filter((p) => p.categoryIds.includes(filterCatId))
    return result
  }, [playlists, search, filterCatId])

  const catMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories]
  )

  const columns: TableColumn<YoutubePlaylist>[] = [
    { key: 'title', label: 'Título' },
    {
      key: 'categoryIds',
      label: 'Categorías',
      render: (p) =>
        p.categoryIds.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {p.categoryIds.map((catId) => (
              <span key={catId} className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                {catMap[catId] ?? catId}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-light/30 text-xs">Sin categoría</span>
        ),
    },
  ]

  const handleDelete = async (id: string) => {
    await deleteYoutubePlaylist(id)
    removePlaylist(id)
  }

  const handleTogglePublish = async (id: string, current: boolean) => {
    await toggleYoutubePlaylistPublish(id, current)
    updatePlaylist(id, { isPublished: !current })
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Playlists de YouTube</h1>
      <p className="text-light/50 text-sm mb-6">Gestiona las playlists de YouTube para la sección de películas</p>

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
        createHref={`${ROUTES.ADMIN_YOUTUBE_PLAYLISTS}/new`}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        editHref={(id) => `${ROUTES.ADMIN_YOUTUBE_PLAYLISTS}/${id}`}
        entityLabel="playlist"
      />
    </div>
  )
}
