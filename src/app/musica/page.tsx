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

  const [{ data: songsData }, { data: catsData }, ratingsMap] = await Promise.all([
    supabase
      .from(TABLE_NAMES.SONGS)
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    supabase
      .from(TABLE_NAMES.MUSIC_CATEGORIES)
      .select('*')
      .order('sort_order', { ascending: true }),
    fetchRatingsForContent('cancion'),
  ])

  const songs: Song[] = (songsData ?? []).map((row) => ({
    id:           row.id,
    title:        row.title,
    artist:       row.artist,
    categoryId:   row.category_id,
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

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <SectionHeader
        title="Música"
        subtitle="Canciones para cada momento del día y del corazón"
      />
      <MusicSection songs={songs} categories={categories} ratingsMap={ratingsMap} />
    </main>
  )
}
