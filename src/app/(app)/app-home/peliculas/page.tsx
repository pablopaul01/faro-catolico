import { fetchMoviesPageData } from '@/lib/data-cache'
import { AppCatalog } from '@/components/app/AppCatalog'
import type { Movie } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppMoviesPage() {
  const { movies: rows } = await fetchMoviesPageData()
  const movies: Movie[] = rows.map((row) => ({
    id: row.id, title: row.title, description: row.description,
    youtubeId: row.youtube_id, dailymotionId: row.dailymotion_id, okId: row.ok_id,
    vimeoId: row.vimeo_id, externalUrl: row.external_url, thumbnailUrl: row.thumbnail_url,
    year: row.year, categoryIds: [],
    platformIds: (row.movie_platform_items as { platform_id: string }[] ?? []).map((item) => item.platform_id),
    isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))

  return <AppCatalog title="Películas y videos" subtitle="Historias, documentales y vidas de santos para toda la familia." items={movies} kind="movie" getHref={(movie) => `/app-home/peliculas/${movie.id}`} />
}
