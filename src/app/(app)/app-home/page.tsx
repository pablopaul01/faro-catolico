import { fetchHomePreviewData, fetchFeaturedMovies } from '@/lib/data-cache'
import { AppHome } from '@/components/app/AppHome'
import type { Book, Movie } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppHomePage() {
  const [data, featuredMovies] = await Promise.all([
    fetchHomePreviewData(),
    fetchFeaturedMovies(),
  ])

  const movies: Movie[] = data.movies.map((row) => ({
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
    categoryIds: [],
    platformIds: (row.movie_platform_items as { platform_id: string }[] ?? []).map((item) => item.platform_id),
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    isFeatured: row.is_featured ?? false,
    heroOrder: row.hero_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))

  const books: Book[] = data.books.map((row) => ({
    id: row.id,
    title: row.title,
    author: row.author,
    description: row.description,
    coverUrl: row.cover_url,
    purchaseUrl: row.purchase_url,
    pdfUrl: row.pdf_url,
    year: row.year,
    categoryIds: [],
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))

  return <AppHome movies={movies} books={books} featuredMovies={featuredMovies} />
}
