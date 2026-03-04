import { fetchBooksPageData, fetchSettingsPublic, fetchRatingsPublic } from '@/lib/data-cache'
import { SITE_NAME } from '@/lib/constants'
import { BookFilterSection } from '@/components/public/books/BookFilterSection'
import { SectionHeader } from '@/components/public/SectionHeader'
import { SettingsInitializer } from '@/components/SettingsInitializer'
import type { Metadata } from 'next'
import type { Book, BookCategory } from '@/types/app.types'


export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title:       `Libros recomendados — ${SITE_NAME}`,
  description: 'Libros católicos seleccionados para el crecimiento espiritual: espiritualidad, santos, formación en la fe.',
}

export default async function LibrosPage() {
  const [{ books: booksRaw, categories: catsRaw }, settings, ratingsMap] = await Promise.all([
    fetchBooksPageData(),
    fetchSettingsPublic(),
    fetchRatingsPublic('libro'),
  ])

  const books: Book[] = booksRaw.map((row) => ({
    id:          row.id,
    title:       row.title,
    author:      row.author,
    description: row.description,
    coverUrl:    row.cover_url,
    purchaseUrl: row.purchase_url,
    pdfUrl:      row.pdf_url,
    year:        row.year,
    categoryIds: (row.book_category_items as { category_id: string }[] ?? []).map((r) => r.category_id),
    isPublished: row.is_published,
    sortOrder:   row.sort_order,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
  }))

  const categories: BookCategory[] = catsRaw.map((row) => ({
    id:        row.id,
    name:      row.name,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }))

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-24">
      <SettingsInitializer copyrightMode={settings.copyrightMode} />
      <SectionHeader
        title="Libros"
        subtitle="Lectura seleccionada para el alma — espiritualidad, santos y formación"
      />
      <BookFilterSection books={books} categories={categories} ratingsMap={ratingsMap} />
    </main>
  )
}
