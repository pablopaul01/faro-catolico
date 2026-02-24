import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { BookForm } from '@/components/admin/books/BookForm'
import type { Book, BookCategory } from '@/types/app.types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditBookPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const [bookRes, catsRes] = await Promise.all([
    supabase.from(TABLE_NAMES.BOOKS).select('*').eq('id', id).single(),
    supabase.from(TABLE_NAMES.BOOK_CATEGORIES).select('*').order('sort_order', { ascending: true }),
  ])

  if (bookRes.error || !bookRes.data) notFound()

  const data = bookRes.data
  const book: Book = {
    id:          data.id,
    title:       data.title,
    author:      data.author,
    description: data.description,
    coverUrl:    data.cover_url,
    purchaseUrl: data.purchase_url,
    pdfUrl:      data.pdf_url,
    year:        data.year,
    categoryId:  data.category_id,
    isPublished: data.is_published,
    sortOrder:   data.sort_order,
    createdAt:   data.created_at,
    updatedAt:   data.updated_at,
  }

  const categories: BookCategory[] = (catsRes.data ?? []).map((row) => ({
    id:        row.id,
    name:      row.name,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }))

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Editar libro</h1>
      <p className="text-light/50 text-sm mb-8">{book.title}</p>
      <BookForm book={book} categories={categories} />
    </div>
  )
}
