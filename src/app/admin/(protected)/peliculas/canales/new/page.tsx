import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { YoutubeChannelForm } from '@/components/admin/movies/YoutubeChannelForm'
import type { MovieCategory } from '@/types/app.types'

export default async function NewYoutubeChannelPage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from(TABLE_NAMES.MOVIE_CATEGORIES)
    .select('*')
    .order('sort_order', { ascending: true })

  const categories: MovieCategory[] = (data ?? []).map((r) => ({
    id: r.id, name: r.name, sortOrder: r.sort_order, createdAt: r.created_at,
  }))

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Nuevo canal de YouTube</h1>
      <p className="text-light/50 text-sm mb-8">Completa los datos del canal a agregar</p>
      <YoutubeChannelForm categories={categories} />
    </div>
  )
}
