'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { categorySchema, type CategorySchema } from '@/lib/validations'
import {
  createMovieCategory, updateMovieCategory,
} from '@/services/movieCategories.service'
import {
  createBookCategory, updateBookCategory,
} from '@/services/bookCategories.service'
import { useMovieCategoriesStore } from '@/stores/useMovieCategoriesStore'
import { useBookCategoriesStore }  from '@/stores/useBookCategoriesStore'
import { ROUTES } from '@/lib/constants'
import type { MovieCategory, BookCategory } from '@/types/app.types'

interface CategoryFormProps {
  entityType: 'peliculas' | 'libros'
  category?:  MovieCategory | BookCategory
}

export const CategoryForm = ({ entityType, category }: CategoryFormProps) => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const addMovieCategory    = useMovieCategoriesStore((s) => s.addCategory)
  const updateMovieCatStore = useMovieCategoriesStore((s) => s.updateCategory)
  const addBookCategory     = useBookCategoriesStore((s) => s.addCategory)
  const updateBookCatStore  = useBookCategoriesStore((s) => s.updateCategory)

  const backHref = entityType === 'peliculas'
    ? ROUTES.ADMIN_MOVIE_CATEGORIES
    : ROUTES.ADMIN_BOOK_CATEGORIES

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? { name: category.name, sortOrder: category.sortOrder }
      : { sortOrder: 0 },
  })

  const onSubmit = async (data: CategorySchema) => {
    setServerError(null)
    try {
      if (entityType === 'peliculas') {
        if (category) {
          const updated = await updateMovieCategory(category.id, data)
          updateMovieCatStore(category.id, updated)
        } else {
          const created = await createMovieCategory(data)
          addMovieCategory(created)
        }
      } else {
        if (category) {
          const updated = await updateBookCategory(category.id, data)
          updateBookCatStore(category.id, updated)
        } else {
          const created = await createBookCategory(data)
          addBookCategory(created)
        }
      }
      router.push(backHref)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
      <div>
        <label className="block text-sm text-light/70 mb-1.5">Nombre *</label>
        <input
          {...register('name')}
          placeholder="Ej: Familia, Espiritualidad..."
          className={inputClass}
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm text-light/70 mb-1.5">Orden</label>
        <input
          type="number"
          {...register('sortOrder', { valueAsNumber: true })}
          className={inputClass}
        />
        {errors.sortOrder && <p className="text-red-400 text-xs mt-1">{errors.sortOrder.message}</p>}
      </div>

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
          {isSubmitting ? 'Guardando...' : category ? 'Guardar cambios' : 'Crear categoría'}
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

const inputClass =
  'w-full px-4 py-2.5 rounded-sm bg-primary border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm'
