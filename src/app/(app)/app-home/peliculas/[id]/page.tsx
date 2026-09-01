import { notFound } from 'next/navigation'
import { fetchMoviesPageData } from '@/lib/data-cache'
import { AppMovieDetails } from '@/components/app/AppDetails'
import type { Movie } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppMovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { movies: rows } = await fetchMoviesPageData()
  const row = rows.find((movie) => movie.id === id)
  if (!row) notFound()

  const movie: Movie = {
    id: row.id, title: row.title, description: row.description,
    youtubeId: row.youtube_id, dailymotionId: row.dailymotion_id, okId: row.ok_id,
    vimeoId: row.vimeo_id, externalUrl: row.external_url, thumbnailUrl: row.thumbnail_url,
    year: row.year, categoryIds: [], platformIds: [], isPublished: row.is_published,
    sortOrder: row.sort_order,
    isFeatured: row.is_featured ?? false, heroOrder: row.hero_order ?? 0,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }
  return <AppMovieDetails movie={movie} />
}
