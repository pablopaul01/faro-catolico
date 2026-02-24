import { createSupabaseServerClient } from '@/lib/supabase/server'
import { fetchRatingsForContent } from '@/services/ratings.server'
import { TABLE_NAMES, SITE_NAME } from '@/lib/constants'
import { BookFilterSection } from '@/components/public/books/BookFilterSection'
import { SectionHeader } from '@/components/public/SectionHeader'
import type { Metadata } from 'next'
import type { Book, BookCategory } from '@/types/app.types'

export const metadata: Metadata = {
  title:       `Libros recomendados — ${SITE_NAME}`,
  description: 'Libros católicos seleccionados para el crecimiento espiritual: espiritualidad, santos, formación en la fe.',
}

export default async function LibrosPage() {
  const supabase = await createSupabaseServerClient()

  const [booksRes, catsRes, ratingsMap] = await Promise.all([
    supabase
      .from(TABLE_NAMES.BOOKS)
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from(TABLE_NAMES.BOOK_CATEGORIES)
      .select('*')
      .order('sort_order', { ascending: true }),
    fetchRatingsForContent('libro'),
  ])

  const books: Book[] = (booksRes.data ?? []).map((row) => ({
    id:          row.id,
    title:       row.title,
    author:      row.author,
    description: row.description,
    coverUrl:    row.cover_url,
    purchaseUrl: row.purchase_url,
    pdfUrl:      row.pdf_url,
    year:        row.year,
    categoryId:  row.category_id,
    isPublished: row.is_published,
    sortOrder:   row.sort_order,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
  }))

  const categories: BookCategory[] = (catsRes.data ?? []).map((row) => ({
    id:        row.id,
    name:      row.name,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }))

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <SectionHeader
        title="Libros"
        subtitle="Lectura seleccionada para el alma — espiritualidad, santos y formación"
      />
      <BookFilterSection books={books} categories={categories} ratingsMap={ratingsMap} />
    </main>
  )
}
