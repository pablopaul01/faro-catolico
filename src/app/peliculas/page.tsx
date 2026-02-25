import { createSupabaseServerClient } from '@/lib/supabase/server'
import { fetchRatingsForContent } from '@/services/ratings.server'
import { TABLE_NAMES, SITE_NAME } from '@/lib/constants'
import { MovieFilterSection } from '@/components/public/movies/MovieFilterSection'
import { SectionHeader } from '@/components/public/SectionHeader'
import type { Metadata } from 'next'
import type { Movie, MovieCategory } from '@/types/app.types'

export const metadata: Metadata = {
  title:       `Películas recomendadas — ${SITE_NAME}`,
  description: 'Películas católicas y aptas para la familia: vidas de santos, documentales de fe y films de valores.',
}

export default async function PeliculasPage() {
  const supabase = await createSupabaseServerClient()

  const [moviesRes, catsRes, ratingsMap] = await Promise.all([
    supabase
      .from(TABLE_NAMES.MOVIES)
      .select(`*, ${TABLE_NAMES.MOVIE_CATEGORY_ITEMS}(category_id)`)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    supabase
      .from(TABLE_NAMES.MOVIE_CATEGORIES)
      .select('*')
      .order('sort_order', { ascending: true }),
    fetchRatingsForContent('pelicula'),
  ])

  const movies: Movie[] = (moviesRes.data ?? []).map((row) => ({
    id:           row.id,
    title:        row.title,
    description:  row.description,
    youtubeId:    row.youtube_id,
    externalUrl:  row.external_url,
    thumbnailUrl: row.thumbnail_url,
    year:         row.year,
    categoryIds:  (row.movie_category_items as { category_id: string }[] ?? []).map((r) => r.category_id),
    isPublished:  row.is_published,
    sortOrder:    row.sort_order,
    createdAt:    row.created_at,
    updatedAt:    row.updated_at,
  }))

  const categories: MovieCategory[] = (catsRes.data ?? []).map((row) => ({
    id:        row.id,
    name:      row.name,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }))

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <SectionHeader
        title="Películas"
        subtitle="Vidas de santos, documentales y films aptos para toda la familia"
      />
      <MovieFilterSection movies={movies} categories={categories} ratingsMap={ratingsMap} />
    </main>
  )
}
