import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { MovieForm } from '@/components/admin/movies/MovieForm'
import type { MovieCategory } from '@/types/app.types'

export default async function NewMoviePage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from(TABLE_NAMES.MOVIE_CATEGORIES)
    .select('*')
    .order('sort_order', { ascending: true })

  const categories: MovieCategory[] = (data ?? []).map((row) => ({
    id:        row.id,
    name:      row.name,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }))

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Nueva película</h1>
      <p className="text-light/50 text-sm mb-8">Completa los datos de la película a agregar</p>
      <MovieForm categories={categories} />
    </div>
  )
}
