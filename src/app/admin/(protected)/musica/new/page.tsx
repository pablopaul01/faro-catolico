import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { SongForm } from '@/components/admin/music/SongForm'
import type { MusicCategory } from '@/types/app.types'

export default async function NewSongPage() {
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase
    .from(TABLE_NAMES.MUSIC_CATEGORIES)
    .select('*')
    .order('sort_order', { ascending: true })

  const categories: MusicCategory[] = (data ?? []).map((row) => ({
    id:        row.id,
    name:      row.name,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }))

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Nueva canción</h1>
      <p className="text-light/50 text-sm mb-8">Completa los datos de la canción a agregar</p>
      <SongForm categories={categories} />
    </div>
  )
}
