import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import type { RatingsMap } from '@/types/app.types'

// Solo usar en Server Components — importa next/headers
export async function fetchRatingsForContent(
  contentType: 'pelicula' | 'libro' | 'cancion',
): Promise<RatingsMap> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.RATINGS)
    .select('content_id, rating')
    .eq('content_type', contentType)
  if (error) throw new Error(error.message)

  const map: RatingsMap = {}
  for (const row of data ?? []) {
    const id = row.content_id as string
    if (!map[id]) map[id] = { avgRating: 0, ratingCount: 0 }
    map[id].ratingCount += 1
    map[id].avgRating   += row.rating as number
  }
  for (const id of Object.keys(map)) {
    map[id].avgRating = map[id].avgRating / map[id].ratingCount
  }
  return map
}
