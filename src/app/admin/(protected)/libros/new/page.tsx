import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { BookForm } from '@/components/admin/books/BookForm'
import type { BookCategory } from '@/types/app.types'

export default async function NewBookPage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from(TABLE_NAMES.BOOK_CATEGORIES)
    .select('*')
    .order('sort_order', { ascending: true })

  const categories: BookCategory[] = (data ?? []).map((row) => ({
    id:        row.id,
    name:      row.name,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }))

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Nuevo libro</h1>
      <p className="text-light/50 text-sm mb-8">Completa los datos del libro a agregar</p>
      <BookForm categories={categories} />
    </div>
  )
}
