'use client'

import { useState } from 'react'
import { Film, LoaderCircle } from 'lucide-react'
import { getDailymotionEmbedUrl, getOkEmbedUrl, getVimeoEmbedUrl, getYouTubeEmbedUrl } from '@/lib/utils'
import type { Movie } from '@/types/app.types'

export function AppVideoPlayer({ movie }: { movie: Movie }) {
  const [isLoading, setIsLoading] = useState(true)
  const source = movie.youtubeId
    ? { url: `${getYouTubeEmbedUrl(movie.youtubeId)}&autoplay=1`, label: 'YouTube' }
    : movie.dailymotionId
      ? { url: getDailymotionEmbedUrl(movie.dailymotionId), label: 'Dailymotion' }
      : movie.okId
        ? { url: getOkEmbedUrl(movie.okId), label: 'OK.ru' }
        : movie.vimeoId
          ? { url: getVimeoEmbedUrl(movie.vimeoId), label: 'Vimeo' }
          : null

  if (!source) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-card bg-secondary text-light/50">
        <div className="flex flex-col items-center gap-2"><Film size={32} /><span>No hay video disponible</span></div>
      </div>
    )
  }

  return (
    <div className="app-player-shell">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-secondary text-light/60">
          <LoaderCircle className="animate-spin text-accent" size={32} />
          <span className="text-sm">Cargando {source.label}...</span>
        </div>
      )}
      <iframe
        key={source.url}
        src={source.url}
        title={movie.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setIsLoading(false)}
        className="app-player-frame"
      />
    </div>
  )
}
