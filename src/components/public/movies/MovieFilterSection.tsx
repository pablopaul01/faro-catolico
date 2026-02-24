'use client'

import { useState } from 'react'
import { MovieGrid } from './MovieGrid'
import { cn } from '@/lib/utils'
import type { Movie, MovieCategory, RatingsMap } from '@/types/app.types'

interface MovieFilterSectionProps {
  movies:      Movie[]
  categories:  MovieCategory[]
  ratingsMap?: RatingsMap
}

export const MovieFilterSection = ({ movies, categories, ratingsMap }: MovieFilterSectionProps) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  if (categories.length === 0) {
    return <MovieGrid movies={movies} ratingsMap={ratingsMap} />
  }

  const filtered = activeId === null
    ? movies
    : movies.filter((m) => m.categoryId === activeId)

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveId(null)}
          className={cn(
            'px-4 py-2 rounded-sm text-sm transition-all duration-200',
            activeId === null
              ? 'bg-accent text-primary font-semibold'
              : 'border border-border text-light/50 hover:border-accent/40 hover:text-light'
          )}
        >
          Todos
          <span className={cn('ml-2 text-xs', activeId === null ? 'text-primary/70' : 'text-light/30')}>
            {movies.length}
          </span>
        </button>

        {categories.map((cat) => {
          const count = movies.filter((m) => m.categoryId === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveId(cat.id)}
              className={cn(
                'px-4 py-2 rounded-sm text-sm transition-all duration-200',
                activeId === cat.id
                  ? 'bg-accent text-primary font-semibold'
                  : 'border border-border text-light/50 hover:border-accent/40 hover:text-light'
              )}
            >
              {cat.name}
              {count > 0 && (
                <span className={cn('ml-2 text-xs', activeId === cat.id ? 'text-primary/70' : 'text-light/30')}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-light/30 border border-border rounded-card">
          <p>No hay películas en esta categoría todavía.</p>
        </div>
      ) : (
        <MovieGrid movies={filtered} ratingsMap={ratingsMap} />
      )}
    </div>
  )
}
