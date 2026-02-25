'use client'

import { ExternalLink, PlaySquare } from 'lucide-react'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { YoutubePlaylist } from '@/types/app.types'

interface YoutubePlaylistCardProps {
  playlist:       YoutubePlaylist
  categoryNames?: string[]
}

export function YoutubePlaylistCard({ playlist, categoryNames = [] }: YoutubePlaylistCardProps) {
  const copyrightMode = useSettingsStore((s) => s.copyrightMode)

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

        {!copyrightMode && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto pt-2 flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
          >
            Abrir en YouTube <ExternalLink size={11} />
          </a>
        )}
      </div>
    </article>
  )
}
