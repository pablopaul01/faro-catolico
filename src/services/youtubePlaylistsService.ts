import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { YoutubePlaylist, YoutubePlaylistFormPayload } from '@/types/app.types'

type CategoryRow = { category_id: string }

const YTPL_SELECT = `*, ${TABLE_NAMES.YOUTUBE_PLAYLIST_CATEGORY_ITEMS}(category_id)`

function adaptYoutubePlaylist(row: Record<string, unknown>): YoutubePlaylist {
  return {
    id:            row.id            as string,
    title:         row.title         as string,
    description:   row.description   as string | null,
    youtubeListId: row.youtube_list_id as string,
    thumbnailUrl:  row.thumbnail_url  as string | null,
    categoryIds:   (row[TABLE_NAMES.YOUTUBE_PLAYLIST_CATEGORY_ITEMS] as CategoryRow[] ?? []).map((r) => r.category_id),
    isPublished:   row.is_published  as boolean,
    sortOrder:     row.sort_order    as number,
    createdAt:     row.created_at    as string,
    updatedAt:     row.updated_at    as string,
  }
}

export async function fetchAllYoutubePlaylists(): Promise<YoutubePlaylist[]> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.YOUTUBE_PLAYLISTS)
    .select(YTPL_SELECT)
    .order('sort_order', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(adaptYoutubePlaylist)
}

export async function createYoutubePlaylist(payload: YoutubePlaylistFormPayload): Promise<YoutubePlaylist> {
  const supabase = getSupabaseBrowserClient()
  const { data: playlist, error } = await supabase
    .from(TABLE_NAMES.YOUTUBE_PLAYLISTS)
    .insert({
      title:           payload.title,
      description:     payload.description   || null,
      youtube_list_id: payload.youtubeListId,
      thumbnail_url:   payload.thumbnailUrl  || null,
      is_published:    payload.isPublished,
      sort_order:      payload.sortOrder,
    })
    .select(YTPL_SELECT)
    .single()
  if (error) throw new Error(error.message)

  if (payload.categoryIds.length > 0) {
    const { error: catErr } = await supabase
      .from(TABLE_NAMES.YOUTUBE_PLAYLIST_CATEGORY_ITEMS)
      .insert(payload.categoryIds.map((cid) => ({ playlist_id: playlist.id, category_id: cid })))
    if (catErr) throw new Error(catErr.message)
  }

  return adaptYoutubePlaylist(playlist as Record<string, unknown>)
}

export async function updateYoutubePlaylist(id: string, payload: YoutubePlaylistFormPayload): Promise<YoutubePlaylist> {
  const supabase = getSupabaseBrowserClient()
  const { data: playlist, error } = await supabase
    .from(TABLE_NAMES.YOUTUBE_PLAYLISTS)
    .update({
      title:           payload.title,
      description:     payload.description   || null,
      youtube_list_id: payload.youtubeListId,
      thumbnail_url:   payload.thumbnailUrl  || null,
      is_published:    payload.isPublished,
      sort_order:      payload.sortOrder,
    })
    .eq('id', id)
    .select(YTPL_SELECT)
    .single()
  if (error) throw new Error(error.message)

  const { error: delErr } = await supabase
    .from(TABLE_NAMES.YOUTUBE_PLAYLIST_CATEGORY_ITEMS)
    .delete()
    .eq('playlist_id', id)
  if (delErr) throw new Error(delErr.message)

  if (payload.categoryIds.length > 0) {
    const { error: catErr } = await supabase
      .from(TABLE_NAMES.YOUTUBE_PLAYLIST_CATEGORY_ITEMS)
      .insert(payload.categoryIds.map((cid) => ({ playlist_id: id, category_id: cid })))
    if (catErr) throw new Error(catErr.message)
  }

  return adaptYoutubePlaylist(playlist as Record<string, unknown>)
}

export async function deleteYoutubePlaylist(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from(TABLE_NAMES.YOUTUBE_PLAYLISTS).delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function toggleYoutubePlaylistPublish(id: string, current: boolean): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.YOUTUBE_PLAYLISTS)
    .update({ is_published: !current })
    .eq('id', id)
  if (error) throw new Error(error.message)
}
