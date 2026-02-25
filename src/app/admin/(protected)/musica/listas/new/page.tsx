import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { PlaylistForm } from '@/components/admin/music/PlaylistForm'
import type { MusicCategory } from '@/types/app.types'

export default async function NewPlaylistPage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from(TABLE_NAMES.MUSIC_CATEGORIES)
    .select('*')
    .order('sort_order', { ascending: true })

  const categories: MusicCategory[] = (data ?? []).map((r) => ({
    id: r.id, name: r.name, sortOrder: r.sort_order, createdAt: r.created_at,
  }))

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Nueva playlist</h1>
      <p className="text-light/50 text-sm mb-8">Completa los datos de la playlist de Spotify a agregar</p>
      <PlaylistForm categories={categories} />
    </div>
  )
}
