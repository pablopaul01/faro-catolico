'use client'

import { useState } from 'react'
import { ExternalLink, PlaySquare, ChevronDown, ChevronUp } from 'lucide-react'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { YoutubePlaylist } from '@/types/app.types'

interface YoutubePlaylistCardProps {
  playlist:       YoutubePlaylist
  categoryNames?: string[]
}

export function YoutubePlaylistCard({ playlist, categoryNames = [] }: YoutubePlaylistCardProps) {
  const [expanded, setExpanded] = useState(false)
  const copyrightMode = useSettingsStore((s) => s.copyrightMode)

  const youtubeUrl = `https://www.youtube.com/playlist?list=${playlist.youtubeListId}`
  const embedUrl   = `https://www.youtube-nocookie.com/embed/videoseries?list=${playlist.youtubeListId}`

  return (
    <article className="bg-secondary border border-border rounded-card overflow-hidden flex flex-col h-full">
      {/* Thumbnail o embed */}
      {!copyrightMode && expanded ? (
        <div className="w-full flex-shrink-0">
          <iframe
            src={embedUrl}
            title={playlist.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full"
            style={{ height: '320px' }}
          />
        </div>
      ) : (
        <div className="aspect-video w-full overflow-hidden shrink-0 relative">
          {playlist.thumbnailUrl ? (
            <img
              src={playlist.thumbnailUrl}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/60">
              <PlaySquare size={40} className="text-accent/40" />
            </div>
          )}
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

        {!copyrightMode && (
          <div className="mt-auto pt-2 flex items-center gap-3">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors font-medium"
            >
              {expanded ? (
                <><ChevronUp size={13} /> Cerrar playlist</>
              ) : (
                <><ChevronDown size={13} /> Ver videos</>
              )}
            </button>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-light/40 hover:text-light/70 transition-colors"
            >
              YouTube <ExternalLink size={10} />
            </a>
          </div>
        )}
      </div>
    </article>
  )
}
