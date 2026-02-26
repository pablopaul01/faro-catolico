'use client'

import { useState, useEffect } from 'react'
import { MovieFilterSection } from './MovieFilterSection'
import { YoutubePlaylistsTab } from './YoutubePlaylistsTab'
import { YoutubeChannelsTab } from './YoutubeChannelsTab'
import { cn } from '@/lib/utils'
import type { Movie, YoutubePlaylist, YoutubeChannel, MovieCategory, MoviePlatform, RatingsMap } from '@/types/app.types'

type Tab = 'peliculas' | 'playlists' | 'canales'

interface MoviesPageTabsProps {
  movies:           Movie[]
  youtubePlaylists: YoutubePlaylist[]
  youtubeChannels:  YoutubeChannel[]
  categories:       MovieCategory[]
  ratingsMap?:      RatingsMap
  platformsMap?:    Record<string, MoviePlatform>
  defaultTab?:      string
}

export function MoviesPageTabs({
  movies,
  youtubePlaylists,
  youtubeChannels,
  categories,
  ratingsMap,
  platformsMap,
  defaultTab,
}: MoviesPageTabsProps) {
  const validTabs: Tab[] = ['peliculas', 'playlists', 'canales']
  const toTab = (t?: string): Tab => validTabs.includes(t as Tab) ? (t as Tab) : 'peliculas'
  const [activeTab, setActiveTab] = useState<Tab>(() => toTab(defaultTab))

  useEffect(() => { setActiveTab(toTab(defaultTab)) }, [defaultTab])

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'peliculas', label: 'Películas',  count: movies.length },
    { key: 'playlists', label: 'Playlists',  count: youtubePlaylists.length },
    { key: 'canales',   label: 'Canales',    count: youtubeChannels.length },
  ]

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-8">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-all duration-150 border-b-2 -mb-px',
              activeTab === key
                ? 'border-accent text-accent'
                : 'border-transparent text-light/50 hover:text-light'
            )}
          >
            {label}
            {count > 0 && (
              <span className={cn(
                'ml-2 text-xs px-1.5 py-0.5 rounded-full',
                activeTab === key ? 'bg-accent/20 text-accent' : 'bg-white/5 text-light/30'
              )}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'peliculas' && (
        <MovieFilterSection
          movies={movies}
          categories={categories}
          ratingsMap={ratingsMap}
          platformsMap={platformsMap}
        />
      )}
      {activeTab === 'playlists' && (
        <YoutubePlaylistsTab playlists={youtubePlaylists} categories={categories} />
      )}
      {activeTab === 'canales' && (
        <YoutubeChannelsTab channels={youtubeChannels} categories={categories} />
      )}
    </div>
  )
}
