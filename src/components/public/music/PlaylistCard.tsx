'use client'

import { useState } from 'react'
import { ExternalLink, Music2, ChevronUp, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReportButton } from '@/components/public/ReportButton'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { Playlist } from '@/types/app.types'

interface PlaylistCardProps {
  playlist:      Playlist
  categoryNames?: string[]
}

const DESCRIPTION_LIMIT = 120

function getSpotifyPlaylistEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (!u.hostname.includes('spotify.com')) return null
    const pathname = u.pathname.replace(/^\/intl-[a-z]+(-[a-z]+)?\//i, '/')
    return `https://open.spotify.com/embed${pathname}?utm_source=generator&theme=0`
  } catch {
    return null
  }
}

export const PlaylistCard = ({ playlist, categoryNames = [] }: PlaylistCardProps) => {
  const { title, description, spotifyUrl, thumbnailUrl } = playlist
  const [showPlayer, setShowPlayer] = useState(false)
  const copyrightMode = useSettingsStore((s) => s.copyrightMode)

  const embedUrl  = getSpotifyPlaylistEmbedUrl(spotifyUrl)
  const isLong    = description && description.length > DESCRIPTION_LIMIT
  const displayText = isLong && !showPlayer
    ? description.slice(0, DESCRIPTION_LIMIT).trimEnd() + '…'
    : description

  return (
    <article className="bg-card rounded-card overflow-hidden transition-all duration-300 hover:gold-glow group">
      <div className="p-4 flex items-start gap-4">
        {/* Miniatura */}
        <div className="shrink-0 w-14 h-14 rounded-sm overflow-hidden bg-primary flex items-center justify-center">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <Music2 size={22} className="text-accent/50" />
          )}
        </div>

        {/* Info + controles apilados */}
        <div className="flex-1 min-w-0">
          <p className="text-light text-sm font-display font-medium leading-snug">{title}</p>

          {description && (
            <p className="text-light/40 text-xs leading-relaxed mt-1">{displayText}</p>
          )}

          {/* Category badges */}
          {categoryNames.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {categoryNames.map((name) => (
                <span key={name} className="px-2 py-0.5 rounded-sm border border-accent/40 text-accent text-xs">
                  {name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-1">
            <ReportButton contentType="playlist" contentId={playlist.id} contentTitle={title} />
          </div>

          {/* Controles debajo */}
          {!copyrightMode && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {embedUrl && (
                <button
                  onClick={() => setShowPlayer((v) => !v)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors',
                    showPlayer
                      ? 'bg-accent text-primary'
                      : 'border border-accent/40 text-accent hover:bg-accent/10'
                  )}
                  title={showPlayer ? 'Cerrar reproductor' : 'Abrir reproductor'}
                >
                  {showPlayer ? <ChevronUp size={13} /> : <Play size={13} />}
                  {showPlayer ? 'Cerrar' : 'Reproducir'}
                </button>
              )}
              <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-light/30 hover:text-green-400 transition-colors"
                title="Abrir en Spotify"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Player expandible */}
      {!copyrightMode && embedUrl && showPlayer && (
        <div className="px-4 pb-4">
          <iframe
            src={embedUrl}
            width="100%"
            height="380"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-sm border-0"
            title={title}
          />
        </div>
      )}
    </article>
  )
}
