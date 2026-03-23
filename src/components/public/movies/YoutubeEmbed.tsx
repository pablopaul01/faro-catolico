'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Film, X, Menu } from 'lucide-react'
import { createPortal } from 'react-dom'
import { getYouTubeEmbedUrl, getYouTubeThumbnail, getDailymotionEmbedUrl, getDailymotionThumbnail, getOkEmbedUrl, getVimeoEmbedUrl } from '@/lib/utils'

interface VideoEmbedProps {
  youtubeId:      string | null
  dailymotionId?: string | null
  okId?:          string | null
  vimeoId?:       string | null
  title:          string
  thumbnailUrl?:  string | null
  priority?:      boolean
}

export const YoutubeEmbed = ({ youtubeId, dailymotionId, okId, vimeoId, title, thumbnailUrl, priority }: VideoEmbedProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showBar, setShowBar] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!isPlaying) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsPlaying(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying) return
    // Mostrar barra al abrir el video
    setShowBar(true)
    hideTimer.current = setTimeout(() => setShowBar(false), 3000)

    const show = () => {
      setShowBar(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => setShowBar(false), 3000)
    }
    window.addEventListener('mousemove', show)
    return () => {
      window.removeEventListener('mousemove', show)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [isPlaying])

  const triggerBar = () => {
    setShowBar((v) => {
      if (!v) {
        if (hideTimer.current) clearTimeout(hideTimer.current)
        hideTimer.current = setTimeout(() => setShowBar(false), 3000)
        return true
      }
      return v
    })
  }

  // Prioridad: YouTube > Dailymotion > OK.ru > Vimeo
  const activeVimeo       = !!vimeoId && !youtubeId && !dailymotionId && !okId
  const activeOk          = !!okId && !youtubeId && !dailymotionId
  const activeDailymotion = !!dailymotionId && !youtubeId
  const hasVideo          = !!youtubeId || !!dailymotionId || !!okId || !!vimeoId

  // Sin video: mostrar imagen estática o placeholder
  if (!hasVideo) {
    return (
      <div className="relative w-full aspect-video rounded-card overflow-hidden bg-secondary flex items-center justify-center">
        {thumbnailUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-linear-to-t from-primary/70 via-transparent to-transparent" />
            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-black/60 text-light/60 backdrop-blur-sm">
              Solo en plataformas
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-light/20">
            <Film size={32} />
            <span className="text-xs">Sin video disponible</span>
          </div>
        )}
      </div>
    )
  }

  const embedUrl = activeVimeo
    ? getVimeoEmbedUrl(vimeoId!)
    : activeOk
      ? getOkEmbedUrl(okId!)
      : activeDailymotion
        ? getDailymotionEmbedUrl(dailymotionId!)
        : `${getYouTubeEmbedUrl(youtubeId!)}&autoplay=1`

  const thumbnail = thumbnailUrl
    ?? (activeDailymotion ? getDailymotionThumbnail(dailymotionId!) : (activeOk || activeVimeo) ? null : getYouTubeThumbnail(youtubeId!))

  const overlay = isPlaying && mounted ? createPortal(
    <div
      className="fixed inset-0 z-50 bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={`Reproduciendo: ${title}`}
    >
      <div className={`flex items-center justify-between px-4 py-2 bg-primary/80 backdrop-blur-sm transition-opacity duration-300 absolute top-0 left-0 right-0 z-10 ${showBar ? 'opacity-100' : 'opacity-0'}`}>
        <span className="font-display text-light text-sm truncate">{title}</span>
        <button
          onClick={() => setIsPlaying(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent/20 hover:bg-accent/40 text-light text-sm transition-colors"
          aria-label="Minimizar video"
        >
          <X size={16} />
          <span>Minimizar</span>
        </button>
      </div>
      {/* Botón visible en mobile solo cuando la barra está oculta */}
      {!showBar && (
        <button
          onTouchStart={triggerBar}
          onClick={triggerBar}
          className="absolute top-2 right-2 z-20 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center md:hidden"
          aria-label="Mostrar controles"
        >
          <Menu size={16} className="text-white/60" />
        </button>
      )}
      <div className="absolute inset-0">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    </div>,
    document.body
  ) : null

  return (
    <>
      {overlay}
    <button
      onClick={() => setIsPlaying(true)}
      className="relative w-full aspect-video rounded-card overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`Reproducir: ${title}`}
    >
      {thumbnail ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover/card:scale-105"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding={priority ? 'sync' : 'async'}
            onError={(e) => {
              if (!activeDailymotion && !activeOk && !activeVimeo) {
                ;(e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
              }
            }}
          />
        </>
      ) : (
        <div className="w-full h-full bg-secondary flex items-center justify-center">
          <Film size={32} className="text-light/20" />
        </div>
      )}
      <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/25 group-hover/card:bg-primary/25 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover/card:scale-110 transition-transform duration-200">
          <Play size={24} className="text-primary ml-1" fill="currentColor" />
        </div>
      </div>
      {youtubeId && !activeDailymotion && !activeOk && (
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold bg-red-600/80 text-white backdrop-blur-sm">
          YouTube
        </span>
      )}
      {activeDailymotion && (
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold bg-blue-600/80 text-white backdrop-blur-sm">
          Dailymotion
        </span>
      )}
      {activeOk && (
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold bg-orange-600/80 text-white backdrop-blur-sm">
          OK.ru
        </span>
      )}
      {activeVimeo && (
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold bg-cyan-600/80 text-white backdrop-blur-sm">
          Vimeo
        </span>
      )}
    </button>
    </>
  )
}
