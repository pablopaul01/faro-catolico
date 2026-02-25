import { SubmissionForm } from '@/components/public/SubmissionForm'
import { SITE_NAME, TABLE_NAMES } from '@/lib/constants'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import type { MovieCategory, BookCategory, MusicCategory, MoviePlatform } from '@/types/app.types'

export const metadata: Metadata = {
  title:       `Sugerir contenido — ${SITE_NAME}`,
  description: '¿Conocés una película, libro o canción que debería estar en Faro Católico? ¡Sugerila y la revisamos!',
}

export default async function SugerirContenidoPage() {
  const supabase = await createSupabaseServerClient()

  const [moviesRes, booksRes, musicRes, platsRes] = await Promise.all([
    supabase.from(TABLE_NAMES.MOVIE_CATEGORIES).select('*').order('sort_order'),
    supabase.from(TABLE_NAMES.BOOK_CATEGORIES).select('*').order('sort_order'),
    supabase.from(TABLE_NAMES.MUSIC_CATEGORIES).select('*').order('sort_order'),
    supabase.from(TABLE_NAMES.MOVIE_PLATFORMS).select('*').order('sort_order'),
  ])

  const movieCategories: MovieCategory[] = (moviesRes.data ?? []).map((r) => ({
    id:        r.id,
    name:      r.name,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
  }))
  const bookCategories: BookCategory[] = (booksRes.data ?? []).map((r) => ({
    id:        r.id,
    name:      r.name,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
  }))
  const musicCategories: MusicCategory[] = (musicRes.data ?? []).map((r) => ({
    id:        r.id,
    name:      r.name,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
  }))
  const moviePlatforms: MoviePlatform[] = (platsRes.data ?? []).map((r) => ({
    id:        r.id,
    name:      r.name,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
  }))

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 pb-24 animate-fade-in">
      <h1 className="font-display text-3xl sm:text-4xl text-light mb-2">Sugerir contenido</h1>
      <p className="text-light/50 text-sm mb-8">
        ¿Conocés una película, libro o canción que debería estar en Faro Católico?
        Completá el formulario y lo revisamos. Si es aprobado, aparecerá en el catálogo.
      </p>
      <SubmissionForm
        movieCategories={movieCategories}
        bookCategories={bookCategories}
        musicCategories={musicCategories}
        moviePlatforms={moviePlatforms}
      />
    </main>
  )
}
