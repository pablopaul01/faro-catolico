import { fetchHomePreviewData } from '@/lib/data-cache'
import { AppCatalog } from '@/components/app/AppCatalog'
import type { YoutubeChannel } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppChannelsPage() {
  const { youtubeChannels: rows } = await fetchHomePreviewData()
  const channels: YoutubeChannel[] = rows.map((row) => ({
    id: row.id, name: row.name, description: row.description,
    channelUrl: row.channel_url, thumbnailUrl: row.thumbnail_url,
    categoryIds: [], isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))
  return <AppCatalog title="Canales sugeridos" subtitle="Canales de YouTube recomendados. Se abren fuera del reproductor de la app." backHref="/app-home/sugeridos" items={channels} kind="channel" getHref={(channel) => `/app-home/canales/${channel.id}`} />
}
