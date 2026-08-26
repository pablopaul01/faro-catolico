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
  return <AppCatalog title="Canales recomendados" subtitle="Canales seleccionados para la familia y los niños." items={channels} kind="channel" getHref={(channel) => `/app-home/canales/${channel.id}`} />
}
