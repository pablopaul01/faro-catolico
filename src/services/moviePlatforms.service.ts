import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { MoviePlatform, CategoryFormPayload } from '@/types/app.types'

const adaptMoviePlatform = (row: Record<string, unknown>): MoviePlatform => ({
  id:        row.id         as string,
  name:      row.name       as string,
  sortOrder: row.sort_order as number,
  createdAt: row.created_at as string,
})

export const fetchAllMoviePlatforms = async (): Promise<MoviePlatform[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.MOVIE_PLATFORMS)
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return data?.map(adaptMoviePlatform) ?? []
}

export const createMoviePlatform = async (payload: CategoryFormPayload): Promise<MoviePlatform> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.MOVIE_PLATFORMS)
    .insert({ name: payload.name, sort_order: payload.sortOrder })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return adaptMoviePlatform(data)
}

export const updateMoviePlatform = async (
  id: string,
  payload: Partial<CategoryFormPayload>
): Promise<MoviePlatform> => {
  const supabase = getSupabaseBrowserClient()

  const updates: Record<string, unknown> = {}
  if (payload.name      !== undefined) updates.name       = payload.name
  if (payload.sortOrder !== undefined) updates.sort_order = payload.sortOrder

  const { data, error } = await supabase
    .from(TABLE_NAMES.MOVIE_PLATFORMS)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return adaptMoviePlatform(data)
}

export const deleteMoviePlatform = async (id: string): Promise<void> => {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.MOVIE_PLATFORMS)
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
