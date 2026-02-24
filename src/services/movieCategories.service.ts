import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { MovieCategory, CategoryFormPayload } from '@/types/app.types'

const adaptMovieCategory = (row: Record<string, unknown>): MovieCategory => ({
  id:        row.id         as string,
  name:      row.name       as string,
  sortOrder: row.sort_order as number,
  createdAt: row.created_at as string,
})

export const fetchAllMovieCategories = async (): Promise<MovieCategory[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.MOVIE_CATEGORIES)
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return data?.map(adaptMovieCategory) ?? []
}

export const createMovieCategory = async (payload: CategoryFormPayload): Promise<MovieCategory> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.MOVIE_CATEGORIES)
    .insert({ name: payload.name, sort_order: payload.sortOrder })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return adaptMovieCategory(data)
}

export const updateMovieCategory = async (
  id: string,
  payload: Partial<CategoryFormPayload>
): Promise<MovieCategory> => {
  const supabase = getSupabaseBrowserClient()

  const updates: Record<string, unknown> = {}
  if (payload.name      !== undefined) updates.name       = payload.name
  if (payload.sortOrder !== undefined) updates.sort_order = payload.sortOrder

  const { data, error } = await supabase
    .from(TABLE_NAMES.MOVIE_CATEGORIES)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return adaptMovieCategory(data)
}

export const deleteMovieCategory = async (id: string): Promise<void> => {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.MOVIE_CATEGORIES)
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
