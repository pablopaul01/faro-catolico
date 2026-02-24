import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { Movie, MovieFormPayload } from '@/types/app.types'

// ─────────────────────────────────────────────
// Adaptador: fila DB (snake_case) → tipo de dominio (camelCase)
// ─────────────────────────────────────────────
const adaptMovie = (row: Record<string, unknown>): Movie => ({
  id:           row.id            as string,
  title:        row.title         as string,
  description:  row.description   as string | null,
  youtubeId:    row.youtube_id    as string,
  externalUrl:  row.external_url  as string | null,
  thumbnailUrl: row.thumbnail_url as string | null,
  year:         row.year          as number | null,
  categoryId:   row.category_id   as string | null,
  isPublished:  row.is_published  as boolean,
  sortOrder:    row.sort_order    as number,
  createdAt:    row.created_at    as string,
  updatedAt:    row.updated_at    as string,
})

// ─────────────────────────────────────────────
// Operaciones CRUD
// ─────────────────────────────────────────────

/** Obtiene todas las películas (para admin — incluye no publicadas) */
export const fetchAllMovies = async (): Promise<Movie[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.MOVIES)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data?.map(adaptMovie) ?? []
}

/** Crea una nueva película */
export const createMovie = async (payload: MovieFormPayload): Promise<Movie> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.MOVIES)
    .insert({
      title:         payload.title,
      description:   payload.description  || null,
      youtube_id:    payload.youtubeId,
      external_url:  payload.externalUrl  || null,
      thumbnail_url: payload.thumbnailUrl || null,
      year:          payload.year         ?? null,
      category_id:   payload.categoryId   ?? null,
      is_published:  payload.isPublished,
      sort_order:    payload.sortOrder,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return adaptMovie(data)
}

/** Actualiza una película existente */
export const updateMovie = async (
  id: string,
  payload: Partial<MovieFormPayload>
): Promise<Movie> => {
  const supabase = getSupabaseBrowserClient()

  const updates: Record<string, unknown> = {}
  if (payload.title         !== undefined) updates.title         = payload.title
  if (payload.description   !== undefined) updates.description   = payload.description || null
  if (payload.youtubeId     !== undefined) updates.youtube_id    = payload.youtubeId
  if (payload.externalUrl   !== undefined) updates.external_url  = payload.externalUrl || null
  if (payload.thumbnailUrl  !== undefined) updates.thumbnail_url = payload.thumbnailUrl || null
  if (payload.year          !== undefined) updates.year          = payload.year ?? null
  if (payload.categoryId    !== undefined) updates.category_id   = payload.categoryId ?? null
  if (payload.isPublished   !== undefined) updates.is_published  = payload.isPublished
  if (payload.sortOrder     !== undefined) updates.sort_order    = payload.sortOrder

  const { data, error } = await supabase
    .from(TABLE_NAMES.MOVIES)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return adaptMovie(data)
}

/** Elimina una película por ID */
export const deleteMovie = async (id: string): Promise<void> => {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.MOVIES)
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
