'use client'

import { AppVideoPlayer } from './AppVideoPlayer'
import type { Movie } from '@/types/app.types'

export function AppPlayback({ movie }: { movie: Movie }) {
  return (
    <main className="app-playback">
      <div className="app-playback-frame">
        <AppVideoPlayer movie={movie} />
      </div>
    </main>
  )
}
