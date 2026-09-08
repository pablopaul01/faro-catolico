'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { APP_ROUTES, appMoviePlayHref } from '@/lib/constants'
import { isMoviePlayable } from '@/lib/utils'
import type { Movie } from '@/types/app.types'
import { AppLoadingLink } from './AppLoadingLink'

interface AppHomeHeroProps {
  movies: Movie[]
}

const CYCLE_MS = 7000

export function AppHomeHero({ movies }: AppHomeHeroProps) {
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (movies.length <= 1) return

    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % movies.length)
    }, CYCLE_MS)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [movies.length])

  const current = movies[active]
  if (!current) return null

  const playable = isMoviePlayable(current)
  const detailHref = `${APP_ROUTES.MOVIES}/${current.id}`
  const href = playable ? appMoviePlayHref(current.id) : detailHref

  return (
    <section className="app-home-hero" aria-label="Contenido destacado">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`app-home-hero-slide ${index === active ? 'app-home-hero-slide-active' : ''}`}
          style={{ '--slide-bg': movie.thumbnailUrl ? `url(${movie.thumbnailUrl})` : 'none' } as React.CSSProperties}
          aria-hidden={index !== active}
        />
      ))}
      <div className="app-home-hero-overlay" aria-hidden />
      <div className="app-home-hero-content">
        <p className="app-home-hero-label">Destacado</p>
        <h2 className="app-home-hero-title">{current.title}</h2>
        {current.year && <p className="app-home-hero-year">{current.year}</p>}
        {current.description && <p className="app-home-hero-desc">{current.description}</p>}
        <div className="app-detail-actions">
          {playable ? (
            <AppLoadingLink
              href={href}
              loadingLabel="Abriendo reproducción..."
              className="app-focus app-home-hero-play inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-semibold text-primary hover:bg-accent/90"
            >
              <Play size={18} fill="currentColor" /> Reproducir
            </AppLoadingLink>
          ) : (
            <Link
              href={href}
              className="app-focus inline-flex items-center gap-2 rounded-full border border-accent/40 px-6 py-3 text-base text-accent hover:bg-accent/10"
            >
              Ver ficha
            </Link>
          )}
        </div>
        {movies.length > 1 && (
          <div className="app-home-hero-dots" role="tablist" aria-label="Contenido destacado">
            {movies.map((movie, index) => (
              <button
                key={movie.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={movie.title}
                className={`app-home-hero-dot ${index === active ? 'app-home-hero-dot-active' : ''}`}
                onClick={() => {
                  setActive(index)
                  if (timerRef.current) clearInterval(timerRef.current)
                  timerRef.current = setInterval(() => {
                    setActive((prev) => (prev + 1) % movies.length)
                  }, CYCLE_MS)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
