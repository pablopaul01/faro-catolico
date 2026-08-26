import { fetchHomePreviewData } from '@/lib/data-cache'
import { AppHome } from '@/components/app/AppHome'
import type { Book, Movie, Playlist, Song, YoutubeChannel, YoutubePlaylist } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppHomePage() {
  const data = await fetchHomePreviewData()

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

  const songs: Song[] = data.songs.map((row) => ({
    id: row.id,
    title: row.title,
    artist: row.artist,
    categoryIds: [],
    youtubeId: row.youtube_id,
    spotifyUrl: row.spotify_url,
    externalUrl: row.external_url,
    thumbnailUrl: row.thumbnail_url,
    durationSec: row.duration_sec,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))

  const youtubePlaylists: YoutubePlaylist[] = data.youtubePlaylists.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    youtubeListId: row.youtube_list_id,
    thumbnailUrl: row.thumbnail_url,
    categoryIds: [],
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))

  const youtubeChannels: YoutubeChannel[] = data.youtubeChannels.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    channelUrl: row.channel_url,
    thumbnailUrl: row.thumbnail_url,
    categoryIds: [],
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))

  const playlists: Playlist[] = data.musicPlaylists.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    spotifyUrl: row.spotify_url,
    thumbnailUrl: row.thumbnail_url,
    categoryIds: [],
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))

  return (
    <AppHome
      movies={movies}
      books={books}
      songs={songs}
      youtubePlaylists={youtubePlaylists}
      youtubeChannels={youtubeChannels}
      playlists={playlists}
    />
  )
}
