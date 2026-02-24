import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { BookCategory, CategoryFormPayload } from '@/types/app.types'

const adaptBookCategory = (row: Record<string, unknown>): BookCategory => ({
  id:        row.id         as string,
  name:      row.name       as string,
  sortOrder: row.sort_order as number,
  createdAt: row.created_at as string,
})

export const fetchAllBookCategories = async (): Promise<BookCategory[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.BOOK_CATEGORIES)
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return data?.map(adaptBookCategory) ?? []
}

export const createBookCategory = async (payload: CategoryFormPayload): Promise<BookCategory> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.BOOK_CATEGORIES)
    .insert({ name: payload.name, sort_order: payload.sortOrder })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return adaptBookCategory(data)
}

export const updateBookCategory = async (
  id: string,
  payload: Partial<CategoryFormPayload>
): Promise<BookCategory> => {
  const supabase = getSupabaseBrowserClient()

  const updates: Record<string, unknown> = {}
  if (payload.name      !== undefined) updates.name       = payload.name
  if (payload.sortOrder !== undefined) updates.sort_order = payload.sortOrder

  const { data, error } = await supabase
    .from(TABLE_NAMES.BOOK_CATEGORIES)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return adaptBookCategory(data)
}

export const deleteBookCategory = async (id: string): Promise<void> => {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.BOOK_CATEGORIES)
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
