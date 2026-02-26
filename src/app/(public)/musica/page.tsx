import { createSupabaseServerClient } from '@/lib/supabase/server'
import { fetchRatingsForContent } from '@/services/ratings.server'
import { fetchSettingsServer } from '@/services/settings.server'
import { TABLE_NAMES, SITE_NAME } from '@/lib/constants'
import { MusicPageTabs } from '@/components/public/music/MusicPageTabs'
import { SectionHeader } from '@/components/public/SectionHeader'
import { SettingsInitializer } from '@/components/SettingsInitializer'
import type { Metadata } from 'next'
import type { Song, MusicCategory, Playlist } from '@/types/app.types'

export const metadata: Metadata = {
  title:       `Música católica — ${SITE_NAME}`,
  description: 'Canciones católicas organizadas por momento: oración, estudio, reunión y fiesta. Música para crecer en la fe.',
}

export default async function MusicaPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams
  const supabase = await createSupabaseServerClient()

  const [settings, { data: songsData }, { data: catsData }, { data: playlistsData }, ratingsMap] = await Promise.all([
    fetchSettingsServer(),
    supabase
      .from(TABLE_NAMES.SONGS)
      .select(`*, ${TABLE_NAMES.SONG_CATEGORIES}(category_id)`)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    supabase
      .from(TABLE_NAMES.MUSIC_CATEGORIES)
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from(TABLE_NAMES.PLAYLISTS)
      .select(`*, ${TABLE_NAMES.PLAYLIST_CATEGORY_ITEMS}(category_id)`)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    fetchRatingsForContent('cancion'),
  ])

  const songs: Song[] = (songsData ?? []).map((row) => ({
    id:           row.id,
    title:        row.title,
    artist:       row.artist,
    categoryIds:  (row.song_categories as { category_id: string }[] ?? []).map((r) => r.category_id),
    youtubeId:    row.youtube_id,
    spotifyUrl:   row.spotify_url,
    externalUrl:  row.external_url,
    thumbnailUrl: row.thumbnail_url,
    durationSec:  row.duration_sec,
    isPublished:  row.is_published,
    sortOrder:    row.sort_order,
    createdAt:    row.created_at,
    updatedAt:    row.updated_at,
  }))

  const categories: MusicCategory[] = (catsData ?? []).map((row) => ({
    id:        row.id,
    name:      row.name,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }))

  const playlists: Playlist[] = (playlistsData ?? []).map((row) => ({
    id:           row.id,
    title:        row.title,
    description:  row.description,
    spotifyUrl:   row.spotify_url,
    thumbnailUrl: row.thumbnail_url,
    categoryIds:  (row.playlist_category_items as { category_id: string }[] ?? []).map((r) => r.category_id),
    isPublished:  row.is_published,
    sortOrder:    row.sort_order,
    createdAt:    row.created_at,
    updatedAt:    row.updated_at,
  }))

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-24">
      <SettingsInitializer copyrightMode={settings.copyrightMode} />
      <SectionHeader
        title="Música"
        subtitle="Canciones y playlists para cada momento del día y del corazón"
      />
      <MusicPageTabs songs={songs} playlists={playlists} categories={categories} ratingsMap={ratingsMap} defaultTab={tab} />
    </main>
  )
}
