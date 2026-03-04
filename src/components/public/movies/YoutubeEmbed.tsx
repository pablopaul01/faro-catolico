'use client'

import { useState } from 'react'
import { Play, Film } from 'lucide-react'
import { getYouTubeEmbedUrl, getYouTubeThumbnail, getDailymotionEmbedUrl, getDailymotionThumbnail } from '@/lib/utils'

interface VideoEmbedProps {
  youtubeId:      string | null
  dailymotionId?: string | null
  title:          string
  thumbnailUrl?:  string | null
  priority?:      boolean
}

export const YoutubeEmbed = ({ youtubeId, dailymotionId, title, thumbnailUrl, priority }: VideoEmbedProps) => {
  const [isPlaying, setIsPlaying] = useState(false)

  // Prioridad: YouTube > Dailymotion
  const hasDailymotion = !!dailymotionId && !youtubeId
  const hasVideo       = !!youtubeId || !!dailymotionId

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

  const embedUrl = hasDailymotion
    ? getDailymotionEmbedUrl(dailymotionId!)
    : `${getYouTubeEmbedUrl(youtubeId!)}&autoplay=1`

  const thumbnail = thumbnailUrl
    ?? (hasDailymotion ? getDailymotionThumbnail(dailymotionId!) : getYouTubeThumbnail(youtubeId!))

  if (isPlaying) {
    return (
      <div className="w-full aspect-video rounded-card overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsPlaying(true)}
      className="relative w-full aspect-video rounded-card overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`Reproducir: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover/card:scale-105"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        onError={(e) => {
          if (!hasDailymotion) {
            ;(e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
          }
        }}
      />
      <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/25 group-hover/card:bg-primary/25 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover/card:scale-110 transition-transform duration-200">
          <Play size={24} className="text-primary ml-1" fill="currentColor" />
        </div>
      </div>
      {hasDailymotion && (
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold bg-blue-600/80 text-white backdrop-blur-sm">
          Dailymotion
        </span>
      )}
    </button>
  )
}
