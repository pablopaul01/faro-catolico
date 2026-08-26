'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { YoutubeEmbed } from '@/components/public/movies/YoutubeEmbed'
import type { Movie } from '@/types/app.types'

export function AppPlayback({ movie }: { movie: Movie }) {
  return (
    <main className="app-playback">
      <Link href={`/app-home/peliculas/${movie.id}`} className="app-focus absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full bg-primary/80 px-4 py-2 text-sm text-light backdrop-blur-sm sm:left-8"><ArrowLeft size={17} /> Volver</Link>
      <div className="app-playback-frame">
        <YoutubeEmbed youtubeId={movie.youtubeId} dailymotionId={movie.dailymotionId} okId={movie.okId} vimeoId={movie.vimeoId} title={movie.title} thumbnailUrl={movie.thumbnailUrl} />
      </div>
    </main>
  )
}
