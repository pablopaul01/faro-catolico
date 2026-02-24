'use client'

import { useState } from 'react'
import { SongCard } from './SongCard'
import { selectSongsByCategory } from '@/stores/useMusicStore'
import { cn } from '@/lib/utils'
import type { Song, MusicCategory, RatingsMap } from '@/types/app.types'

interface MusicSectionProps {
  songs:       Song[]
  categories:  MusicCategory[]
  ratingsMap?: RatingsMap
}

export const MusicSection = ({ songs, categories, ratingsMap }: MusicSectionProps) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    categories[0]?.id ?? null
  )

  if (categories.length === 0) {
    if (songs.length === 0) {
      return (
        <div className="text-center py-12 text-light/30 border border-border rounded-card">
          <p>No hay canciones disponibles por el momento.</p>
        </div>
      )
    }
    return (
      <div className="space-y-2">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.04}s` }}
          >
            <SongCard song={song} ratingStats={ratingsMap?.[song.id]} />
          </div>
        ))}
      </div>
    )
  }

  const filteredSongs = activeCategoryId
    ? selectSongsByCategory(songs, activeCategoryId)
    : songs

  return (
    <div>
      {/* Tabs de categorías */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => {
          const count = selectSongsByCategory(songs, cat.id).length
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
                <span className={cn(
                  'ml-2 text-xs',
                  activeCategoryId === cat.id ? 'text-primary/70' : 'text-light/30'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Lista de canciones */}
      {filteredSongs.length === 0 ? (
        <div className="text-center py-12 text-light/30 border border-border rounded-card">
          <p>No hay canciones en esta categoría todavía.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSongs.map((song, index) => (
            <div
              key={song.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <SongCard song={song} ratingStats={ratingsMap?.[song.id]} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
