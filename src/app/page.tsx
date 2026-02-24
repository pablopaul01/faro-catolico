import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES, ROUTES, ITEMS_PER_PAGE } from '@/lib/constants'
import { Hero } from '@/components/public/Hero'
import { SectionHeader } from '@/components/public/SectionHeader'
import { MovieGrid } from '@/components/public/movies/MovieGrid'
import { BookGrid } from '@/components/public/books/BookGrid'
import { MusicSection } from '@/components/public/music/MusicSection'
import type { Movie, Book, Song, MusicCategory } from '@/types/app.types'

const PREVIEW_LIMIT = 6

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()

  // Fetch en paralelo para las 3 secciones
  const [moviesRes, booksRes, songsRes] = await Promise.all([
    supabase
      .from(TABLE_NAMES.MOVIES)
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(PREVIEW_LIMIT),
    supabase
      .from(TABLE_NAMES.BOOKS)
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(PREVIEW_LIMIT),
    supabase
      .from(TABLE_NAMES.SONGS)
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(ITEMS_PER_PAGE),
  ])

  const movies: Movie[] = (moviesRes.data ?? []).map((row) => ({
    id: row.id, title: row.title, description: row.description,
    youtubeId: row.youtube_id, externalUrl: row.external_url,
    thumbnailUrl: row.thumbnail_url, year: row.year, categoryId: row.category_id,
    isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))

  const books: Book[] = (booksRes.data ?? []).map((row) => ({
    id: row.id, title: row.title, author: row.author,
    description: row.description, coverUrl: row.cover_url,
    purchaseUrl: row.purchase_url, pdfUrl: row.pdf_url, year: row.year, categoryId: row.category_id,
    isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))

  const songs: Song[] = (songsRes.data ?? []).map((row) => ({
    id: row.id, title: row.title, artist: row.artist,
    category: row.category as MusicCategory, youtubeId: row.youtube_id,
    spotifyUrl: row.spotify_url, externalUrl: row.external_url,
    thumbnailUrl: row.thumbnail_url, durationSec: row.duration_sec,
    isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))

  return (
    <>
      <Hero />

      {/* Sección películas */}
      <section id="peliculas" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeader
          title="Películas"
          subtitle="Vidas de santos y films aptos para toda la familia"
          viewAllHref={ROUTES.MOVIES}
          viewAllLabel="Ver todas"
        />
        <MovieGrid movies={movies} />
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
        <BookGrid books={books} />
      </section>

      {/* Divisor */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Sección música */}
      <section id="musica" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeader
          title="Música"
          subtitle="Canciones para cada momento del corazón"
          viewAllHref={ROUTES.MUSIC}
          viewAllLabel="Ver todo"
        />
        <MusicSection songs={songs} />
      </section>
    </>
  )
}
