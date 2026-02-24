'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Search } from 'lucide-react'
import { SongCard } from './SongCard'
import { cn } from '@/lib/utils'
import type { Song, MusicCategory, RatingsMap } from '@/types/app.types'

type SortKey = 'recent' | 'oldest' | 'az' | 'za'

const DEBOUNCE_MS = 400

const sortSongs = (a: Song, b: Song, sort: SortKey): number => {
  switch (sort) {
    case 'recent':  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    case 'oldest':  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    case 'az':      return a.title.localeCompare(b.title, 'es')
    case 'za':      return b.title.localeCompare(a.title, 'es')
  }
}

interface MusicSectionProps {
  songs:       Song[]
  categories:  MusicCategory[]
  ratingsMap?: RatingsMap
}

export const MusicSection = ({ songs, categories, ratingsMap }: MusicSectionProps) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    categories[0]?.id ?? null
  )
  const [inputQ, setInputQ] = useState('')
  const [q,      setQ]      = useState('')
  const [sort,   setSort]   = useState<SortKey>('recent')
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setQ(inputQ.trim()), DEBOUNCE_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [inputQ])

  const filtered = useMemo(() => {
    let result = activeCategoryId
      ? songs.filter((s) => s.categoryId === activeCategoryId)
      : songs
    if (q) {
      const lq = q.toLowerCase()
      result = result.filter(
        (s) => s.title.toLowerCase().includes(lq) || s.artist.toLowerCase().includes(lq)
      )
    }
    return [...result].sort((a, b) => sortSongs(a, b, sort))
  }, [songs, activeCategoryId, q, sort])

  return (
    <div>
      {/* Búsqueda + ordenar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-light/30 pointer-events-none" />
          <input
            type="text"
            value={inputQ}
            onChange={(e) => setInputQ(e.target.value)}
            placeholder="Buscar por título o artista..."
            className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-secondary border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="px-3 py-2.5 rounded-sm bg-secondary border border-border text-light text-sm focus:outline-none focus:border-accent transition-colors"
        >
          <option value="recent">Subidas recientemente</option>
          <option value="oldest">Subidas más antiguas</option>
          <option value="az">Nombre A → Z</option>
          <option value="za">Nombre Z → A</option>
        </select>
      </div>

      {/* Tabs de categorías */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => {
            const count = songs.filter((s) => s.categoryId === cat.id).length
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
          <p>{q ? `Sin resultados para "${q}"` : 'No hay canciones en esta categoría todavía.'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((song, index) => (
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
