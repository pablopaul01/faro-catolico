import { fetchMoviesPageData, fetchSettingsPublic, fetchRatingsPublic } from '@/lib/data-cache'
import { SITE_NAME } from '@/lib/constants'
import { MoviesPageTabs } from '@/components/public/movies/MoviesPageTabs'
import { SectionHeader } from '@/components/public/SectionHeader'
import { SettingsInitializer } from '@/components/SettingsInitializer'
import type { Metadata } from 'next'
import type { Movie, MovieCategory, MoviePlatform, YoutubePlaylist, YoutubeChannel } from '@/types/app.types'

export const metadata: Metadata = {
  title:       `Videos y Películas — ${SITE_NAME}`,
  description: 'Videos, películas y canales católicos para toda la familia: vidas de santos, documentales de fe, playlists de YouTube y más.',
}

export default async function PeliculasPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams

  const [{ movies: moviesRaw, categories: catsRaw, platforms: platsRaw, youtubePlaylists: ytPlRaw, youtubeChannels: ytChRaw },
         settings, ratingsMap] = await Promise.all([
    fetchMoviesPageData(),
    fetchSettingsPublic(),
    fetchRatingsPublic('pelicula'),
  ])

  const movies: Movie[] = moviesRaw.map((row) => ({
    id:             row.id,
    title:          row.title,
    description:    row.description,
    youtubeId:      row.youtube_id,
    dailymotionId:  row.dailymotion_id,
    okId:           row.ok_id,
    vimeoId:        row.vimeo_id,
    externalUrl:    row.external_url,
    thumbnailUrl:   row.thumbnail_url,
    year:           row.year,
    categoryIds:    (row.movie_category_items as { category_id: string }[] ?? []).map((r) => r.category_id),
    platformIds:    (row.movie_platform_items as { platform_id: string }[] ?? []).map((r) => r.platform_id),
    isPublished:    row.is_published,
    sortOrder:      row.sort_order,
    createdAt:      row.created_at,
    updatedAt:      row.updated_at,
  }))

  const categories: MovieCategory[] = catsRaw.map((row) => ({
    id:        row.id,
    name:      row.name,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }))

  const platformsMap: Record<string, MoviePlatform> = {}
  for (const row of platsRaw) {
    platformsMap[row.id] = { id: row.id, name: row.name, sortOrder: row.sort_order, createdAt: row.created_at }
  }

  const youtubePlaylists: YoutubePlaylist[] = ytPlRaw.map((row) => ({
    id:            row.id,
    title:         row.title,
    description:   row.description,
    youtubeListId: row.youtube_list_id,
    thumbnailUrl:  row.thumbnail_url,
    categoryIds:   (row.youtube_playlist_category_items as { category_id: string }[] ?? []).map((r) => r.category_id),
    isPublished:   row.is_published,
    sortOrder:     row.sort_order,
    createdAt:     row.created_at,
    updatedAt:     row.updated_at,
  }))

  const youtubeChannels: YoutubeChannel[] = ytChRaw.map((row) => ({
    id:           row.id,
    name:         row.name,
    description:  row.description,
    channelUrl:   row.channel_url,
    thumbnailUrl: row.thumbnail_url,
    categoryIds:  (row.youtube_channel_category_items as { category_id: string }[] ?? []).map((r) => r.category_id),
    isPublished:  row.is_published,
    sortOrder:    row.sort_order,
    createdAt:    row.created_at,
    updatedAt:    row.updated_at,
  }))

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-24">
      <SettingsInitializer copyrightMode={settings.copyrightMode} />
      <SectionHeader
        title="Videos y Películas"
        subtitle="Vidas de santos, documentales, playlists y canales para toda la familia"
      />
      <MoviesPageTabs
        movies={movies}
        youtubePlaylists={youtubePlaylists}
        youtubeChannels={youtubeChannels}
        categories={categories}
        ratingsMap={ratingsMap}
        platformsMap={platformsMap}
        defaultTab={tab}
      />
    </main>
  )
}
