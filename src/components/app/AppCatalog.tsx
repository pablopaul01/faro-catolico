import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AppCard } from './AppHome'
import type { Book, Movie, Playlist, Song, YoutubeChannel, YoutubePlaylist } from '@/types/app.types'

type AppItem = Movie | Book | Song | Playlist | YoutubePlaylist | YoutubeChannel

interface AppCatalogProps {
  title: string
  subtitle: string
  backHref?: string
  items: AppItem[]
  kind: 'movie' | 'book' | 'music' | 'playlist' | 'channel'
  getHref: (item: AppItem) => string
}

export function AppCatalog({ title, subtitle, backHref = '/app-home', items, kind, getHref }: AppCatalogProps) {
  return (
    <main className="app-catalog">
      <div className="app-catalog-heading">
        <Link href={backHref} className="app-focus inline-flex items-center gap-2 text-sm text-light/60 hover:text-accent">
          <ArrowLeft size={17} /> Volver
        </Link>
        <h1 className="mt-6 font-display text-3xl text-light sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-light/55 sm:text-base">{subtitle}</p>
      </div>
      {items.length > 0 ? (
      <div className="app-catalog-grid">
          {items.map((item) => <AppCard key={item.id} item={item} href={getHref(item)} kind={kind} />)}
        </div>
      ) : (
        <p className="px-5 text-sm text-light/50 sm:px-8">Todavía no hay contenido disponible en esta sección.</p>
      )}
    </main>
  )
}
