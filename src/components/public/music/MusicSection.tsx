'use client'

import { useState } from 'react'
import { SongCard } from './SongCard'
import { MUSIC_CATEGORIES, MUSIC_CATEGORY_LABELS, MUSIC_CATEGORY_DESCRIPTIONS } from '@/lib/constants'
import { selectSongsByCategory } from '@/stores/useMusicStore'
import { cn } from '@/lib/utils'
import type { Song, MusicCategory, RatingsMap } from '@/types/app.types'

interface MusicSectionProps {
  songs:       Song[]
  ratingsMap?: RatingsMap
}

export const MusicSection = ({ songs, ratingsMap }: MusicSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<MusicCategory>(MUSIC_CATEGORIES[0])

  const filteredSongs = selectSongsByCategory(songs, activeCategory)

  return (
    <div>
      {/* Tabs de categorías */}
      <div className="flex flex-wrap gap-2 mb-6">
        {MUSIC_CATEGORIES.map((cat) => {
          const count = selectSongsByCategory(songs, cat).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-sm text-sm transition-all duration-200',
                activeCategory === cat
                  ? 'bg-accent text-primary font-semibold'
                  : 'border border-border text-light/50 hover:border-accent/40 hover:text-light'
              )}
            >
              {MUSIC_CATEGORY_LABELS[cat]}
              {count > 0 && (
                <span className={cn(
                  'ml-2 text-xs',
                  activeCategory === cat ? 'text-primary/70' : 'text-light/30'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Descripción de la categoría */}
      <p className="text-light/40 text-sm mb-5">
        {MUSIC_CATEGORY_DESCRIPTIONS[activeCategory]}
      </p>

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
