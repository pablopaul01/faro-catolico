'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Film, Home, Music2, Play, Search, Sparkles, Video } from 'lucide-react'
import { useEffect, useLayoutEffect, useState, type MouseEvent, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { APP_DOWNLOAD, APP_ROUTES, SITE_NAME } from '@/lib/constants'
import { hasPendingFocusRestore } from '@/lib/app-session'
import { cn } from '@/lib/utils'
import { isTvDevice, TV_MEDIA_QUERY } from '@/lib/tv'
import type { Book, Movie } from '@/types/app.types'
import { useAppRecentsStore } from '@/stores/useAppRecentsStore'
import { AppHomeHero } from './AppHomeHero'
import { centerRail } from './AppDpadNavigation'

interface AppCardItem {
  id: string
  title?: string
  name?: string
  coverUrl?: string | null
  thumbnailUrl?: string | null
  author?: string
  artist?: string
}

interface AppHomeProps {
  movies:         Movie[]
  books:          Book[]
  featuredMovies?: Movie[]
}

interface RailProps {
  title: string
  href?: string
  id: string
  children: ReactNode
}

const getMediaUrl = (item: AppCardItem) => item.coverUrl ?? item.thumbnailUrl ?? null

const getTitle = (item: AppCardItem) => item.name ?? item.title ?? ''

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
  item: AppCardItem
  href: string
  kind: 'movie' | 'book' | 'music' | 'playlist' | 'channel'
}) {
  const [isOpening, setIsOpening] = useState(false)
  const [hasImageError, setHasImageError] = useState(false)
  const title = getTitle(item)
  const mediaUrl = getMediaUrl(item)
  const isBook = kind === 'book'
  const showImage = Boolean(mediaUrl) && !hasImageError

  return (
    <Link href={href} onClick={(event: MouseEvent<HTMLAnchorElement>) => {
      if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) setIsOpening(true)
    }} className={`app-card app-focus group ${isBook ? 'app-card-book' : ''}`} aria-label={isOpening ? `Abriendo ${title}` : title}>
      <div className={`relative overflow-hidden bg-secondary ${isBook ? 'app-card-cover' : 'app-card-poster'}`}>
        {showImage ? (
          <Image src={mediaUrl!} alt="" fill sizes="(max-width: 640px) 46vw, 280px" className="object-cover transition-transform duration-300 group-hover:scale-105" onError={() => setHasImageError(true)} />
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
            {item.artist ? <p className="mt-1 truncate text-xs text-light/70">{item.artist}</p> : null}
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
          {item.author ? <p className="mt-1 line-clamp-2 text-xs text-accent/80">{item.author}</p> : null}
        </div>
      )}
    </Link>
  )
}

function isNavActive(pathname: string, href: string) {
  if (href === APP_ROUTES.HOME) return pathname === APP_ROUTES.HOME
  if (href === APP_ROUTES.SUGGESTED) {
    return pathname.startsWith(APP_ROUTES.SUGGESTED)
      || pathname.startsWith(APP_ROUTES.PLAYLISTS)
      || pathname.startsWith(APP_ROUTES.CHANNELS)
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppNavigation() {
  const pathname = usePathname()
  const links = [
    { href: APP_ROUTES.HOME, label: 'Inicio', icon: Home },
    { href: APP_ROUTES.MOVIES, label: 'Videos', icon: Video },
    { href: APP_ROUTES.BOOKS, label: 'Libros', icon: BookOpen },
    { href: APP_ROUTES.SUGGESTED, label: 'Sugeridos', icon: Sparkles },
    { href: APP_ROUTES.SEARCH, label: 'Buscar', icon: Search },
  ]

  if (pathname.startsWith(`${APP_ROUTES.HOME}/reproducir/`) || pathname.endsWith('/leer')) return null

  return (
    <>
      <header className="app-header">
        <Link href={APP_ROUTES.HOME} className="app-focus flex items-center gap-2 text-accent" aria-label={SITE_NAME}>
          <Image src="/fc-logo.png" alt="" width={38} height={38} />
          <span className="font-display text-lg sm:text-xl">{SITE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación de la aplicación">
          {links.slice(0, 4).map(({ href, label }) => {
            const active = isNavActive(pathname, href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'app-focus rounded-full px-4 py-2 text-sm transition-colors hover:bg-white/10 hover:text-light',
                  active ? 'app-nav-active text-accent' : 'text-light/65',
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={APP_ROUTES.SEARCH}
            aria-current={isNavActive(pathname, APP_ROUTES.SEARCH) ? 'page' : undefined}
            className={cn(
              'app-focus rounded-full p-2 hover:bg-white/10 hover:text-light',
              isNavActive(pathname, APP_ROUTES.SEARCH) ? 'app-nav-active text-accent' : 'text-light/70',
            )}
            aria-label="Buscar"
          >
            <Search size={20} />
          </Link>
        </div>
      </header>
      <nav className="app-bottom-nav" aria-label="Navegación inferior">
        {links.map(({ href, label, icon: Icon }) => {
          const active = isNavActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'app-focus flex min-w-0 flex-1 flex-col items-center gap-1 py-2 text-[10px] hover:text-accent',
                active ? 'app-nav-active text-accent' : 'text-light/55',
              )}
            >
              <Icon size={19} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}

function AppRecentsRail() {
  const items = useAppRecentsStore((state) => state.items)
  const hydrated = useAppRecentsStore((state) => state.hydrated)
  const hydrate = useAppRecentsStore((state) => state.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!hydrated || items.length === 0) return null

  return (
    <AppRail id="vistos-recientes" title="Recientes">
      {items.map((item) => (
        <AppCard
          key={`${item.kind}-${item.id}`}
          item={item.kind === 'book'
            ? { id: item.id, title: item.title, coverUrl: item.imageUrl, author: item.subtitle ?? '' }
            : { id: item.id, title: item.title, thumbnailUrl: item.imageUrl }}
          href={item.href}
          kind={item.kind}
        />
      ))}
    </AppRail>
  )
}

export function AppHome({ movies, books, featuredMovies }: AppHomeProps) {
  const [isTv, setIsTv] = useState(false)

  useLayoutEffect(() => {
    const sync = () => setIsTv(isTvDevice())
    sync()
    const media = window.matchMedia(TV_MEDIA_QUERY)
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!isTv || hasPendingFocusRestore(APP_ROUTES.HOME)) return
    const hero = document.querySelector<HTMLElement>('.app-home-hero')
    hero?.querySelector<HTMLElement>('.app-focus')?.focus({ preventScroll: true })
    if (hero) centerRail(hero)
  }, [isTv, featuredMovies])

  const heroMovies = featuredMovies && featuredMovies.length > 0 ? featuredMovies : movies.slice(0, 3)
  const hasCatalog = movies.length > 0 || books.length > 0

  return (
    <div id="inicio" className="app-shell">
      <main className="app-main">
        {heroMovies.length > 0 ? (
          <AppHomeHero movies={heroMovies} />
        ) : (
          <section className="app-hero app-home-legacy-hero">
            <div className="app-hero-glow" aria-hidden />
            <div className="relative z-10 max-w-2xl px-5 sm:px-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">Faro Católico</p>
              <h1 className="font-display text-4xl leading-tight text-light sm:text-6xl">Contenido para crecer en gracia</h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-light/60 sm:text-base">
                Películas, videos y libros seleccionados para acompañar la fe de tu familia.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={APP_ROUTES.MOVIES} className="app-focus inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-primary hover:bg-accent/90">
                  <Play size={16} fill="currentColor" /> Explorar videos
                </Link>
                <Link href={APP_ROUTES.BOOKS} className="app-focus inline-flex items-center gap-2 rounded-full border border-accent/40 px-5 py-3 text-sm text-accent hover:bg-accent/10">
                  <BookOpen size={16} /> Leer libros
                </Link>
              </div>
            </div>
          </section>
        )}

        <div className="app-rails">
          <AppRecentsRail />
          {movies.length > 0 && (
            <AppRail id="peliculas" title="Películas y videos" href={APP_ROUTES.MOVIES}>
              {movies.map((movie) => <AppCard key={movie.id} item={movie} href={`${APP_ROUTES.MOVIES}/${movie.id}`} kind="movie" />)}
            </AppRail>
          )}
          {books.length > 0 && (
            <AppRail id="libros" title="Libros para leer" href={APP_ROUTES.BOOKS}>
              {books.map((book) => <AppCard key={book.id} item={book} href={`${APP_ROUTES.BOOKS}/${book.id}`} kind="book" />)}
            </AppRail>
          )}
          {!hasCatalog && (
            <p className="px-5 text-sm text-light/50 sm:px-8">Todavía no hay contenido disponible.</p>
          )}
        </div>
      </main>
      <p className="app-version">Faro Católico · App {APP_DOWNLOAD.VERSION}</p>
    </div>
  )
}
