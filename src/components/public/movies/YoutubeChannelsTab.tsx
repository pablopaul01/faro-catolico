'use client'

import { useState, useMemo } from 'react'
import { YoutubeChannelCard } from './YoutubeChannelCard'
import { cn } from '@/lib/utils'
import type { YoutubeChannel, MovieCategory } from '@/types/app.types'

interface YoutubeChannelsTabProps {
  channels:   YoutubeChannel[]
  categories: MovieCategory[]
}

export function YoutubeChannelsTab({ channels, categories }: YoutubeChannelsTabProps) {
  const [activeCatId, setActiveCatId] = useState<string | null>(null)

  const filtered = useMemo(
    () => activeCatId === null ? channels : channels.filter((c) => c.categoryIds.includes(activeCatId)),
    [channels, activeCatId]
  )

  const catMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories]
  )

  return (
    <div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCatId(null)}
            className={cn(
              'px-4 py-2 rounded-sm text-sm transition-all duration-200',
              activeCatId === null
                ? 'bg-accent text-primary font-semibold'
                : 'border border-border text-light/50 hover:border-accent/40 hover:text-light'
            )}
          >
            Todos
            <span className={cn('ml-2 text-xs', activeCatId === null ? 'text-primary/70' : 'text-light/30')}>
              {channels.length}
            </span>
          </button>
          {categories.map((cat) => {
            const count = channels.filter((c) => c.categoryIds.includes(cat.id)).length
            if (count === 0) return null
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCatId(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-sm text-sm transition-all duration-200',
                  activeCatId === cat.id
                    ? 'bg-accent text-primary font-semibold'
                    : 'border border-border text-light/50 hover:border-accent/40 hover:text-light'
                )}
              >
                {cat.name}
                <span className={cn('ml-2 text-xs', activeCatId === cat.id ? 'text-primary/70' : 'text-light/30')}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-light/30 border border-border rounded-card">
          <p>No hay canales en esta categoría todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((channel, index) => (
            <div
              key={channel.id}
              className="animate-slide-up h-full"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <YoutubeChannelCard
                channel={channel}
                categoryNames={channel.categoryIds.map((id) => catMap[id]).filter(Boolean)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
