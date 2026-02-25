import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { MovieForm } from '@/components/admin/movies/MovieForm'
import type { Movie, MovieCategory, MoviePlatform } from '@/types/app.types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditMoviePage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const [movieRes, catsRes, platsRes] = await Promise.all([
    supabase
      .from(TABLE_NAMES.MOVIES)
      .select(`*, ${TABLE_NAMES.MOVIE_CATEGORY_ITEMS}(category_id), ${TABLE_NAMES.MOVIE_PLATFORM_ITEMS}(platform_id)`)
      .eq('id', id)
      .single(),
    supabase.from(TABLE_NAMES.MOVIE_CATEGORIES).select('*').order('sort_order', { ascending: true }),
    supabase.from(TABLE_NAMES.MOVIE_PLATFORMS).select('*').order('sort_order', { ascending: true }),
  ])

  if (movieRes.error || !movieRes.data) notFound()

  const data = movieRes.data
  const movie: Movie = {
    id:           data.id,
    title:        data.title,
    description:  data.description,
    youtubeId:    data.youtube_id,
    externalUrl:  data.external_url,
    thumbnailUrl: data.thumbnail_url,
    year:         data.year,
    categoryIds:  (data.movie_category_items as { category_id: string }[] ?? []).map((r) => r.category_id),
    platformIds:  (data.movie_platform_items as { platform_id: string }[] ?? []).map((r) => r.platform_id),
    isPublished:  data.is_published,
    sortOrder:    data.sort_order,
    createdAt:    data.created_at,
    updatedAt:    data.updated_at,
  }

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
      <h1 className="font-display text-2xl text-light mb-2">Editar película</h1>
      <p className="text-light/50 text-sm mb-8">{movie.title}</p>
      <MovieForm movie={movie} categories={categories} platforms={platforms} />
    </div>
  )
}
