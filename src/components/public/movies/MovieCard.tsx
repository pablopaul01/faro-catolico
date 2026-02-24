'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { YoutubeEmbed } from './YoutubeEmbed'
import { StarRating } from '@/components/public/StarRating'
import type { Movie, RatingStats } from '@/types/app.types'

const DESCRIPTION_LIMIT = 110

interface MovieCardProps {
  movie:       Movie
  ratingStats?: RatingStats
}

export const MovieCard = ({ movie, ratingStats }: MovieCardProps) => {
  const { title, description, youtubeId, externalUrl, year, thumbnailUrl } = movie
  const [expanded, setExpanded] = useState(false)

  const isLong = description && description.length > DESCRIPTION_LIMIT
  const displayText = isLong && !expanded
    ? description.slice(0, DESCRIPTION_LIMIT).trimEnd() + '…'
    : description

  return (
    <article className="bg-card rounded-card overflow-hidden flex flex-col group transition-all duration-300 hover:gold-glow hover:-translate-y-1">
      {/* Embed / thumbnail */}
      <div className="flex-shrink-0">
        <YoutubeEmbed youtubeId={youtubeId} title={title} thumbnailUrl={thumbnailUrl} />
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base text-light leading-snug line-clamp-2">{title}</h3>
          {year && <span className="text-xs text-light/30 flex-shrink-0 mt-0.5">{year}</span>}
        </div>

        {description && (
          <div>
            <p className="text-light/50 text-xs leading-relaxed">
              {displayText}
              {isLong && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="ml-1 text-accent/70 hover:text-accent transition-colors font-medium"
                >
                  {expanded ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </p>
          </div>
        )}

        <StarRating
          contentType="pelicula"
          contentId={movie.id}
          avgRating={ratingStats?.avgRating}
          ratingCount={ratingStats?.ratingCount}
        />

        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors pt-2"
          >
            Ver en plataforma
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  )
}
