'use client'

import { useState } from 'react'
import { PlaySquare, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { YOUTUBE_NOCOOKIE_BASE } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { YoutubePlaylist } from '@/types/app.types'

interface YoutubePlaylistCardProps {
  playlist:       YoutubePlaylist
  categoryNames?: string[]
}

export function YoutubePlaylistCard({ playlist, categoryNames = [] }: YoutubePlaylistCardProps) {
  const [expanded, setExpanded] = useState(false)

  const embedUrl = `${YOUTUBE_NOCOOKIE_BASE}/videoseries?list=${playlist.youtubeListId}`
  const youtubeUrl = `https://www.youtube.com/playlist?list=${playlist.youtubeListId}`

  return (
    <article className="bg-secondary border border-border rounded-card overflow-hidden flex flex-col group transition-all duration-300 hover:gold-glow hover:-translate-y-1">
      {/* Thumbnail o ícono */}
      {playlist.thumbnailUrl ? (
        <div className="aspect-video w-full overflow-hidden flex-shrink-0">
          <img
            src={playlist.thumbnailUrl}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video w-full flex items-center justify-center bg-primary/60 flex-shrink-0">
          <PlaySquare size={40} className="text-accent/40" />
        </div>
      )}

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-display text-base text-light leading-snug line-clamp-2">{playlist.title}</h3>

        {playlist.description && (
          <p className="text-light/50 text-xs leading-relaxed line-clamp-2">{playlist.description}</p>
        )}

        {categoryNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categoryNames.map((name) => (
              <span key={name} className="px-2 py-0.5 rounded-sm border border-accent/40 text-accent text-xs">
                {name}
              </span>
            ))}
          </div>
        )}

        {/* Embed expandible */}
        {expanded && (
          <div className="rounded-sm overflow-hidden border border-border mt-1">
            <iframe
              src={embedUrl}
              width="100%"
              height="250"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="block"
            />
          </div>
        )}

        <div className="flex items-center gap-3 mt-auto pt-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-accent/80 hover:text-accent transition-colors"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {expanded ? 'Ocultar' : 'Ver playlist'}
          </button>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-1 text-xs text-light/40 hover:text-accent transition-colors ml-auto'
            )}
          >
            Abrir en YouTube <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </article>
  )
}
