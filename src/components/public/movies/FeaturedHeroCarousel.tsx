'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import type { Movie } from '@/types/app.types'

interface FeaturedHeroCarouselProps {
  movies: Movie[]
}

const CYCLE_MS = 7000

export const FeaturedHeroCarousel = ({ movies }: FeaturedHeroCarouselProps) => {
  const [active, setActive]     = useState(0)
  const [paused, setPaused]     = useState(false)
  const timerRef                = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (movies.length <= 1 || paused) return
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % movies.length)
    }, CYCLE_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [movies.length, paused])

  const current = movies[active]
  if (!current) return null

  const playable = Boolean(current.youtubeId || current.dailymotionId || current.okId || current.vimeoId)
  const href = `/peliculas/${current.id}`

  const restartTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (movies.length > 1 && !paused) {
      timerRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % movies.length)
      }, CYCLE_MS)
    }
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: 'min(70vh, 560px)' }}
      aria-label="Películas destacadas"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slides */}
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-700 ${index === active ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={index !== active}
        >
          {movie.thumbnailUrl ? (
            <Image
              src={movie.thumbnailUrl}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-secondary" />
          )}
        </div>
      ))}

      {/* Overlay oscuro */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(13,27,42,0.4) 0%, rgba(13,27,42,0.75) 70%, rgba(13,27,42,0.95) 100%)',
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 flex flex-col justify-end min-h-[inherit]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent/90 mb-3">
          Destacado
        </p>
        <h2 className="font-display text-3xl sm:text-5xl text-light leading-tight max-w-3xl mb-2">
          {current.title}
        </h2>
        {current.year && (
          <p className="text-light/50 text-sm sm:text-base mb-3">{current.year}</p>
        )}
        {current.description && (
          <p className="text-light/70 text-sm sm:text-base leading-relaxed max-w-2xl line-clamp-3 mb-6">
            {current.description}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          {playable ? (
            <Link
              href={href}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary font-semibold rounded-sm hover:bg-accent/90 transition-colors"
            >
              <Play size={16} fill="currentColor" /> Reproducir
            </Link>
          ) : (
            <Link
              href={href}
              className="inline-flex items-center gap-2 px-6 py-3 border border-accent/50 text-accent font-semibold rounded-sm hover:bg-accent/10 transition-colors"
            >
              Ver detalles
            </Link>
          )}
        </div>

        {movies.length > 1 && (
          <div className="flex items-center gap-2 mt-8" role="tablist" aria-label="Películas destacadas">
            {movies.map((movie, index) => (
              <button
                key={movie.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={movie.title}
                onClick={() => {
                  setActive(index)
                  restartTimer()
                }}
                className={`h-1.5 rounded-full transition-all ${
                  index === active ? 'w-8 bg-accent' : 'w-3 bg-light/30 hover:bg-light/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
