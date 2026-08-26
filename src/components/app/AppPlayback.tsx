'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AppVideoPlayer } from './AppVideoPlayer'
import type { Movie } from '@/types/app.types'

export function AppPlayback({ movie }: { movie: Movie }) {
  return (
    <main className="app-playback">
      <Link href={`/app-home/peliculas/${movie.id}`} className="app-focus absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full bg-primary/80 px-4 py-2 text-sm text-light backdrop-blur-sm sm:left-8"><ArrowLeft size={17} /> Volver</Link>
      <div className="app-playback-frame">
        <AppVideoPlayer movie={movie} />
      </div>
    </main>
  )
}
