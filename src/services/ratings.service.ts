import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'

function getVoterId(): string {
  let id = localStorage.getItem('voter_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('voter_id', id)
  }
  return id
}

// Solo funciones que usan el cliente browser (seguras en Client Components)
export async function submitRating(
  contentType: 'pelicula' | 'libro' | 'cancion',
  contentId: string,
  rating: number,
): Promise<void> {
  const voterId = getVoterId()
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.RATINGS)
    .upsert(
      { voter_id: voterId, content_type: contentType, content_id: contentId, rating },
      { onConflict: 'voter_id,content_type,content_id' },
    )
  if (error) throw new Error(error.message)
}
