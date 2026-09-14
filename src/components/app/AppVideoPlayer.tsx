'use client'

import { useEffect, useState } from 'react'
import { Film, LoaderCircle } from 'lucide-react'
import { YOUTUBE_PLAYER_ID } from '@/lib/constants'
import {
  getAppYouTubeEmbedUrl,
  getDailymotionEmbedUrl,
  getOkEmbedUrl,
  getVimeoEmbedUrl,
} from '@/lib/utils'
import type { Movie } from '@/types/app.types'
import { AppYouTubeTvControls } from './AppYouTubeTvControls'

function getSource(movie: Movie, origin: string) {
  if (movie.youtubeId) {
    return {
      url: origin ? getAppYouTubeEmbedUrl(movie.youtubeId, origin) : null,
      label: 'YouTube',
      isYouTube: true,
    }
  }
  if (movie.dailymotionId) {
    return { url: getDailymotionEmbedUrl(movie.dailymotionId), label: 'Dailymotion', isYouTube: false }
  }
  if (movie.okId) {
    return { url: getOkEmbedUrl(movie.okId), label: 'OK.ru', isYouTube: false }
  }
  if (movie.vimeoId) {
    return { url: getVimeoEmbedUrl(movie.vimeoId), label: 'Vimeo', isYouTube: false }
  }
  return null
}

export function AppVideoPlayer({ movie }: { movie: Movie }) {
  const [isLoading, setIsLoading] = useState(true)
  const [iframeReady, setIframeReady] = useState(false)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const source = getSource(movie, origin)

  if (!source) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-card bg-secondary text-light/50">
        <div className="flex flex-col items-center gap-2"><Film size={32} /><span>No hay video disponible</span></div>
      </div>
    )
  }

  return (
    <div className="app-player-shell">
      {(isLoading || !source.url) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-secondary text-light/60">
          <LoaderCircle className="animate-spin text-accent" size={32} />
          <span className="text-sm">Cargando {source.label}...</span>
        </div>
      )}
      {source.url ? (
        <iframe
          id={source.isYouTube ? YOUTUBE_PLAYER_ID : undefined}
          key={source.url}
          src={source.url}
          title={movie.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          tabIndex={-1}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => {
            setIsLoading(false)
            setIframeReady(true)
          }}
          className="app-player-frame"
        />
      ) : null}
      {source.isYouTube && iframeReady ? <AppYouTubeTvControls iframeId={YOUTUBE_PLAYER_ID} /> : null}
    </div>
  )
}
