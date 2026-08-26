import { fetchHomePreviewData } from '@/lib/data-cache'
import { AppCatalog } from '@/components/app/AppCatalog'
import { AppRail, AppCard } from '@/components/app/AppHome'
import type { YoutubeChannel, YoutubePlaylist } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppSuggestedPage() {
  const data = await fetchHomePreviewData()

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

  if (youtubePlaylists.length === 0 && youtubeChannels.length === 0) {
    return (
      <AppCatalog
        title="Sugeridos"
        subtitle="Todavía no hay playlists ni canales recomendados."
        items={[]}
        kind="playlist"
        getHref={() => '/app-home/sugeridos'}
      />
    )
  }

  return (
    <main className="app-catalog">
      <div className="app-catalog-heading">
        <h1 className="font-display text-3xl text-light sm:text-5xl">Sugeridos</h1>
        <p className="mt-3 max-w-2xl text-sm text-light/55 sm:text-base">
          Playlists y canales de YouTube recomendados. Se abren fuera del reproductor de la app.
        </p>
      </div>
      <div className="app-rails pt-0">
        {youtubePlaylists.length > 0 && (
          <AppRail id="playlists" title="Playlists de YouTube" href="/app-home/playlists">
            {youtubePlaylists.map((playlist) => (
              <AppCard key={playlist.id} item={playlist} href={`/app-home/playlists/${playlist.id}`} kind="playlist" />
            ))}
          </AppRail>
        )}
        {youtubeChannels.length > 0 && (
          <AppRail id="canales" title="Canales de YouTube" href="/app-home/canales">
            {youtubeChannels.map((channel) => (
              <AppCard key={channel.id} item={channel} href={`/app-home/canales/${channel.id}`} kind="channel" />
            ))}
          </AppRail>
        )}
      </div>
    </main>
  )
}
