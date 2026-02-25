'use client'

import { useState, useMemo } from 'react'
import { PlaylistCard } from './PlaylistCard'
import { cn } from '@/lib/utils'
import type { Playlist, MusicCategory } from '@/types/app.types'

interface PlaylistsTabProps {
  playlists:  Playlist[]
  categories: MusicCategory[]
}

export const PlaylistsTab = ({ playlists, categories }: PlaylistsTabProps) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)

  const filtered = useMemo(
    () => activeCategoryId
      ? playlists.filter((p) => p.categoryIds.includes(activeCategoryId))
      : playlists,
    [playlists, activeCategoryId]
  )

  const catMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories]
  )

  return (
    <div>
      {/* Tabs de categorías */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategoryId(null)}
            className={cn(
              'px-4 py-2 rounded-sm text-sm transition-all duration-200',
              activeCategoryId === null
                ? 'bg-accent text-primary font-semibold'
                : 'border border-border text-light/50 hover:border-accent/40 hover:text-light'
            )}
          >
            Todas
            <span className={cn('ml-2 text-xs', activeCategoryId === null ? 'text-primary/70' : 'text-light/30')}>
              {playlists.length}
            </span>
          </button>
          {categories.map((cat) => {
            const count = playlists.filter((p) => p.categoryIds.includes(cat.id)).length
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-sm text-sm transition-all duration-200',
                  activeCategoryId === cat.id
                    ? 'bg-accent text-primary font-semibold'
                    : 'border border-border text-light/50 hover:border-accent/40 hover:text-light'
                )}
              >
                {cat.name}
                {count > 0 && (
                  <span className={cn('ml-2 text-xs', activeCategoryId === cat.id ? 'text-primary/70' : 'text-light/30')}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-light/30 border border-border rounded-card">
          <p>No hay playlists en esta categoría todavía.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((playlist, index) => (
            <div
              key={playlist.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <PlaylistCard
                playlist={playlist}
                categoryNames={playlist.categoryIds.map((id) => catMap[id]).filter(Boolean)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
