'use client'

import { APP_ROUTES } from '@/lib/constants'
import type { Movie } from '@/types/app.types'
import { AppRecentTracker } from './AppRecentTracker'
import { AppVideoPlayer } from './AppVideoPlayer'

export function AppPlayback({ movie }: { movie: Movie }) {
  return (
    <main className="app-playback">
      <AppRecentTracker
        item={{
          id: movie.id,
          kind: 'movie',
          title: movie.title,
          href: `${APP_ROUTES.MOVIES}/${movie.id}`,
          imageUrl: movie.thumbnailUrl,
        }}
      />
      <div className="app-playback-frame">
        <AppVideoPlayer movie={movie} />
      </div>
    </main>
  )
}
