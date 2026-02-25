import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { Song, SongFormPayload } from '@/types/app.types'

type SongCategoryRow = { category_id: string }

const adaptSong = (row: Record<string, unknown>): Song => ({
  id:           row.id            as string,
  title:        row.title         as string,
  artist:       row.artist        as string,
  categoryIds:  ((row.song_categories as SongCategoryRow[] | null) ?? []).map((r) => r.category_id),
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

const SONG_SELECT = `*, ${TABLE_NAMES.SONG_CATEGORIES}(category_id)`

export const fetchAllSongs = async (): Promise<Song[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.SONGS)
    .select(SONG_SELECT)
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

  const categoryIds = payload.categoryIds ?? []
  if (categoryIds.length > 0) {
    const { error: catErr } = await supabase
      .from(TABLE_NAMES.SONG_CATEGORIES)
      .insert(categoryIds.map((catId) => ({ song_id: data.id, category_id: catId })))
    if (catErr) throw new Error(catErr.message)
  }

  return adaptSong({
    ...data,
    song_categories: categoryIds.map((catId) => ({ category_id: catId })),
  })
}

export const updateSong = async (
  id: string,
  payload: Partial<SongFormPayload>
): Promise<Song> => {
  const supabase = getSupabaseBrowserClient()

  const updates: Record<string, unknown> = {}
  if (payload.title        !== undefined) updates.title         = payload.title
  if (payload.artist       !== undefined) updates.artist        = payload.artist
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

  if (payload.categoryIds !== undefined) {
    await supabase.from(TABLE_NAMES.SONG_CATEGORIES).delete().eq('song_id', id)
    if (payload.categoryIds.length > 0) {
      const { error: catErr } = await supabase
        .from(TABLE_NAMES.SONG_CATEGORIES)
        .insert(payload.categoryIds.map((catId) => ({ song_id: id, category_id: catId })))
      if (catErr) throw new Error(catErr.message)
    }
  }

  const { data: catData } = await supabase
    .from(TABLE_NAMES.SONG_CATEGORIES)
    .select('category_id')
    .eq('song_id', id)

  return adaptSong({ ...data, song_categories: catData ?? [] })
}

export const deleteSong = async (id: string): Promise<void> => {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.SONGS)
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
