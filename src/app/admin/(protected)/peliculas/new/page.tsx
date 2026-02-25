import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { MovieForm } from '@/components/admin/movies/MovieForm'
import type { MovieCategory, MoviePlatform } from '@/types/app.types'

export default async function NewMoviePage() {
  const supabase = await createSupabaseServerClient()
  const [catsRes, platsRes] = await Promise.all([
    supabase.from(TABLE_NAMES.MOVIE_CATEGORIES).select('*').order('sort_order', { ascending: true }),
    supabase.from(TABLE_NAMES.MOVIE_PLATFORMS).select('*').order('sort_order', { ascending: true }),
  ])

  const categories: MovieCategory[] = (catsRes.data ?? []).map((row) => ({
    id:        row.id,
    name:      row.name,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }))

  const platforms: MoviePlatform[] = (platsRes.data ?? []).map((row) => ({
    id:        row.id,
    name:      row.name,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }))

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Nueva película</h1>
      <p className="text-light/50 text-sm mb-8">Completa los datos de la película a agregar</p>
      <MovieForm categories={categories} platforms={platforms} />
    </div>
  )
}
