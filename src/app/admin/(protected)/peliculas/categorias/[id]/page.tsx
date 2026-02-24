import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { CategoryForm } from '@/components/admin/categories/CategoryForm'
import type { MovieCategory } from '@/types/app.types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditMovieCategoryPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from(TABLE_NAMES.MOVIE_CATEGORIES)
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  const category: MovieCategory = {
    id:        data.id,
    name:      data.name,
    sortOrder: data.sort_order,
    createdAt: data.created_at,
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Editar categoría</h1>
      <p className="text-light/50 text-sm mb-8">{category.name}</p>
      <CategoryForm entityType="peliculas" category={category} />
    </div>
  )
}
