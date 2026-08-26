import { notFound } from 'next/navigation'
import { fetchHomePreviewData } from '@/lib/data-cache'
import { AppCatalog } from '@/components/app/AppCatalog'
import type { YoutubeChannel } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppChannelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { youtubeChannels: rows } = await fetchHomePreviewData()
  const row = rows.find((channel) => channel.id === id)
  if (!row) notFound()
  const channel: YoutubeChannel = {
    id: row.id, name: row.name, description: row.description,
    channelUrl: row.channel_url, thumbnailUrl: row.thumbnail_url,
    categoryIds: [], isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }
  return <AppCatalog title={channel.name} subtitle={channel.description ?? 'Canal recomendado.'} items={[channel]} kind="channel" getHref={() => channel.channelUrl} />
}
