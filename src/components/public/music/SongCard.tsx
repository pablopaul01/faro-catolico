'use client'

import { ExternalLink, Music2, Clock } from 'lucide-react'
import { formatDuration, getYouTubeEmbedUrl } from '@/lib/utils'
import { StarRating } from '@/components/public/StarRating'
import type { Song, RatingStats } from '@/types/app.types'

interface SongCardProps {
  song:         Song
  ratingStats?: RatingStats
}

export const SongCard = ({ song, ratingStats }: SongCardProps) => {
  const { title, artist, youtubeId, spotifyUrl, externalUrl, durationSec, thumbnailUrl } = song

  return (
    <article className="bg-card rounded-card p-4 flex items-center gap-4 transition-all duration-300 hover:gold-glow group">
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

      {/* Duración + links */}
      <div className="flex items-center gap-2 shrink-0">
        {durationSec && (
          <span className="text-light/30 text-xs flex items-center gap-1">
            <Clock size={11} />
            {formatDuration(durationSec)}
          </span>
        )}

        {youtubeId && (
          <a
            href={getYouTubeEmbedUrl(youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-light/30 hover:text-accent transition-colors"
            title="Ver en YouTube"
          >
            <ExternalLink size={14} />
          </a>
        )}

        {!youtubeId && (spotifyUrl ?? externalUrl) && (
          <a
            href={(spotifyUrl ?? externalUrl)!}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-light/30 hover:text-accent transition-colors"
            title="Escuchar"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  )
}
