import { createSupabaseServerClient } from '@/lib/supabase/server'
import { fetchRatingsForContent } from '@/services/ratings.server'
import { fetchSettingsServer } from '@/services/settings.server'
import { TABLE_NAMES, SITE_NAME } from '@/lib/constants'
import { MoviesPageTabs } from '@/components/public/movies/MoviesPageTabs'
import { SectionHeader } from '@/components/public/SectionHeader'
import { SettingsInitializer } from '@/components/SettingsInitializer'
import type { Metadata } from 'next'
import type { Movie, MovieCategory, MoviePlatform, YoutubePlaylist, YoutubeChannel } from '@/types/app.types'

export const metadata: Metadata = {
  title:       `Películas recomendadas — ${SITE_NAME}`,
  description: 'Películas católicas y aptas para la familia: vidas de santos, documentales de fe y films de valores.',
}

export default async function PeliculasPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams
  const supabase = await createSupabaseServerClient()

  const [settings, moviesRes, catsRes, platsRes, ratingsMap, ytPlRes, ytChRes] = await Promise.all([
    fetchSettingsServer(),
    supabase
      .from(TABLE_NAMES.MOVIES)
      .select(`*, ${TABLE_NAMES.MOVIE_CATEGORY_ITEMS}(category_id), ${TABLE_NAMES.MOVIE_PLATFORM_ITEMS}(platform_id)`)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    supabase
      .from(TABLE_NAMES.MOVIE_CATEGORIES)
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from(TABLE_NAMES.MOVIE_PLATFORMS)
      .select('*')
      .order('sort_order', { ascending: true }),
    fetchRatingsForContent('pelicula'),
    supabase
      .from(TABLE_NAMES.YOUTUBE_PLAYLISTS)
      .select(`*, ${TABLE_NAMES.YOUTUBE_PLAYLIST_CATEGORY_ITEMS}(category_id)`)
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from(TABLE_NAMES.YOUTUBE_CHANNELS)
      .select(`*, ${TABLE_NAMES.YOUTUBE_CHANNEL_CATEGORY_ITEMS}(category_id)`)
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
  ])

  const movies: Movie[] = (moviesRes.data ?? []).map((row) => ({
    id:             row.id,
    title:          row.title,
    description:    row.description,
    youtubeId:      row.youtube_id,
    dailymotionId:  row.dailymotion_id,
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

  const categories: MovieCategory[] = (catsRes.data ?? []).map((row) => ({
    id:        row.id,
    name:      row.name,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }))

  const platformsMap: Record<string, MoviePlatform> = {}
  for (const row of platsRes.data ?? []) {
    platformsMap[row.id] = { id: row.id, name: row.name, sortOrder: row.sort_order, createdAt: row.created_at }
  }

  const youtubePlaylists: YoutubePlaylist[] = (ytPlRes.data ?? []).map((row) => ({
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

  const youtubeChannels: YoutubeChannel[] = (ytChRes.data ?? []).map((row) => ({
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
        title="Películas"
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
