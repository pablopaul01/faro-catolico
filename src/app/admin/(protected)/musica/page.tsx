'use client'

import { useEffect } from 'react'
import { DataTable, type TableColumn } from '@/components/admin/DataTable'
import { fetchAllSongs, deleteSong, updateSong } from '@/services/music.service'
import { useMusicStore } from '@/stores/useMusicStore'
import { ROUTES, MUSIC_CATEGORY_LABELS } from '@/lib/constants'
import type { Song } from '@/types/app.types'

const columns: TableColumn<Song>[] = [
  { key: 'title',  label: 'Título' },
  { key: 'artist', label: 'Artista' },
  {
    key: 'category',
    label: 'Momento',
    render: (s) => (
      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
        {MUSIC_CATEGORY_LABELS[s.category]}
      </span>
    ),
  },
]

export default function AdminMusicPage() {
  const { songs, isLoading, setSongs, setLoading, setError, removeSong, updateSong: updateInStore } = useMusicStore()

  useEffect(() => {
    setLoading(true)
    fetchAllSongs()
      .then(setSongs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [setSongs, setLoading, setError])

  const handleDelete = async (id: string) => {
    await deleteSong(id)
    removeSong(id)
  }

  const handleTogglePublish = async (id: string, current: boolean) => {
    const updated = await updateSong(id, { isPublished: !current })
    updateInStore(id, updated)
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Música</h1>
      <p className="text-light/50 text-sm mb-8">Gestiona las canciones por momento</p>

      <DataTable
        columns={columns}
        data={songs}
        isLoading={isLoading}
        createHref={`${ROUTES.ADMIN_MUSIC}/new`}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        editHref={(id) => `${ROUTES.ADMIN_MUSIC}/${id}`}
        entityLabel="canción"
      />
    </div>
  )
}
