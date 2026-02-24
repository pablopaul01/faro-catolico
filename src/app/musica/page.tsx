import { createSupabaseServerClient } from '@/lib/supabase/server'
import { fetchRatingsForContent } from '@/services/ratings.server'
import { TABLE_NAMES, SITE_NAME } from '@/lib/constants'
import { MusicSection } from '@/components/public/music/MusicSection'
import { SectionHeader } from '@/components/public/SectionHeader'
import type { Metadata } from 'next'
import type { Song, MusicCategory } from '@/types/app.types'

export const metadata: Metadata = {
  title:       `Música católica — ${SITE_NAME}`,
  description: 'Canciones católicas organizadas por momento: oración, estudio, reunión y fiesta. Música para crecer en la fe.',
}

export default async function MusicaPage() {
  const supabase = await createSupabaseServerClient()

  const [{ data }, ratingsMap] = await Promise.all([
    supabase
      .from(TABLE_NAMES.SONGS)
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
    fetchRatingsForContent('cancion'),
  ])

  const songs: Song[] = (data ?? []).map((row) => ({
    id:           row.id,
    title:        row.title,
    artist:       row.artist,
    category:     row.category as MusicCategory,
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

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <SectionHeader
        title="Música"
        subtitle="Canciones para cada momento del día y del corazón"
      />
      <MusicSection songs={songs} ratingsMap={ratingsMap} />
    </main>
  )
}
