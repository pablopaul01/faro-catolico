import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'

// Solo usar en Server Components — importa next/headers
export async function fetchSettingsServer(): Promise<{ copyrightMode: boolean }> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from(TABLE_NAMES.SETTINGS)
    .select('copyright_mode')
    .eq('id', 'global')
    .single()
  return { copyrightMode: data?.copyright_mode ?? false }
}
