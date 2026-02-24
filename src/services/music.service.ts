import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { Song, SongFormPayload } from '@/types/app.types'

const adaptSong = (row: Record<string, unknown>): Song => ({
  id:           row.id            as string,
  title:        row.title         as string,
  artist:       row.artist        as string,
  categoryId:   row.category_id   as string | null,
  youtubeId:    row.youtube_id    as string | null,
  spotifyUrl:   row.spotify_url   as string | null,
  externalUrl:  row.external_url  as string | null,
  thumbnailUrl: row.thumbnail_url as string | null,
  durationSec:  row.duration_sec  as number | null,
  isPublished:  row.is_published  as boolean,
  sortOrder:    row.sort_order    as number,
  createdAt:    row.created_at    as string,
  updatedAt:    row.updated_at    as string,
})

export const fetchAllSongs = async (): Promise<Song[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.SONGS)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data?.map(adaptSong) ?? []
}

export const createSong = async (payload: SongFormPayload): Promise<Song> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.SONGS)
    .insert({
      title:         payload.title,
      artist:        payload.artist,
      category_id:   payload.categoryId ?? null,
      youtube_id:    payload.youtubeId    || null,
      spotify_url:   payload.spotifyUrl   || null,
      external_url:  payload.externalUrl  || null,
      thumbnail_url: payload.thumbnailUrl || null,
      duration_sec:  payload.durationSec  ?? null,
      is_published:  payload.isPublished,
      sort_order:    payload.sortOrder,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return adaptSong(data)
}

export const updateSong = async (
  id: string,
  payload: Partial<SongFormPayload>
): Promise<Song> => {
  const supabase = getSupabaseBrowserClient()

  const updates: Record<string, unknown> = {}
  if (payload.title        !== undefined) updates.title         = payload.title
  if (payload.artist       !== undefined) updates.artist        = payload.artist
  if (payload.categoryId   !== undefined) updates.category_id   = payload.categoryId ?? null
  if (payload.youtubeId    !== undefined) updates.youtube_id    = payload.youtubeId    || null
  if (payload.spotifyUrl   !== undefined) updates.spotify_url   = payload.spotifyUrl   || null
  if (payload.externalUrl  !== undefined) updates.external_url  = payload.externalUrl  || null
  if (payload.thumbnailUrl !== undefined) updates.thumbnail_url = payload.thumbnailUrl || null
  if (payload.durationSec  !== undefined) updates.duration_sec  = payload.durationSec  ?? null
  if (payload.isPublished  !== undefined) updates.is_published  = payload.isPublished
  if (payload.sortOrder    !== undefined) updates.sort_order    = payload.sortOrder

  const { data, error } = await supabase
    .from(TABLE_NAMES.SONGS)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return adaptSong(data)
}

export const deleteSong = async (id: string): Promise<void> => {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.SONGS)
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
