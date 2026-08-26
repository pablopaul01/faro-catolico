import { fetchMusicPageData } from '@/lib/data-cache'
import { AppCatalog } from '@/components/app/AppCatalog'
import type { Song } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppMusicPage() {
  const { songs: rows } = await fetchMusicPageData()
  const songs: Song[] = rows.map((row) => ({
    id: row.id, title: row.title, artist: row.artist, categoryIds: [],
    youtubeId: row.youtube_id, spotifyUrl: row.spotify_url, externalUrl: row.external_url,
    thumbnailUrl: row.thumbnail_url, durationSec: row.duration_sec,
    isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))
  return <AppCatalog title="Música" subtitle="Canciones para la oración, la familia y cada momento del corazón." items={songs} kind="music" getHref={(song) => `/app-home/musica/${song.id}`} />
}
