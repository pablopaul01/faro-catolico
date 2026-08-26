import { notFound } from 'next/navigation'
import { fetchHomePreviewData } from '@/lib/data-cache'
import { AppCatalog } from '@/components/app/AppCatalog'
import type { YoutubePlaylist } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppPlaylistDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { youtubePlaylists: rows } = await fetchHomePreviewData()
  const row = rows.find((playlist) => playlist.id === id)
  if (!row) notFound()
  const playlist: YoutubePlaylist = {
    id: row.id, title: row.title, description: row.description,
    youtubeListId: row.youtube_list_id, thumbnailUrl: row.thumbnail_url,
    categoryIds: [], isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }
  return <AppCatalog title={playlist.title} subtitle={playlist.description ?? 'Playlist de videos seleccionados.'} items={[playlist]} kind="playlist" getHref={() => `https://www.youtube.com/playlist?list=${playlist.youtubeListId}`} />
}
