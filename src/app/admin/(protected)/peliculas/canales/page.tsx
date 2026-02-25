'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { DataTable, type TableColumn } from '@/components/admin/DataTable'
import { fetchAllYoutubeChannels, deleteYoutubeChannel, toggleYoutubeChannelPublish } from '@/services/youtubeChannels.service'
import { fetchAllMovieCategories } from '@/services/movieCategories.service'
import { useYoutubeChannelsStore } from '@/stores/useYoutubeChannelsStore'
import { useMovieCategoriesStore } from '@/stores/useMovieCategoriesStore'
import { ROUTES } from '@/lib/constants'
import type { YoutubeChannel } from '@/types/app.types'

export default function AdminYoutubeChannelsPage() {
  const { channels, isLoading, setChannels, setLoading, setError, removeChannel, updateChannel } = useYoutubeChannelsStore()
  const { categories, setCategories } = useMovieCategoriesStore()

  const [search,      setSearch]      = useState('')
  const [filterCatId, setFilterCatId] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchAllYoutubeChannels(), fetchAllMovieCategories()])
      .then(([chs, cats]) => { setChannels(chs); setCategories(cats) })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [setChannels, setCategories, setLoading, setError])

  const filtered = useMemo(() => {
    let result = channels
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((c) => c.name.toLowerCase().includes(q))
    }
    if (filterCatId) result = result.filter((c) => c.categoryIds.includes(filterCatId))
    return result
  }, [channels, search, filterCatId])

  const catMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories]
  )

  const columns: TableColumn<YoutubeChannel>[] = [
    { key: 'name', label: 'Canal' },
    {
      key: 'categoryIds',
      label: 'Categorías',
      render: (ch) =>
        ch.categoryIds.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {ch.categoryIds.map((catId) => (
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
    await deleteYoutubeChannel(id)
    removeChannel(id)
  }

  const handleTogglePublish = async (id: string, current: boolean) => {
    await toggleYoutubeChannelPublish(id, current)
    updateChannel(id, { isPublished: !current })
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Canales de YouTube</h1>
      <p className="text-light/50 text-sm mb-6">Gestiona los canales de YouTube recomendados</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-light/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
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
        createHref={`${ROUTES.ADMIN_YOUTUBE_CHANNELS}/new`}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        editHref={(id) => `${ROUTES.ADMIN_YOUTUBE_CHANNELS}/${id}`}
        entityLabel="canal"
      />
    </div>
  )
}
