'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Film, LoaderCircle } from 'lucide-react'
import { getDailymotionEmbedUrl, getOkEmbedUrl, getVimeoEmbedUrl, getYouTubeEmbedUrl } from '@/lib/utils'
import type { Movie } from '@/types/app.types'

export function AppVideoPlayer({ movie, backHref }: { movie: Movie; backHref: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shellRef = useRef<HTMLDivElement>(null)

  const source = movie.youtubeId
    ? { url: `${getYouTubeEmbedUrl(movie.youtubeId)}&autoplay=1`, label: 'YouTube' }
    : movie.dailymotionId
      ? { url: getDailymotionEmbedUrl(movie.dailymotionId), label: 'Dailymotion' }
      : movie.okId
        ? { url: getOkEmbedUrl(movie.okId), label: 'OK.ru' }
        : movie.vimeoId
          ? { url: getVimeoEmbedUrl(movie.vimeoId), label: 'Vimeo' }
          : null

  const scheduleHide = useCallback((delay = 4000) => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowControls(false), delay)
  }, [])

  const revealControls = useCallback(() => {
    setShowControls(true)
    scheduleHide()
  }, [scheduleHide])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const key = event.key
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Escape', 'Backspace'].includes(key)) {
        revealControls()
      }
    }

    shellRef.current?.addEventListener('keydown', handleKey)
    return () => {
      shellRef.current?.removeEventListener('keydown', handleKey)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [revealControls])

  if (!source) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-card bg-secondary text-light/50">
        <div className="flex flex-col items-center gap-2"><Film size={32} /><span>No hay video disponible</span></div>
      </div>
    )
  }

  return (
    <div ref={shellRef} className="app-player-shell" tabIndex={-1} onMouseMove={revealControls}>
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
      {/* Top controls — back button */}
      <div className={`app-player-controls app-player-top ${showControls ? 'app-player-controls-visible' : ''}`}>
        <Link
          href={backHref}
          className="app-focus app-player-back inline-flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-sm text-light shadow-lg backdrop-blur-sm"
        >
          <ArrowLeft size={17} /> Volver
        </Link>
      </div>
      {/* Bottom bar — always focusable on TV */}
      <div className={`app-player-bottom ${showControls ? 'app-player-controls-visible' : ''}`}>
        <Link
          href={backHref}
          tabIndex={0}
          className="app-focus app-player-bottom-back inline-flex items-center gap-2 rounded-full bg-primary/80 px-5 py-2.5 text-sm text-light shadow-lg backdrop-blur-sm"
        >
          <ArrowLeft size={17} /> Volver
        </Link>
      </div>
    </div>
  )
}
