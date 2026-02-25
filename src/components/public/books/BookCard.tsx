'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ExternalLink, FileText, X, Download } from 'lucide-react'
import { StarRating } from '@/components/public/StarRating'
import type { Book, RatingStats } from '@/types/app.types'

interface BookCardProps {
  book:         Book
  ratingStats?: RatingStats
}

const COVER_PLACEHOLDER = 'https://placehold.co/200x300/1B263B/D4AF37?text=Libro'
const DESCRIPTION_LIMIT = 120

const isSupabaseUrl = (url: string) => url.includes('.supabase.co/storage/')

export const BookCard = ({ book, ratingStats }: BookCardProps) => {
  const { title, author, description, coverUrl, year, purchaseUrl, pdfUrl } = book
  const [expanded,  setExpanded]  = useState(false)
  const [showPdf,   setShowPdf]   = useState(false)
  const [mounted,   setMounted]   = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = showPdf ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showPdf])

  const isLong = description && description.length > DESCRIPTION_LIMIT
  const displayText = isLong && !expanded
    ? description.slice(0, DESCRIPTION_LIMIT).trimEnd() + '…'
    : description

  const handlePdfClick = () => {
    // Móvil/tablet: los iframes no renderizan PDFs — abrir con el visor nativo del dispositivo
    if (navigator.maxTouchPoints > 0) {
      window.open(pdfUrl!, '_blank', 'noopener,noreferrer')
    } else {
      setShowPdf(true)
    }
  }

  const modal = mounted && showPdf && pdfUrl
    ? createPortal(
        <div className="fixed inset-0 z-9999 flex flex-col bg-black/95 animate-fade-in">
          {/* Barra superior */}
          <div className="flex items-center justify-between gap-4 px-4 py-3 bg-secondary border-b border-border shrink-0">
            <div className="min-w-0">
              <p className="text-light font-display text-sm truncate">{title}</p>
              <p className="text-light/40 text-xs">{author}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-sm border border-border text-light/50 hover:text-light hover:border-accent/40 transition-colors"
              >
                <Download size={13} />
                Descargar
              </a>
              <button
                onClick={() => setShowPdf(false)}
                className="p-1.5 text-light/50 hover:text-light hover:bg-white/10 rounded-sm transition-colors"
                aria-label="Cerrar visor"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Iframe PDF */}
          <iframe
            src={pdfUrl}
            title={`PDF: ${title}`}
            className="flex-1 w-full border-0"
          />
        </div>,
        document.body
      )
    : null

  return (
    <>
      <article className="bg-card rounded-card overflow-hidden flex flex-col sm:flex-row gap-4 p-4 h-full transition-all duration-300 hover:gold-glow group">
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
            {pdfUrl && isSupabaseUrl(pdfUrl) ? (
              <button
                onClick={handlePdfClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-accent/10 border border-accent/40 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
              >
                <FileText size={14} />
                Leer PDF
              </button>
            ) : pdfUrl ? (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-accent/10 border border-accent/40 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
              >
                <FileText size={14} />
                PDF gratis
              </a>
            ) : null}
          </div>
        </div>
      </article>

      {modal}
    </>
  )
}
