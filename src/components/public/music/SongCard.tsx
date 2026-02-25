'use client'

import { useState } from 'react'
import { ExternalLink, Music2, Clock, Play, ChevronUp } from 'lucide-react'
import { formatDuration, getYouTubeEmbedUrl, cn } from '@/lib/utils'
import { StarRating } from '@/components/public/StarRating'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { Song, RatingStats } from '@/types/app.types'

interface SongCardProps {
  song:         Song
  ratingStats?: RatingStats
}

const getSpotifyEmbedUrl = (url: string): string | null => {
  try {
    const u = new URL(url)
    if (!u.hostname.includes('spotify.com')) return null
    // Spotify agrega prefijo de locale en la URL (ej. /intl-es/track/...) — el embed no lo acepta
    const pathname = u.pathname.replace(/^\/intl-[a-z]+(-[a-z]+)?\//i, '/')
    return `https://open.spotify.com/embed${pathname}?utm_source=generator&theme=0`
  } catch {
    return null
  }
}

export const SongCard = ({ song, ratingStats }: SongCardProps) => {
  const { title, artist, youtubeId, spotifyUrl, externalUrl, durationSec, thumbnailUrl } = song
  const [showPlayer, setShowPlayer] = useState(false)
  const copyrightMode = useSettingsStore((s) => s.copyrightMode)

  const spotifyEmbed = spotifyUrl ? getSpotifyEmbedUrl(spotifyUrl) : null
  const hasPlayer    = !!(spotifyEmbed || youtubeId)

  return (
    <article className="bg-card rounded-card overflow-hidden transition-all duration-300 hover:gold-glow group">
      {/* Fila principal */}
      <div className="p-4 flex items-center gap-4">
        {/* Miniatura o ícono */}
        <div className="shrink-0 w-12 h-12 rounded-sm overflow-hidden bg-primary flex items-center justify-center">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
          ) : youtubeId ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://img.youtube.com/vi/${youtubeId}/default.jpg`}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music2 size={20} className="text-accent/50" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-light text-sm font-medium truncate">{title}</p>
          <p className="text-light/40 text-xs truncate">{artist}</p>
          <div className="mt-1">
            <StarRating
              contentType="cancion"
              contentId={song.id}
              avgRating={ratingStats?.avgRating}
              ratingCount={ratingStats?.ratingCount}
            />
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2 shrink-0">
          {durationSec && (
            <span className="text-light/30 text-xs flex items-center gap-1">
              <Clock size={11} />
              {formatDuration(durationSec)}
            </span>
          )}

          {/* Botón reproducir inline */}
          {!copyrightMode && hasPlayer && (
            <button
              onClick={() => setShowPlayer((v) => !v)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors',
                showPlayer
                  ? 'bg-accent text-primary'
                  : 'border border-accent/40 text-accent hover:bg-accent/10'
              )}
              title={showPlayer ? 'Cerrar reproductor' : 'Reproducir aquí'}
            >
              {showPlayer ? <ChevronUp size={13} /> : <Play size={13} />}
              {showPlayer ? 'Cerrar' : 'Reproducir'}
            </button>
          )}

          {/* Links externos */}
          {!copyrightMode && youtubeId && (
            <a
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-light/30 hover:text-red-400 transition-colors"
              title="Ver en YouTube"
            >
              <ExternalLink size={14} />
            </a>
          )}
          {!copyrightMode && spotifyUrl && (
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-light/30 hover:text-green-400 transition-colors"
              title="Abrir en Spotify"
            >
              <ExternalLink size={14} />
            </a>
          )}
          {!copyrightMode && !youtubeId && !spotifyUrl && externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-light/30 hover:text-accent transition-colors"
              title="Escuchar"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Player inline expandible */}
      {!copyrightMode && hasPlayer && showPlayer && (
        <div className="px-4 pb-4">
          {spotifyEmbed ? (
            <iframe
              src={spotifyEmbed}
              width="100%"
              height="80"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-sm border-0"
              title={title}
            />
          ) : youtubeId ? (
            <div className="relative aspect-video rounded-sm overflow-hidden">
              <iframe
                src={getYouTubeEmbedUrl(youtubeId)}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          ) : null}
        </div>
      )}
    </article>
  )
}
