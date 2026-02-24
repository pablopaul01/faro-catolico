'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink, FileText } from 'lucide-react'
import { StarRating } from '@/components/public/StarRating'
import type { Book, RatingStats } from '@/types/app.types'

interface BookCardProps {
  book:         Book
  ratingStats?: RatingStats
}

const COVER_PLACEHOLDER = 'https://placehold.co/200x300/1B263B/D4AF37?text=Libro'
const DESCRIPTION_LIMIT = 120

export const BookCard = ({ book, ratingStats }: BookCardProps) => {
  const { title, author, description, coverUrl, year, purchaseUrl, pdfUrl } = book
  const [expanded, setExpanded] = useState(false)

  const isLong = description && description.length > DESCRIPTION_LIMIT
  const displayText = isLong && !expanded
    ? description.slice(0, DESCRIPTION_LIMIT).trimEnd() + '…'
    : description

  return (
    <article className="bg-card rounded-card overflow-hidden flex flex-col sm:flex-row gap-4 p-4 transition-all duration-300 hover:gold-glow group">
      {/* Portada */}
      <div className="shrink-0 mx-auto sm:mx-0">
        <div className="relative w-24 h-36 rounded-sm overflow-hidden">
          <Image
            src={coverUrl ?? COVER_PLACEHOLDER}
            alt={`Portada de ${title}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="96px"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div>
          <h3 className="font-display text-base text-light leading-snug line-clamp-2">{title}</h3>
          <p className="text-accent/70 text-xs mt-0.5">{author}</p>
          {year && <p className="text-light/30 text-xs">{year}</p>}
        </div>

        {description && (
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
        )}

        <StarRating
          contentType="libro"
          contentId={book.id}
          avgRating={ratingStats?.avgRating}
          ratingCount={ratingStats?.ratingCount}
        />

        {/* Links */}
        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          {purchaseUrl && (
            <a
              href={purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
            >
              Conseguir libro <ExternalLink size={11} />
            </a>
          )}
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-light/40 hover:text-light/70 transition-colors"
            >
              PDF gratis <FileText size={11} />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
