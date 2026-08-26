import { notFound } from 'next/navigation'
import { fetchBooksPageData } from '@/lib/data-cache'
import { AppBookDetails } from '@/components/app/AppDetails'
import type { Book } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppBookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { books: rows } = await fetchBooksPageData()
  const row = rows.find((book) => book.id === id)
  if (!row) notFound()
  const book: Book = {
    id: row.id, title: row.title, author: row.author, description: row.description,
    coverUrl: row.cover_url, purchaseUrl: row.purchase_url, pdfUrl: row.pdf_url,
    year: row.year, categoryIds: [], isPublished: row.is_published,
    sortOrder: row.sort_order, createdAt: row.created_at, updatedAt: row.updated_at,
  }
  return <AppBookDetails book={book} />
}
