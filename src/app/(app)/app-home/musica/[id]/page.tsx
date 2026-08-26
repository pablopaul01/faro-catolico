import { notFound } from 'next/navigation'
import { fetchMusicPageData } from '@/lib/data-cache'
import { AppCatalog } from '@/components/app/AppCatalog'
import type { Song } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppSongDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { songs: rows } = await fetchMusicPageData()
  const row = rows.find((song) => song.id === id)
  if (!row) notFound()
  const song: Song = {
    id: row.id, title: row.title, artist: row.artist, categoryIds: [],
    youtubeId: row.youtube_id, spotifyUrl: row.spotify_url, externalUrl: row.external_url,
    thumbnailUrl: row.thumbnail_url, durationSec: row.duration_sec,
    isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }
  return <AppCatalog title={song.title} subtitle={song.artist} items={[song]} kind="music" getHref={() => '#'} />
}
