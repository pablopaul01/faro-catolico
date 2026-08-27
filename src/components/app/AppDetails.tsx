import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BookOpen, ExternalLink, Play } from 'lucide-react'
import type { Book, Movie } from '@/types/app.types'
import { AppLoadingLink } from './AppLoadingLink'
import { AppAutoFocus } from './AppAutoFocus'

export function AppMovieDetails({ movie }: { movie: Movie }) {
  const playable = Boolean(movie.youtubeId || movie.dailymotionId || movie.okId || movie.vimeoId)
  return (
    <main
      className="app-detail app-detail-movie"
      style={{ '--detail-backdrop': movie.thumbnailUrl ? `url(${movie.thumbnailUrl})` : 'none' } as React.CSSProperties}
    >
      <Link href="/app-home/peliculas" className="app-focus app-detail-back inline-flex items-center gap-2 text-sm text-light/60 hover:text-accent">
        <ArrowLeft size={17} /> Volver a películas
      </Link>
      <div className="app-detail-layout">
        <div className="app-detail-media">
          {movie.thumbnailUrl ? <Image src={movie.thumbnailUrl} alt="" fill sizes="(max-width: 767px) 100vw, 42vw" className="object-cover" priority /> : <div className="h-full bg-secondary" />}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/75">Película</p>
          <h1 className="mt-3 font-display text-3xl text-light sm:text-5xl">{movie.title}</h1>
          {movie.year && <p className="mt-3 text-sm text-light/45">{movie.year}</p>}
          <div className="app-detail-actions">
            {playable ? (
              <AppAutoFocus>
                <AppLoadingLink
                  href={`/app-home/reproducir/pelicula/${movie.id}`}
                  loadingLabel="Abriendo reproducción..."
                  className="app-focus app-detail-play-btn inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-primary hover:bg-accent/90"
                >
                  <Play size={16} fill="currentColor" /> Reproducir
                </AppLoadingLink>
              </AppAutoFocus>
            ) : movie.externalUrl ? (
              <a href={movie.externalUrl} target="_blank" rel="noopener noreferrer" className="app-focus app-detail-external-btn inline-flex items-center gap-2 rounded-full border border-accent/40 px-5 py-3 text-sm text-accent">
                <ExternalLink size={16} /> Ver en plataforma
              </a>
            ) : <p className="text-sm italic text-light/45">Este contenido no tiene una reproducción gratuita disponible.</p>}
          </div>
          {movie.description && <p className="mt-5 max-w-2xl text-sm leading-relaxed text-light/65 sm:text-base app-detail-desc">{movie.description}</p>}
        </div>
      </div>
    </main>
  )
}

export function AppBookDetails({ book }: { book: Book }) {
  return (
    <main
      className="app-detail app-detail-book-hero"
      style={{ '--detail-backdrop': book.coverUrl ? `url(${book.coverUrl})` : 'none' } as React.CSSProperties}
    >
      <Link href="/app-home/libros" className="app-focus app-detail-back inline-flex items-center gap-2 text-sm text-light/60 hover:text-accent">
        <ArrowLeft size={17} /> Volver a libros
      </Link>
      <div className="app-detail-layout">
        <div className="app-detail-media app-detail-book">
          {book.coverUrl ? <Image src={book.coverUrl} alt="" fill sizes="(max-width: 767px) 70vw, 25vw" className="object-cover" priority /> : <div className="flex h-full items-center justify-center bg-secondary text-accent/50"><BookOpen size={48} /></div>}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/75">Libro</p>
          <h1 className="mt-3 font-display text-3xl text-light sm:text-5xl">{book.title}</h1>
          <p className="mt-3 text-accent/75">{book.author}</p>
          <div className="app-detail-actions">
            {book.pdfUrl ? (
              <AppAutoFocus>
                <AppLoadingLink href={`/app-home/libros/${book.id}/leer`} loadingLabel="Abriendo lectura..." className="app-focus inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-primary hover:bg-accent/90">
                  <BookOpen size={16} /> Leer libro
                </AppLoadingLink>
              </AppAutoFocus>
            ) : (
              <p className="text-sm italic text-light/45">Este libro no tiene un PDF disponible para leer en la app.</p>
            )}
          </div>
          {book.description && <p className="mt-5 max-w-2xl text-sm leading-relaxed text-light/65 sm:text-base app-detail-desc">{book.description}</p>}
        </div>
      </div>
    </main>
  )
}
