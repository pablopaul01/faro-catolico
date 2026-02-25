import { createSupabaseServerClient } from '@/lib/supabase/server'
import { fetchRatingsForContent } from '@/services/ratings.server'
import { TABLE_NAMES, ROUTES } from '@/lib/constants'
import { Hero } from '@/components/public/Hero'
import { SectionHeader } from '@/components/public/SectionHeader'
import { MovieGrid } from '@/components/public/movies/MovieGrid'
import { BookGrid } from '@/components/public/books/BookGrid'
import { SongCard } from '@/components/public/music/SongCard'
import type { Movie, Book, Song, MoviePlatform } from '@/types/app.types'

const PREVIEW_LIMIT = 6

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()

  const [moviesRes, booksRes, songsRes, platsRes, movieRatings, bookRatings, songRatings] = await Promise.all([
    supabase
      .from(TABLE_NAMES.MOVIES)
      .select(`*, ${TABLE_NAMES.MOVIE_PLATFORM_ITEMS}(platform_id)`)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(PREVIEW_LIMIT),
    supabase
      .from(TABLE_NAMES.BOOKS)
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(PREVIEW_LIMIT),
    supabase
      .from(TABLE_NAMES.SONGS)
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(PREVIEW_LIMIT),
    supabase.from(TABLE_NAMES.MOVIE_PLATFORMS).select('*').order('sort_order', { ascending: true }),
    fetchRatingsForContent('pelicula'),
    fetchRatingsForContent('libro'),
    fetchRatingsForContent('cancion'),
  ])

  const platformsMap: Record<string, MoviePlatform> = {}
  for (const row of platsRes.data ?? []) {
    platformsMap[row.id] = { id: row.id, name: row.name, sortOrder: row.sort_order, createdAt: row.created_at }
  }

  const movies: Movie[] = (moviesRes.data ?? []).map((row) => ({
    id: row.id, title: row.title, description: row.description,
    youtubeId: row.youtube_id, externalUrl: row.external_url,
    thumbnailUrl: row.thumbnail_url, year: row.year, categoryIds: [],
    platformIds: (row.movie_platform_items as { platform_id: string }[] ?? []).map((r) => r.platform_id),
    isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))

  const books: Book[] = (booksRes.data ?? []).map((row) => ({
    id: row.id, title: row.title, author: row.author,
    description: row.description, coverUrl: row.cover_url,
    purchaseUrl: row.purchase_url, pdfUrl: row.pdf_url, year: row.year, categoryIds: [],
    isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))

  const songs: Song[] = (songsRes.data ?? []).map((row) => ({
    id: row.id, title: row.title, artist: row.artist,
    categoryIds: [], youtubeId: row.youtube_id,
    spotifyUrl: row.spotify_url, externalUrl: row.external_url,
    thumbnailUrl: row.thumbnail_url, durationSec: row.duration_sec,
    isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))

  return (
    <>
      <Hero />

      {/* Sección películas */}
      <section id="peliculas" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <SectionHeader
          title="Películas"
          subtitle="Vidas de santos y films aptos para toda la familia"
          viewAllHref={ROUTES.MOVIES}
          viewAllLabel="Ver todas"
        />
        <MovieGrid movies={movies} ratingsMap={movieRatings} platformsMap={platformsMap} slider />
      </section>

      {/* Divisor */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Sección libros */}
      <section id="libros" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeader
          title="Libros"
          subtitle="Lectura seleccionada para el crecimiento espiritual"
          viewAllHref={ROUTES.BOOKS}
          viewAllLabel="Ver todos"
        />
        <BookGrid books={books} ratingsMap={bookRatings} slider />
      </section>

      {/* Divisor */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Sección música */}
      <section id="musica" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 pt-10">
        <SectionHeader
          title="Música"
          subtitle="Canciones para cada momento del corazón"
          viewAllHref={ROUTES.MUSIC}
          viewAllLabel="Ver todo"
        />
        <div className="space-y-2">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} ratingStats={songRatings?.[song.id]} />
          ))}
        </div>
      </section>
    </>
  )
}
