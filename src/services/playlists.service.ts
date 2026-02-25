import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { Playlist, PlaylistFormPayload } from '@/types/app.types'

type PlaylistCategoryRow = { category_id: string }

const adaptPlaylist = (row: Record<string, unknown>): Playlist => ({
  id:           row.id            as string,
  title:        row.title         as string,
  description:  row.description   as string | null,
  spotifyUrl:   row.spotify_url   as string,
  thumbnailUrl: row.thumbnail_url as string | null,
  categoryIds:  ((row.playlist_category_items as PlaylistCategoryRow[] | null) ?? []).map((r) => r.category_id),
  isPublished:  row.is_published  as boolean,
  sortOrder:    row.sort_order    as number,
  createdAt:    row.created_at    as string,
  updatedAt:    row.updated_at    as string,
})

const PLAYLIST_SELECT = `*, ${TABLE_NAMES.PLAYLIST_CATEGORY_ITEMS}(category_id)`

export const fetchAllPlaylists = async (): Promise<Playlist[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.PLAYLISTS)
    .select(PLAYLIST_SELECT)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data?.map(adaptPlaylist) ?? []
}

export const createPlaylist = async (payload: PlaylistFormPayload): Promise<Playlist> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.PLAYLISTS)
    .insert({
      title:         payload.title,
      description:   payload.description   || null,
      spotify_url:   payload.spotifyUrl,
      thumbnail_url: payload.thumbnailUrl  || null,
      is_published:  payload.isPublished,
      sort_order:    payload.sortOrder,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  const categoryIds = payload.categoryIds ?? []
  if (categoryIds.length > 0) {
    const { error: catErr } = await supabase
      .from(TABLE_NAMES.PLAYLIST_CATEGORY_ITEMS)
      .insert(categoryIds.map((catId) => ({ playlist_id: data.id, category_id: catId })))
    if (catErr) throw new Error(catErr.message)
  }

  return adaptPlaylist({
    ...data,
    playlist_category_items: categoryIds.map((catId) => ({ category_id: catId })),
  })
}

export const updatePlaylist = async (
  id: string,
  payload: Partial<PlaylistFormPayload>
): Promise<Playlist> => {
  const supabase = getSupabaseBrowserClient()

  const updates: Record<string, unknown> = {}
  if (payload.title        !== undefined) updates.title         = payload.title
  if (payload.description  !== undefined) updates.description   = payload.description  || null
  if (payload.spotifyUrl   !== undefined) updates.spotify_url   = payload.spotifyUrl
  if (payload.thumbnailUrl !== undefined) updates.thumbnail_url = payload.thumbnailUrl || null
  if (payload.isPublished  !== undefined) updates.is_published  = payload.isPublished
  if (payload.sortOrder    !== undefined) updates.sort_order    = payload.sortOrder

  const { data, error } = await supabase
    .from(TABLE_NAMES.PLAYLISTS)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (payload.categoryIds !== undefined) {
    await supabase.from(TABLE_NAMES.PLAYLIST_CATEGORY_ITEMS).delete().eq('playlist_id', id)
    if (payload.categoryIds.length > 0) {
      const { error: catErr } = await supabase
        .from(TABLE_NAMES.PLAYLIST_CATEGORY_ITEMS)
        .insert(payload.categoryIds.map((catId) => ({ playlist_id: id, category_id: catId })))
      if (catErr) throw new Error(catErr.message)
    }
  }

  const { data: catData } = await supabase
    .from(TABLE_NAMES.PLAYLIST_CATEGORY_ITEMS)
    .select('category_id')
    .eq('playlist_id', id)

  return adaptPlaylist({ ...data, playlist_category_items: catData ?? [] })
}

export const deletePlaylist = async (id: string): Promise<void> => {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.PLAYLISTS)
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export const togglePlaylistPublish = async (id: string, current: boolean): Promise<Playlist> => {
  return updatePlaylist(id, { isPublished: !current })
}
