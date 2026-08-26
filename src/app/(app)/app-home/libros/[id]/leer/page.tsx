import { notFound } from 'next/navigation'
import { fetchBooksPageData } from '@/lib/data-cache'
import { AppPdfReader } from '@/components/app/AppPdfReader'

export const dynamic = 'force-dynamic'

export default async function AppBookReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { books: rows } = await fetchBooksPageData()
  const row = rows.find((book) => book.id === id)
  if (!row?.pdf_url) notFound()

  return (
    <AppPdfReader
      pdfUrl={row.pdf_url}
      title={row.title}
      author={row.author}
      backHref={`/app-home/libros/${row.id}`}
    />
  )
}
