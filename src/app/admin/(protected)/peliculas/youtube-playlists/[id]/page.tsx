import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { YoutubePlaylistForm } from '@/components/admin/movies/YoutubePlaylistForm'
import type { YoutubePlaylist, MovieCategory } from '@/types/app.types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditYoutubePlaylistPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const [playlistRes, catsRes] = await Promise.all([
    supabase
      .from(TABLE_NAMES.YOUTUBE_PLAYLISTS)
      .select(`*, ${TABLE_NAMES.YOUTUBE_PLAYLIST_CATEGORY_ITEMS}(category_id)`)
      .eq('id', id)
      .single(),
    supabase.from(TABLE_NAMES.MOVIE_CATEGORIES).select('*').order('sort_order', { ascending: true }),
  ])

  if (playlistRes.error || !playlistRes.data) notFound()

  const row = playlistRes.data
  const playlist: YoutubePlaylist = {
    id:            row.id,
    title:         row.title,
    description:   row.description,
    youtubeListId: row.youtube_list_id,
    thumbnailUrl:  row.thumbnail_url,
    categoryIds:   (row.youtube_playlist_category_items as { category_id: string }[] ?? []).map((r) => r.category_id),
    isPublished:   row.is_published,
    sortOrder:     row.sort_order,
    createdAt:     row.created_at,
    updatedAt:     row.updated_at,
  }

  const categories: MovieCategory[] = (catsRes.data ?? []).map((r) => ({
    id: r.id, name: r.name, sortOrder: r.sort_order, createdAt: r.created_at,
  }))

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Editar playlist</h1>
      <p className="text-light/50 text-sm mb-8">{playlist.title}</p>
      <YoutubePlaylistForm playlist={playlist} categories={categories} />
    </div>
  )
}
