import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { Movie, MovieFormPayload } from '@/types/app.types'

type MovieCatRow      = { category_id: string }
type MoviePlatformRow = { platform_id: string }

const MOVIE_SELECT = `*, ${TABLE_NAMES.MOVIE_CATEGORY_ITEMS}(category_id), ${TABLE_NAMES.MOVIE_PLATFORM_ITEMS}(platform_id)`

const adaptMovie = (row: Record<string, unknown>): Movie => ({
  id:           row.id            as string,
  title:        row.title         as string,
  description:  row.description   as string | null,
  youtubeId:    row.youtube_id    as string | null,
  externalUrl:  row.external_url  as string | null,
  thumbnailUrl: row.thumbnail_url as string | null,
  year:         row.year          as number | null,
  categoryIds:  ((row.movie_category_items  as MovieCatRow[]      | null) ?? []).map((r) => r.category_id),
  platformIds:  ((row.movie_platform_items  as MoviePlatformRow[] | null) ?? []).map((r) => r.platform_id),
  isPublished:  row.is_published  as boolean,
  sortOrder:    row.sort_order    as number,
  createdAt:    row.created_at    as string,
  updatedAt:    row.updated_at    as string,
})

export const fetchAllMovies = async (): Promise<Movie[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.MOVIES)
    .select(MOVIE_SELECT)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data?.map(adaptMovie) ?? []
}

export const createMovie = async (payload: MovieFormPayload): Promise<Movie> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.MOVIES)
    .insert({
      title:         payload.title,
      description:   payload.description  || null,
      youtube_id:    payload.youtubeId    || null,
      external_url:  payload.externalUrl  || null,
      thumbnail_url: payload.thumbnailUrl || null,
      year:          payload.year         ?? null,
      is_published:  payload.isPublished,
      sort_order:    payload.sortOrder,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  const categoryIds = payload.categoryIds ?? []
  if (categoryIds.length > 0) {
    const { error: catErr } = await supabase
      .from(TABLE_NAMES.MOVIE_CATEGORY_ITEMS)
      .insert(categoryIds.map((catId) => ({ movie_id: data.id, category_id: catId })))
    if (catErr) throw new Error(catErr.message)
  }

  const platformIds = payload.platformIds ?? []
  if (platformIds.length > 0) {
    const { error: platErr } = await supabase
      .from(TABLE_NAMES.MOVIE_PLATFORM_ITEMS)
      .insert(platformIds.map((pid) => ({ movie_id: data.id, platform_id: pid })))
    if (platErr) throw new Error(platErr.message)
  }

  return adaptMovie({
    ...data,
    movie_category_items: categoryIds.map((catId) => ({ category_id: catId })),
    movie_platform_items: platformIds.map((pid)   => ({ platform_id: pid })),
  })
}

export const updateMovie = async (
  id: string,
  payload: Partial<MovieFormPayload>
): Promise<Movie> => {
  const supabase = getSupabaseBrowserClient()

  const updates: Record<string, unknown> = {}
  if (payload.title         !== undefined) updates.title         = payload.title
  if (payload.description   !== undefined) updates.description   = payload.description || null
  if (payload.youtubeId     !== undefined) updates.youtube_id    = payload.youtubeId || null
  if (payload.externalUrl   !== undefined) updates.external_url  = payload.externalUrl || null
  if (payload.thumbnailUrl  !== undefined) updates.thumbnail_url = payload.thumbnailUrl || null
  if (payload.year          !== undefined) updates.year          = payload.year ?? null
  if (payload.isPublished   !== undefined) updates.is_published  = payload.isPublished
  if (payload.sortOrder     !== undefined) updates.sort_order    = payload.sortOrder

  const { data, error } = await supabase
    .from(TABLE_NAMES.MOVIES)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (payload.categoryIds !== undefined) {
    await supabase.from(TABLE_NAMES.MOVIE_CATEGORY_ITEMS).delete().eq('movie_id', id)
    if (payload.categoryIds.length > 0) {
      const { error: catErr } = await supabase
        .from(TABLE_NAMES.MOVIE_CATEGORY_ITEMS)
        .insert(payload.categoryIds.map((catId) => ({ movie_id: id, category_id: catId })))
      if (catErr) throw new Error(catErr.message)
    }
  }

  if (payload.platformIds !== undefined) {
    await supabase.from(TABLE_NAMES.MOVIE_PLATFORM_ITEMS).delete().eq('movie_id', id)
    if (payload.platformIds.length > 0) {
      const { error: platErr } = await supabase
        .from(TABLE_NAMES.MOVIE_PLATFORM_ITEMS)
        .insert(payload.platformIds.map((pid) => ({ movie_id: id, platform_id: pid })))
      if (platErr) throw new Error(platErr.message)
    }
  }

  const { data: catData } = await supabase
    .from(TABLE_NAMES.MOVIE_CATEGORY_ITEMS)
    .select('category_id')
    .eq('movie_id', id)

  const { data: platData } = await supabase
    .from(TABLE_NAMES.MOVIE_PLATFORM_ITEMS)
    .select('platform_id')
    .eq('movie_id', id)

  return adaptMovie({
    ...data,
    movie_category_items: catData  ?? [],
    movie_platform_items: platData ?? [],
  })
}

export const deleteMovie = async (id: string): Promise<void> => {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.MOVIES)
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
