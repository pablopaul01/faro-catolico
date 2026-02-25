import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'

export async function fetchSettings(): Promise<{ copyrightMode: boolean }> {
  const supabase = getSupabaseBrowserClient()
  const { data } = await supabase
    .from(TABLE_NAMES.SETTINGS)
    .select('copyright_mode')
    .eq('id', 'global')
    .single()
  return { copyrightMode: data?.copyright_mode ?? false }
}

export async function updateCopyrightMode(value: boolean): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.SETTINGS)
    .update({ copyright_mode: value })
    .eq('id', 'global')
  if (error) throw new Error(error.message)
}
