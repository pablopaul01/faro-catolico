import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { SongForm } from '@/components/admin/music/SongForm'
import type { Song, MusicCategory } from '@/types/app.types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditSongPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from(TABLE_NAMES.SONGS)
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  const song: Song = {
    id:           data.id,
    title:        data.title,
    artist:       data.artist,
    category:     data.category as MusicCategory,
    youtubeId:    data.youtube_id,
    spotifyUrl:   data.spotify_url,
    externalUrl:  data.external_url,
    thumbnailUrl: data.thumbnail_url,
    durationSec:  data.duration_sec,
    isPublished:  data.is_published,
    sortOrder:    data.sort_order,
    createdAt:    data.created_at,
    updatedAt:    data.updated_at,
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Editar canción</h1>
      <p className="text-light/50 text-sm mb-8">{song.title} — {song.artist}</p>
      <SongForm song={song} />
    </div>
  )
}
