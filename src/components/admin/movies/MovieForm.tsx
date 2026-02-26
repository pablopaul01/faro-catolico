'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { movieSchema, type MovieSchema } from '@/lib/validations'
import { createMovie, updateMovie } from '@/services/movies.service'
import { useMoviesStore } from '@/stores/useMoviesStore'
import { ROUTES } from '@/lib/constants'
import type { Movie, MovieCategory, MoviePlatform } from '@/types/app.types'

interface MovieFormProps {
  movie?:     Movie
  categories: MovieCategory[]
  platforms:  MoviePlatform[]
}

export const MovieForm = ({ movie, categories, platforms }: MovieFormProps) => {
  const router   = useRouter()
  const addMovie = useMoviesStore((s) => s.addMovie)
  const updateMovieInStore = useMoviesStore((s) => s.updateMovie)
  const [serverError, setServerError] = useState<string | null>(null)
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>(movie?.platformIds ?? [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MovieSchema>({
    resolver: zodResolver(movieSchema),
    defaultValues: movie
      ? {
          title:         movie.title,
          description:   movie.description   ?? undefined,
          youtubeId:     movie.youtubeId     ?? '',
          dailymotionId: movie.dailymotionId ?? '',
          externalUrl:   movie.externalUrl   ?? '',
          thumbnailUrl:  movie.thumbnailUrl  ?? '',
          year:          movie.year          ?? undefined,
          categoryIds:   movie.categoryIds,
          isPublished:   movie.isPublished,
          sortOrder:     movie.sortOrder,
        }
      : { categoryIds: [], isPublished: false, sortOrder: 0 },
  })

  const selectedCategoryIds = watch('categoryIds') ?? []

  const toggleCategory = (catId: string) => {
    setValue(
      'categoryIds',
      selectedCategoryIds.includes(catId)
        ? selectedCategoryIds.filter((id) => id !== catId)
        : [...selectedCategoryIds, catId]
    )
  }

  const togglePlatform = (pid: string) => {
    setSelectedPlatformIds((prev) =>
      prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid]
    )
  }

  const onSubmit = async (data: MovieSchema) => {
    setServerError(null)
    try {
      const payload = {
        ...data,
        categoryIds:   selectedCategoryIds,
        platformIds:   selectedPlatformIds,
        youtubeId:     data.youtubeId     || null,
        dailymotionId: data.dailymotionId || null,
        externalUrl:   data.externalUrl   || null,
        thumbnailUrl:  data.thumbnailUrl  || null,
        description:   data.description   || null,
        year:          data.year          ?? null,
      }

      if (movie) {
        const updated = await updateMovie(movie.id, payload)
        updateMovieInStore(movie.id, updated)
      } else {
        const created = await createMovie(payload)
        addMovie(created)
      }
      router.push(ROUTES.ADMIN_MOVIES)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      {/* Título */}
      <FormField label="Título *" error={errors.title?.message}>
        <input {...register('title')} placeholder="La historia de San Francisco" className={inputClass} />
      </FormField>

      {/* IDs de video */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="ID de YouTube (opcional)"
          hint="Solo el ID, ej: dQw4w9WgXcQ"
          error={errors.youtubeId?.message}
        >
          <input {...register('youtubeId')} placeholder="dQw4w9WgXcQ" className={inputClass} />
        </FormField>
        <FormField
          label="ID de Dailymotion (opcional)"
          hint="Solo el ID, ej: x9jm09m"
          error={errors.dailymotionId?.message}
        >
          <input {...register('dailymotionId')} placeholder="x9jm09m" className={inputClass} />
        </FormField>
      </div>

      {/* Descripción */}
      <FormField label="Descripción" error={errors.description?.message}>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Breve sinopsis de la película..."
          className={`${inputClass} resize-none`}
        />
      </FormField>

      {/* Categorías (múltiples) */}
      {categories.length > 0 && (
        <FormField label="Categorías" error={errors.categoryIds?.message}>
          <div className="flex flex-wrap gap-2 mt-1">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-sm transition-colors cursor-pointer ${
                  selectedCategoryIds.includes(cat.id)
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'border-border text-light/60 hover:border-accent/40 hover:text-light'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="sr-only"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </FormField>
      )}

      {/* Plataformas (múltiples) */}
      {platforms.length > 0 && (
        <FormField label="Plataformas de streaming">
          <div className="flex flex-wrap gap-2 mt-1">
            {platforms.map((plat) => (
              <label
                key={plat.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-sm transition-colors cursor-pointer ${
                  selectedPlatformIds.includes(plat.id)
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'border-border text-light/60 hover:border-accent/40 hover:text-light'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPlatformIds.includes(plat.id)}
                  onChange={() => togglePlatform(plat.id)}
                  className="sr-only"
                />
                {plat.name}
              </label>
            ))}
          </div>
        </FormField>
      )}

      {/* Año y sortOrder en fila */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Año (opcional)" error={errors.year?.message}>
          <input
            type="number"
            {...register('year', { setValueAs: (v) => v === '' ? undefined : parseInt(v, 10) })}
            placeholder="2023"
            className={inputClass}
          />
        </FormField>
        <FormField label="Orden" error={errors.sortOrder?.message}>
          <input
            type="number"
            {...register('sortOrder', { valueAsNumber: true })}
            className={inputClass}
          />
        </FormField>
      </div>

      {/* URL externa */}
      <FormField label="URL externa (opcional)" error={errors.externalUrl?.message}>
        <input {...register('externalUrl')} placeholder="https://..." className={inputClass} />
      </FormField>

      {/* Thumbnail custom */}
      <FormField label="URL de miniatura (opcional)" error={errors.thumbnailUrl?.message}>
        <input {...register('thumbnailUrl')} placeholder="https://..." className={inputClass} />
      </FormField>

      {/* Publicado */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" {...register('isPublished')} className="w-4 h-4 accent-accent" />
        <span className="text-light/80 text-sm">Publicar (visible en el sitio)</span>
      </label>

      {serverError && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 px-3 py-2 rounded-sm">
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-accent text-primary font-semibold rounded-sm hover:bg-accent/90 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Guardando...' : movie ? 'Guardar cambios' : 'Crear película'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 text-light/50 hover:text-light text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

// ─── Helpers de UI ───────────────────────────────────────────

const inputClass =
  'w-full px-4 py-2.5 rounded-sm bg-primary border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm'

const FormField = ({
  label,
  hint,
  error,
  children,
}: {
  label:    string
  hint?:    string
  error?:   string
  children: React.ReactNode
}) => (
  <div>
    <label className="block text-sm text-light/70 mb-1.5">
      {label}
      {hint && <span className="block text-xs text-light/30 mt-0.5">{hint}</span>}
    </label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
)
