'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { ExternalLink, FileText } from 'lucide-react'
import { StarRating } from '@/components/public/StarRating'
import { ReportButton } from '@/components/public/ReportButton'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { Book, RatingStats } from '@/types/app.types'

const BookPdfViewer = dynamic(
  () => import('./BookPdfViewer').then((m) => m.BookPdfViewer),
  { ssr: false }
)

interface BookCardProps {
  book:         Book
  ratingStats?: RatingStats
}

const COVER_PLACEHOLDER = '/book-placeholder.svg'
const DESCRIPTION_LIMIT = 120

export const BookCard = ({ book, ratingStats }: BookCardProps) => {
  const { title, author, description, coverUrl, year, purchaseUrl, pdfUrl } = book
  const [expanded, setExpanded] = useState(false)
  const [showPdf,  setShowPdf]  = useState(false)
  const [mounted,  setMounted]  = useState(false)
  const copyrightMode = useSettingsStore((s) => s.copyrightMode)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    document.body.style.overflow = showPdf ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showPdf])

  const isLong = description && description.length > DESCRIPTION_LIMIT
  const displayText = isLong && !expanded
    ? description.slice(0, DESCRIPTION_LIMIT).trimEnd() + '…'
    : description

  const modal = mounted && showPdf && pdfUrl
    ? createPortal(
        <BookPdfViewer
          pdfUrl={pdfUrl}
          title={title}
          author={author}
          onClose={() => setShowPdf(false)}
        />,
        document.body
      )
    : null

  return (
    <>
      <article className="bg-card rounded-card overflow-hidden flex flex-col sm:flex-row gap-4 p-4 h-full transition-all duration-300 hover:gold-glow hover:-translate-y-1 group">
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

          <div className="mt-1">
            <ReportButton contentType="libro" contentId={book.id} contentTitle={title} />
          </div>

          {/* Links */}
          {!copyrightMode && (
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
              {purchaseUrl && (
                <a
                  href={purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-light/40 hover:text-light/70 transition-colors"
                >
                  Conseguir libro <ExternalLink size={11} />
                </a>
              )}
              {!purchaseUrl && <span />}
              {pdfUrl && (
                <button
                  onClick={() => setShowPdf(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-accent/10 border border-accent/40 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
                >
                  <FileText size={14} />
                  Leer PDF
                </button>
              )}
            </div>
          )}
        </div>
      </article>

      {modal}
    </>
  )
}
