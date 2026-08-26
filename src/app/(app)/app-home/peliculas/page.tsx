import { fetchMoviesPageData } from '@/lib/data-cache'
import { AppRail, AppCard } from '@/components/app/AppHome'
import type { Movie, MovieCategory } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppMoviesPage() {
  const { movies: rows, categories: catsRaw } = await fetchMoviesPageData()

  const movies: Movie[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    youtubeId: row.youtube_id,
    dailymotionId: row.dailymotion_id,
    okId: row.ok_id,
    vimeoId: row.vimeo_id,
    externalUrl: row.external_url,
    thumbnailUrl: row.thumbnail_url,
    year: row.year,
    categoryIds: (row.movie_category_items as { category_id: string }[] ?? []).map((item) => item.category_id),
    platformIds: (row.movie_platform_items as { platform_id: string }[] ?? []).map((item) => item.platform_id),
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))

  const categories: MovieCategory[] = catsRaw.map((row) => ({
    id: row.id,
    name: row.name,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }))

  const recent = movies.slice(0, 12)
  const uncategorized = movies.filter((movie) => movie.categoryIds.length === 0)
  const categoryRails = categories
    .map((category) => ({
      category,
      items: movies.filter((movie) => movie.categoryIds.includes(category.id)),
    }))
    .filter((rail) => rail.items.length > 0)

  return (
    <main className="app-catalog">
      <div className="app-catalog-heading">
        <h1 className="font-display text-3xl text-light sm:text-5xl">Películas y videos</h1>
        <p className="mt-3 max-w-2xl text-sm text-light/55 sm:text-base">
          Historias, documentales y vidas de santos para toda la familia.
        </p>
      </div>
      <div className="app-rails pt-0">
        {recent.length > 0 && (
          <AppRail id="recientes" title="Recientes">
            {recent.map((movie) => (
              <AppCard key={movie.id} item={movie} href={`/app-home/peliculas/${movie.id}`} kind="movie" />
            ))}
          </AppRail>
        )}
        {categoryRails.map(({ category, items }) => (
          <AppRail key={category.id} id={category.id} title={category.name}>
            {items.map((movie) => (
              <AppCard key={movie.id} item={movie} href={`/app-home/peliculas/${movie.id}`} kind="movie" />
            ))}
          </AppRail>
        ))}
        {uncategorized.length > 0 && (
          <AppRail id="otros" title="Otros">
            {uncategorized.map((movie) => (
              <AppCard key={movie.id} item={movie} href={`/app-home/peliculas/${movie.id}`} kind="movie" />
            ))}
          </AppRail>
        )}
      </div>
    </main>
  )
}
