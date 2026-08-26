import { notFound } from 'next/navigation'
import { fetchHomePreviewData } from '@/lib/data-cache'
import { AppSuggestionDetails } from '@/components/app/AppSuggestionDetails'

export const dynamic = 'force-dynamic'

export default async function AppChannelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { youtubeChannels: rows } = await fetchHomePreviewData()
  const row = rows.find((channel) => channel.id === id)
  if (!row) notFound()

  return (
    <AppSuggestionDetails
      backHref="/app-home/sugeridos"
      backLabel="Volver a sugeridos"
      kindLabel="Sugerido · Canal"
      title={row.name}
      description={row.description}
      imageUrl={row.thumbnail_url}
      externalUrl={row.channel_url}
      externalLabel="Abrir en YouTube"
    />
  )
}
