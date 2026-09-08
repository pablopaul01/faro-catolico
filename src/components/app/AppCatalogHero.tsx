'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { APP_ROUTES, appMoviePlayHref } from '@/lib/constants'
import { isMoviePlayable } from '@/lib/utils'
import { AppAutoFocus } from './AppAutoFocus'
import { AppLoadingLink } from './AppLoadingLink'
import type { Movie } from '@/types/app.types'

interface AppCatalogHeroProps {
  movie: Movie
}

export function AppCatalogHero({ movie }: AppCatalogHeroProps) {
  const playable = isMoviePlayable(movie)
  const detailHref = `${APP_ROUTES.MOVIES}/${movie.id}`
  const href = playable ? appMoviePlayHref(movie.id) : detailHref

  return (
    <section
      className="app-catalog-hero"
      style={{ '--hero-backdrop': movie.thumbnailUrl ? `url(${movie.thumbnailUrl})` : 'none' } as React.CSSProperties}
    >
      <div className="app-catalog-hero-overlay" aria-hidden />
      <div className="app-catalog-hero-content">
        <p className="app-catalog-hero-label">Película destacada</p>
        <h2 className="app-catalog-hero-title">{movie.title}</h2>
        {movie.year && <p className="app-catalog-hero-year">{movie.year}</p>}
        {movie.description && <p className="app-catalog-hero-desc">{movie.description}</p>}
        <div className="app-detail-actions">
          {playable ? (
            <AppAutoFocus>
              <AppLoadingLink href={href} loadingLabel="Abriendo reproducción..." className="app-focus inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-semibold text-primary hover:bg-accent/90">
                <Play size={18} fill="currentColor" /> Reproducir
              </AppLoadingLink>
            </AppAutoFocus>
          ) : (
            <Link href={href} className="app-focus inline-flex items-center gap-2 rounded-full border border-accent/40 px-6 py-3 text-base text-accent hover:bg-accent/10">
              Ver ficha
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
