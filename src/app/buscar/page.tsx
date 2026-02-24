import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES, ROUTES, SITE_NAME } from '@/lib/constants'
import { SearchForm } from '@/components/public/SearchForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Buscar — ${SITE_NAME}`,
}

interface Props {
  searchParams: Promise<{ q?: string; tipo?: string }>
}

const TYPE_LABELS: Record<string, string> = {
  pelicula: 'Película',
  libro:    'Libro',
  cancion:  'Canción',
}

const TYPE_COLORS: Record<string, string> = {
  pelicula: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
  libro:    'bg-emerald-900/40 text-emerald-300 border-emerald-700/40',
  cancion:  'bg-purple-900/40 text-purple-300 border-purple-700/40',
}

const TYPE_ROUTES: Record<string, string> = {
  pelicula: ROUTES.MOVIES,
  libro:    ROUTES.BOOKS,
  cancion:  ROUTES.MUSIC,
}

type ResultItem = { id: string; title: string; subtitle: string | null; tipo: string }

export default async function BuscarPage({ searchParams }: Props) {
  const { q, tipo } = await searchParams
  const query = q?.trim() ?? ''

  let results: ResultItem[] = []

  if (query) {
    const supabase = await createSupabaseServerClient()
    const pattern  = `%${query}%`

    const fetchMovies = (!tipo || tipo === 'pelicula')
      ? supabase.from(TABLE_NAMES.MOVIES).select('id, title, description')
          .eq('is_published', true)
          .or(`title.ilike.${pattern},description.ilike.${pattern}`)
          .limit(20)
      : Promise.resolve({ data: [] })

    const fetchBooks = (!tipo || tipo === 'libro')
      ? supabase.from(TABLE_NAMES.BOOKS).select('id, title, author')
          .eq('is_published', true)
          .or(`title.ilike.${pattern},author.ilike.${pattern}`)
          .limit(20)
      : Promise.resolve({ data: [] })

    const fetchSongs = (!tipo || tipo === 'cancion')
      ? supabase.from(TABLE_NAMES.SONGS).select('id, title, artist')
          .eq('is_published', true)
          .or(`title.ilike.${pattern},artist.ilike.${pattern}`)
          .limit(20)
      : Promise.resolve({ data: [] })

    const [moviesRes, booksRes, songsRes] = await Promise.all([fetchMovies, fetchBooks, fetchSongs])

    const movies = (moviesRes.data ?? []).map((r) => ({
      id: r.id, title: r.title, subtitle: r.description as string | null, tipo: 'pelicula',
    }))
    const books = (booksRes.data ?? []).map((r) => ({
      id: r.id, title: r.title, subtitle: r.author as string | null, tipo: 'libro',
    }))
    const songs = (songsRes.data ?? []).map((r) => ({
      id: r.id, title: r.title, subtitle: r.artist as string | null, tipo: 'cancion',
    }))

    results = [...movies, ...books, ...songs]
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <h1 className="font-display text-3xl sm:text-4xl text-light mb-6">Buscar</h1>

      <SearchForm initialQ={query} initialTipo={tipo ?? ''} />

      {query && results.length === 0 && (
        <div className="text-center py-16 text-light/30">
          <p className="text-lg mb-2">Sin resultados para "{query}"</p>
          <p className="text-sm">Intentá con otro término o filtrá por tipo.</p>
        </div>
      )}

      {!query && (
        <div className="text-center py-16 text-light/30">
          <p className="text-sm">Escribí algo para buscar en el catálogo.</p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <p className="text-xs text-light/40 mb-4">
            {results.length} resultado{results.length !== 1 ? 's' : ''} para "{query}"
          </p>
          <ul className="space-y-2">
            {results.map((item) => (
              <li key={`${item.tipo}-${item.id}`}>
                <Link
                  href={TYPE_ROUTES[item.tipo]}
                  className="flex items-center gap-3 p-3 bg-secondary border border-border rounded-card hover:border-accent/40 transition-colors group"
                >
                  <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${TYPE_COLORS[item.tipo]}`}>
                    {TYPE_LABELS[item.tipo]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-light group-hover:text-accent transition-colors truncate">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-xs text-light/40 truncate">{item.subtitle}</p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
