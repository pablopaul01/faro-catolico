'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { bookSchema, type BookSchema } from '@/lib/validations'
import { createBook, updateBook } from '@/services/books.service'
import { useBooksStore } from '@/stores/useBooksStore'
import { ROUTES } from '@/lib/constants'
import type { Book, BookCategory } from '@/types/app.types'

interface BookFormProps {
  book?:      Book
  categories: BookCategory[]
}

export const BookForm = ({ book, categories }: BookFormProps) => {
  const router = useRouter()
  const addBook = useBooksStore((s) => s.addBook)
  const updateBookInStore = useBooksStore((s) => s.updateBook)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookSchema>({
    resolver: zodResolver(bookSchema),
    defaultValues: book
      ? {
          title:       book.title,
          author:      book.author,
          description: book.description  ?? undefined,
          coverUrl:    book.coverUrl     ?? '',
          purchaseUrl: book.purchaseUrl  ?? '',
          pdfUrl:      book.pdfUrl       ?? '',
          year:        book.year         ?? undefined,
          categoryId:  book.categoryId   ?? undefined,
          isPublished: book.isPublished,
          sortOrder:   book.sortOrder,
        }
      : { isPublished: false, sortOrder: 0 },
  })

  const onSubmit = async (data: BookSchema) => {
    setServerError(null)
    try {
      const payload = {
        ...data,
        description: data.description || null,
        coverUrl:    data.coverUrl    || null,
        purchaseUrl: data.purchaseUrl || null,
        pdfUrl:      data.pdfUrl      || null,
        year:        data.year        ?? null,
        categoryId:  data.categoryId  || null,
      }

      if (book) {
        const updated = await updateBook(book.id, payload)
        updateBookInStore(book.id, updated)
      } else {
        const created = await createBook(payload)
        addBook(created)
      }
      router.push(ROUTES.ADMIN_BOOKS)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Título *" error={errors.title?.message}>
          <input {...register('title')} placeholder="El nombre de la rosa" className={inputClass} />
        </FormField>
        <FormField label="Autor *" error={errors.author?.message}>
          <input {...register('author')} placeholder="Umberto Eco" className={inputClass} />
        </FormField>
      </div>

      <FormField label="Descripción" error={errors.description?.message}>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Breve descripción del libro..."
          className={`${inputClass} resize-none`}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Año" error={errors.year?.message}>
          <input
            type="number"
            {...register('year', { valueAsNumber: true })}
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

      {/* Categoría */}
      <FormField label="Categoría" error={errors.categoryId?.message}>
        <select {...register('categoryId')} className={`${inputClass} cursor-pointer`}>
          <option value="">Sin categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </FormField>

      <FormField label="URL de portada (imagen)" error={errors.coverUrl?.message}>
        <input {...register('coverUrl')} placeholder="https://..." className={inputClass} />
      </FormField>

      <FormField label="URL de compra (opcional)" error={errors.purchaseUrl?.message}>
        <input {...register('purchaseUrl')} placeholder="https://..." className={inputClass} />
      </FormField>

      <FormField label="URL de PDF gratuito (opcional)" error={errors.pdfUrl?.message}>
        <input {...register('pdfUrl')} placeholder="https://..." className={inputClass} />
      </FormField>

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
          {isSubmitting ? 'Guardando...' : book ? 'Guardar cambios' : 'Crear libro'}
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

const FormField = ({
  label,
  error,
  children,
}: {
  label:    string
  error?:   string
  children: React.ReactNode
}) => (
  <div>
    <label className="block text-sm text-light/70 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
)
