import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { Suggestion } from '@/types/app.types'

function adaptSuggestion(row: Record<string, unknown>): Suggestion {
  return {
    id:        row.id        as string,
    type:      row.type      as Suggestion['type'],
    title:     row.title     as string,
    notes:     row.notes     as string | null,
    email:     row.email     as string | null,
    status:    row.status    as Suggestion['status'],
    createdAt: row.created_at as string,
  }
}

export async function createSuggestion(payload: {
  type:   'pelicula' | 'libro' | 'cancion'
  title:  string
  notes?: string
  email?: string
}): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from(TABLE_NAMES.SUGGESTIONS).insert({
    type:  payload.type,
    title: payload.title,
    notes: payload.notes || null,
    email: payload.email || null,
  })
  if (error) throw new Error(error.message)
}

export async function fetchAllSuggestions(): Promise<Suggestion[]> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.SUGGESTIONS)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(adaptSuggestion)
}

export async function markSuggestionReviewed(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.SUGGESTIONS)
    .update({ status: 'revisado' })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteSuggestion(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.SUGGESTIONS)
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}
