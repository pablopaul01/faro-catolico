import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { ContactMessage } from '@/types/app.types'

function adaptContactMessage(row: Record<string, unknown>): ContactMessage {
  return {
    id:        row.id        as string,
    name:      row.name      as string | null,
    email:     row.email     as string | null,
    subject:   row.subject   as string | null,
    message:   row.message   as string,
    status:    row.status    as ContactMessage['status'],
    createdAt: row.created_at as string,
  }
}

export async function createContactMessage(payload: {
  name?:    string
  email?:   string
  subject?: string
  message:  string
}): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from(TABLE_NAMES.CONTACT_MESSAGES).insert({
    name:    payload.name    || null,
    email:   payload.email   || null,
    subject: payload.subject || null,
    message: payload.message,
  })
  if (error) throw new Error(error.message)
}

export async function fetchAllContactMessages(): Promise<ContactMessage[]> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.CONTACT_MESSAGES)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(adaptContactMessage)
}

export async function markContactMessageRead(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.CONTACT_MESSAGES)
    .update({ status: 'leido' })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteContactMessage(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.CONTACT_MESSAGES)
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}
