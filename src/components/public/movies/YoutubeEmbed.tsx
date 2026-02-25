'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/utils'

interface YoutubeEmbedProps {
  youtubeId:    string | null
  title:        string
  thumbnailUrl?: string | null
}

export const YoutubeEmbed = ({ youtubeId, title, thumbnailUrl }: YoutubeEmbedProps) => {
  const [isPlaying, setIsPlaying] = useState(false)

  // Sin YouTube ID: mostrar imagen estática o placeholder
  if (!youtubeId) {
    return (
      <div className="relative w-full aspect-video rounded-card overflow-hidden bg-secondary flex items-center justify-center">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-light/20">
            <Play size={32} />
            <span className="text-xs">Sin video disponible</span>
          </div>
        )}
      </div>
    )
  }

  const thumbnail = thumbnailUrl ?? getYouTubeThumbnail(youtubeId)
  const embedUrl  = getYouTubeEmbedUrl(youtubeId)

  if (isPlaying) {
    return (
      <div className="w-full aspect-video rounded-card overflow-hidden bg-black">
        <iframe
          src={`${embedUrl}&autoplay=1`}
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
      {/* Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          ;(e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/25 transition-colors duration-300" />

      {/* Botón play */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
          <Play size={24} className="text-primary ml-1" fill="currentColor" />
        </div>
      </div>
    </button>
  )
}
