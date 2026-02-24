import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'

// Solo funciones que usan el cliente browser (seguras en Client Components)
export async function submitRating(
  contentType: 'pelicula' | 'libro' | 'cancion',
  contentId: string,
  rating: number,
): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.RATINGS)
    .insert({ content_type: contentType, content_id: contentId, rating })
  if (error) throw new Error(error.message)
}
