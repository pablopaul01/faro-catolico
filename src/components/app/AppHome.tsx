'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Film, Home, Menu, Music2, Play, Search, Sparkles, Video } from 'lucide-react'
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { APP_DOWNLOAD, APP_ROUTES, SITE_NAME } from '@/lib/constants'
import type { Book, Movie, Playlist, Song, YoutubeChannel, YoutubePlaylist } from '@/types/app.types'

interface AppHomeProps {
  movies: Movie[]
  books: Book[]
}

interface RailProps {
  title: string
  href?: string
  id: string
  children: ReactNode
}

const getMediaUrl = (item: Movie | Book | Song | YoutubePlaylist | YoutubeChannel | Playlist) => {
  if ('coverUrl' in item) return item.coverUrl
  return item.thumbnailUrl
}

const getTitle = (item: Movie | Book | Song | YoutubePlaylist | YoutubeChannel | Playlist) => {
  if ('name' in item) return item.name
  return item.title
}

export function AppRail({ title, href, id, children }: RailProps) {
  return (
    <section id={id} className="app-rail" aria-labelledby={`rail-${id}`}>
      <div className="flex items-end justify-between gap-4 mb-4 px-5 sm:px-8">
        <h2 id={`rail-${id}`} className="font-display text-xl sm:text-2xl text-light">{title}</h2>
        {href ? (
          <Link href={href} className="app-focus shrink-0 text-xs text-accent hover:text-light transition-colors">
            Ver todo
          </Link>
        ) : null}
      </div>
      <div className="app-rail-scroller no-scrollbar">{children}</div>
    </section>
  )
}

export function AppCard({
  item,
  href,
  kind,
}: {
  item: Movie | Book | Song | YoutubePlaylist | YoutubeChannel | Playlist
  href: string
  kind: 'movie' | 'book' | 'music' | 'playlist' | 'channel'
}) {
  const [isOpening, setIsOpening] = useState(false)
  const title = getTitle(item)
  const mediaUrl = getMediaUrl(item)
  const isBook = kind === 'book'

  return (
    <Link href={href} onClick={(event: MouseEvent<HTMLAnchorElement>) => {
      if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) setIsOpening(true)
    }} className={`app-card app-focus group ${isBook ? 'app-card-book' : ''}`} aria-label={isOpening ? `Abriendo ${title}` : title}>
      <div className={`relative overflow-hidden bg-secondary ${isBook ? 'app-card-cover' : 'app-card-poster'}`}>
        {mediaUrl ? (
          <Image src={mediaUrl} alt="" fill sizes="(max-width: 640px) 46vw, 280px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-accent/40">
            {kind === 'book' ? <BookOpen size={34} /> : kind === 'music' ? <Music2 size={34} /> : <Film size={34} />}
          </div>
        )}
        {!isBook && <div className="app-card-fade" />}
        {kind === 'movie' && (
          <span className="app-card-play">
            <Play size={14} fill="currentColor" />
          </span>
        )}
        {!isBook && (
          <div className="app-card-meta">
            {isOpening ? (
              <p className="flex items-center gap-2 text-sm font-medium text-accent" aria-live="polite">
                <span className="app-loading-dot" aria-hidden /> Abriendo...
              </p>
            ) : (
              <p className="line-clamp-2 text-sm font-medium leading-snug text-light">{title}</p>
            )}
            {'artist' in item && <p className="mt-1 truncate text-xs text-light/70">{item.artist}</p>}
          </div>
        )}
      </div>
      {isBook && (
        <div className="app-card-book-meta">
          {isOpening ? (
            <p className="flex items-center gap-2 text-sm font-medium text-accent" aria-live="polite">
              <span className="app-loading-dot" aria-hidden /> Abriendo...
            </p>
          ) : (
            <p className="line-clamp-2 text-sm font-medium leading-snug text-light">{title}</p>
          )}
          {'author' in item && <p className="mt-1 line-clamp-2 text-xs text-accent/80">{item.author}</p>}
        </div>
      )}
    </Link>
  )
}

export function AppNavigation() {
  const pathname = usePathname()
  const links = [
    { href: '/app-home', label: 'Inicio', icon: Home },
    { href: '/app-home/peliculas', label: 'Videos', icon: Video },
    { href: '/app-home/libros', label: 'Libros', icon: BookOpen },
    { href: APP_ROUTES.SUGGESTED, label: 'Sugeridos', icon: Sparkles },
    { href: APP_ROUTES.SEARCH, label: 'Buscar', icon: Search },
  ]

  if (pathname.startsWith('/app-home/reproducir/') || pathname.endsWith('/leer')) return null

  return (
    <>
      <header className="app-header">
        <Link href="/app-home" className="app-focus flex items-center gap-2 text-accent" aria-label={SITE_NAME}>
          <Image src="/fc-logo.png" alt="" width={38} height={38} />
          <span className="font-display text-lg sm:text-xl">{SITE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación de la aplicación">
          {links.slice(0, 4).map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="app-focus rounded-full px-4 py-2 text-sm text-light/65 hover:bg-white/10 hover:text-light transition-colors">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={APP_ROUTES.SEARCH} className="app-focus rounded-full p-2 text-light/70 hover:bg-white/10 hover:text-light" aria-label="Buscar">
            <Search size={20} />
          </Link>
          <button type="button" tabIndex={-1} className="app-tv-only rounded-full p-2 text-light/70 hover:bg-white/10 hover:text-light" aria-label="Abrir menú">
            <Menu size={21} />
          </button>
        </div>
      </header>
      <nav className="app-bottom-nav" aria-label="Navegación inferior">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="app-focus flex min-w-0 flex-1 flex-col items-center gap-1 py-2 text-[10px] text-light/55 hover:text-accent">
            <Icon size={19} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}

export function AppHome({ movies, books }: AppHomeProps) {
  const [isTv, setIsTv] = useState(false)
  const firstCardRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const userAgent = navigator.userAgent
    const tvUserAgent = /Android TV|GoogleTV|SMART-TV|AFT/.test(userAgent)
    const largePointer = window.matchMedia('(min-width: 1000px) and (hover: none)').matches
    setIsTv(tvUserAgent || largePointer)
  }, [])

  useEffect(() => {
    if (!isTv) return
    firstCardRef.current?.focus()
  }, [isTv])

  const movieHref = '/app-home/peliculas'

  return (
    <div id="inicio" className={`app-shell ${isTv ? 'app-tv-mode' : ''}`}>
      <main className="app-main">
        <section className="app-hero">
          <div className="app-hero-glow" aria-hidden />
          <div className="relative z-10 max-w-2xl px-5 sm:px-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">Faro Católico</p>
            <h1 className="font-display text-4xl leading-tight text-light sm:text-6xl">Contenido para crecer en gracia</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-light/60 sm:text-base">
              Películas, videos y libros seleccionados para acompañar la fe de tu familia.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link ref={firstCardRef} href={movieHref} className="app-focus inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-primary hover:bg-accent/90">
                <Play size={16} fill="currentColor" /> Explorar videos
              </Link>
              <Link href="/app-home/libros" className="app-focus inline-flex items-center gap-2 rounded-full border border-accent/40 px-5 py-3 text-sm text-accent hover:bg-accent/10">
                <BookOpen size={16} /> Leer libros
              </Link>
            </div>
          </div>
        </section>

        <div className="app-rails">
          {movies.length > 0 && (
            <AppRail id="peliculas" title="Películas y videos" href="/app-home/peliculas">
              {movies.map((movie) => <AppCard key={movie.id} item={movie} href={`/app-home/peliculas/${movie.id}`} kind="movie" />)}
            </AppRail>
          )}
          {books.length > 0 && (
            <AppRail id="libros" title="Libros para leer" href="/app-home/libros">
              {books.map((book) => <AppCard key={book.id} item={book} href={`/app-home/libros/${book.id}`} kind="book" />)}
            </AppRail>
          )}
        </div>
      </main>
      <p className="app-version">Faro Católico · App {APP_DOWNLOAD.VERSION}</p>
    </div>
  )
}
