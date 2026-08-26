import { fetchBooksPageData } from '@/lib/data-cache'
import { AppCatalog } from '@/components/app/AppCatalog'
import type { Book } from '@/types/app.types'

export const dynamic = 'force-dynamic'

export default async function AppBooksPage() {
  const { books: rows } = await fetchBooksPageData()
  const books: Book[] = rows.map((row) => ({
    id: row.id, title: row.title, author: row.author, description: row.description,
    coverUrl: row.cover_url, purchaseUrl: row.purchase_url, pdfUrl: row.pdf_url,
    year: row.year, categoryIds: [], isPublished: row.is_published,
    sortOrder: row.sort_order, createdAt: row.created_at, updatedAt: row.updated_at,
  }))
  return <AppCatalog title="Libros" subtitle="Lecturas seleccionadas para acompañar el crecimiento espiritual." items={books} kind="book" getHref={(book) => `/app-home/libros/${book.id}`} />
}
