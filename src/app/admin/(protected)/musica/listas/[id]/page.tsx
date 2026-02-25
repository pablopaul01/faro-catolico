import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { PlaylistForm } from '@/components/admin/music/PlaylistForm'
import type { Playlist, MusicCategory } from '@/types/app.types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPlaylistPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const [playlistRes, catsRes] = await Promise.all([
    supabase
      .from(TABLE_NAMES.PLAYLISTS)
      .select(`*, ${TABLE_NAMES.PLAYLIST_CATEGORY_ITEMS}(category_id)`)
      .eq('id', id)
      .single(),
    supabase.from(TABLE_NAMES.MUSIC_CATEGORIES).select('*').order('sort_order', { ascending: true }),
  ])

  if (playlistRes.error || !playlistRes.data) notFound()

  const data = playlistRes.data
  const playlist: Playlist = {
    id:           data.id,
    title:        data.title,
    description:  data.description,
    spotifyUrl:   data.spotify_url,
    thumbnailUrl: data.thumbnail_url,
    categoryIds:  (data.playlist_category_items as { category_id: string }[] ?? []).map((r) => r.category_id),
    isPublished:  data.is_published,
    sortOrder:    data.sort_order,
    createdAt:    data.created_at,
    updatedAt:    data.updated_at,
  }

  const categories: MusicCategory[] = (catsRes.data ?? []).map((r) => ({
    id: r.id, name: r.name, sortOrder: r.sort_order, createdAt: r.created_at,
  }))

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Editar playlist</h1>
      <p className="text-light/50 text-sm mb-8">{playlist.title}</p>
      <PlaylistForm playlist={playlist} categories={categories} />
    </div>
  )
}
