import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { MusicCategory, CategoryFormPayload } from '@/types/app.types'

const adaptMusicCategory = (row: Record<string, unknown>): MusicCategory => ({
  id:        row.id         as string,
  name:      row.name       as string,
  sortOrder: row.sort_order as number,
  createdAt: row.created_at as string,
})

export const fetchAllMusicCategories = async (): Promise<MusicCategory[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.MUSIC_CATEGORIES)
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(adaptMusicCategory)
}

export const createMusicCategory = async (payload: CategoryFormPayload): Promise<MusicCategory> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.MUSIC_CATEGORIES)
    .insert({ name: payload.name, sort_order: payload.sortOrder })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return adaptMusicCategory(data)
}

export const updateMusicCategory = async (id: string, payload: CategoryFormPayload): Promise<MusicCategory> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.MUSIC_CATEGORIES)
    .update({ name: payload.name, sort_order: payload.sortOrder })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return adaptMusicCategory(data)
}

export const deleteMusicCategory = async (id: string): Promise<void> => {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.MUSIC_CATEGORIES)
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}
