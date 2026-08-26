'use client'

import Link from 'next/link'
import { AppVideoPlayer } from './AppVideoPlayer'
import type { Movie } from '@/types/app.types'

export function AppPlayback({ movie }: { movie: Movie }) {
  return (
    <main className="app-playback">
      <div className="app-playback-frame">
        <AppVideoPlayer movie={movie} backHref={`/app-home/peliculas/${movie.id}`} />
      </div>
    </main>
  )
}
