'use client'

import { useState } from 'react'
import { MusicSection } from './MusicSection'
import { PlaylistsTab } from './PlaylistsTab'
import { cn } from '@/lib/utils'
import type { Song, Playlist, MusicCategory, RatingsMap } from '@/types/app.types'

interface MusicPageTabsProps {
  songs:       Song[]
  playlists:   Playlist[]
  categories:  MusicCategory[]
  ratingsMap?: RatingsMap
}

type Tab = 'canciones' | 'playlists'

export const MusicPageTabs = ({ songs, playlists, categories, ratingsMap }: MusicPageTabsProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('canciones')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-8 border-b border-border">
        {([
          { key: 'canciones', label: 'Canciones', count: songs.length },
          { key: 'playlists', label: 'Playlists',  count: playlists.length },
        ] as { key: Tab; label: string; count: number }[]).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              'px-5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px',
              activeTab === key
                ? 'border-accent text-accent'
                : 'border-transparent text-light/50 hover:text-light'
            )}
          >
            {label}
            <span className={cn('ml-2 text-xs', activeTab === key ? 'text-accent/70' : 'text-light/30')}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'canciones' && (
        <MusicSection songs={songs} categories={categories} ratingsMap={ratingsMap} />
      )}
      {activeTab === 'playlists' && (
        <PlaylistsTab playlists={playlists} categories={categories} />
      )}
    </div>
  )
}
