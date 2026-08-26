'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Film, LoaderCircle } from 'lucide-react'
import { getDailymotionEmbedUrl, getOkEmbedUrl, getVimeoEmbedUrl, getYouTubeEmbedUrl } from '@/lib/utils'
import type { Movie } from '@/types/app.types'

export function AppVideoPlayer({ movie, backHref }: { movie: Movie; backHref: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const source = movie.youtubeId
    ? { url: `${getYouTubeEmbedUrl(movie.youtubeId)}&autoplay=1`, label: 'YouTube' }
    : movie.dailymotionId
      ? { url: getDailymotionEmbedUrl(movie.dailymotionId), label: 'Dailymotion' }
      : movie.okId
        ? { url: getOkEmbedUrl(movie.okId), label: 'OK.ru' }
        : movie.vimeoId
          ? { url: getVimeoEmbedUrl(movie.vimeoId), label: 'Vimeo' }
          : null

  const revealControls = () => {
    setShowControls(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowControls(false), 4000)
  }

  const enterFullscreenAndRevealControls = () => {
    revealControls()
    if (!document.fullscreenElement) {
      void iframeRef.current?.requestFullscreen?.().catch(() => undefined)
    }
  }

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }, [])

  if (!source) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-card bg-secondary text-light/50">
        <div className="flex flex-col items-center gap-2"><Film size={32} /><span>No hay video disponible</span></div>
      </div>
    )
  }

  return (
    <div className="app-player-shell" onMouseMove={revealControls}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-secondary text-light/60">
          <LoaderCircle className="animate-spin text-accent" size={32} />
          <span className="text-sm">Cargando {source.label}...</span>
        </div>
      )}
      <iframe
        key={source.url}
        ref={iframeRef}
        src={source.url}
        title={movie.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setIsLoading(false)}
        className="app-player-frame"
      />
      {!showControls && (
        <button
          type="button"
          className="app-player-touch-catcher"
          onClick={enterFullscreenAndRevealControls}
          aria-label="Mostrar controles del reproductor"
        />
      )}
      <div className={`app-player-controls ${showControls ? 'app-player-controls-visible' : ''}`}>
        <Link href={backHref} className="app-focus inline-flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-sm text-light shadow-lg backdrop-blur-sm">
          <ArrowLeft size={17} /> Volver
        </Link>
      </div>
    </div>
  )
}
