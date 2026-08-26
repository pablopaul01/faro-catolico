import { fetchHomePreviewData } from '@/lib/data-cache'
import { AppCatalog } from '@/components/app/AppCatalog'
import type { YoutubePlaylist } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppPlaylistsPage() {
  const { youtubePlaylists: rows } = await fetchHomePreviewData()
  const playlists: YoutubePlaylist[] = rows.map((row) => ({
    id: row.id, title: row.title, description: row.description,
    youtubeListId: row.youtube_list_id, thumbnailUrl: row.thumbnail_url,
    categoryIds: [], isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))
  return <AppCatalog title="Playlists sugeridas" subtitle="Colecciones de YouTube recomendadas. Se abren fuera del reproductor de la app." backHref="/app-home/sugeridos" items={playlists} kind="playlist" getHref={(playlist) => `/app-home/playlists/${playlist.id}`} />
}
