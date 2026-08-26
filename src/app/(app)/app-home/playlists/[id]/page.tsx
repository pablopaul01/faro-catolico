import { notFound } from 'next/navigation'
import { fetchHomePreviewData } from '@/lib/data-cache'
import { AppSuggestionDetails } from '@/components/app/AppSuggestionDetails'

export const dynamic = 'force-dynamic'

export default async function AppPlaylistDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { youtubePlaylists: rows } = await fetchHomePreviewData()
  const row = rows.find((playlist) => playlist.id === id)
  if (!row) notFound()

  return (
    <AppSuggestionDetails
      backHref="/app-home/playlists"
      backLabel="Volver a sugeridos"
      kindLabel="Sugerido · Playlist"
      title={row.title}
      description={row.description}
      imageUrl={row.thumbnail_url}
      externalUrl={`https://www.youtube.com/playlist?list=${row.youtube_list_id}`}
      externalLabel="Abrir en YouTube"
    />
  )
}
