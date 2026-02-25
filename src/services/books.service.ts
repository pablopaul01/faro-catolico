import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { Book, BookFormPayload } from '@/types/app.types'

type BookCatRow = { category_id: string }

const BOOK_SELECT = `*, ${TABLE_NAMES.BOOK_CATEGORY_ITEMS}(category_id)`

const adaptBook = (row: Record<string, unknown>): Book => ({
  id:           row.id           as string,
  title:        row.title        as string,
  author:       row.author       as string,
  description:  row.description  as string | null,
  coverUrl:     row.cover_url    as string | null,
  purchaseUrl:  row.purchase_url as string | null,
  pdfUrl:       row.pdf_url      as string | null,
  year:         row.year         as number | null,
  categoryIds:  ((row.book_category_items as BookCatRow[] | null) ?? []).map((r) => r.category_id),
  isPublished:  row.is_published as boolean,
  sortOrder:    row.sort_order   as number,
  createdAt:    row.created_at   as string,
  updatedAt:    row.updated_at   as string,
})

export const fetchAllBooks = async (): Promise<Book[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.BOOKS)
    .select(BOOK_SELECT)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data?.map(adaptBook) ?? []
}

export const createBook = async (payload: BookFormPayload): Promise<Book> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.BOOKS)
    .insert({
      title:        payload.title,
      author:       payload.author,
      description:  payload.description  || null,
      cover_url:    payload.coverUrl     || null,
      purchase_url: payload.purchaseUrl  || null,
      pdf_url:      payload.pdfUrl       || null,
      year:         payload.year         ?? null,
      is_published: payload.isPublished,
      sort_order:   payload.sortOrder,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  const categoryIds = payload.categoryIds ?? []
  if (categoryIds.length > 0) {
    const { error: catErr } = await supabase
      .from(TABLE_NAMES.BOOK_CATEGORY_ITEMS)
      .insert(categoryIds.map((catId) => ({ book_id: data.id, category_id: catId })))
    if (catErr) throw new Error(catErr.message)
  }

  return adaptBook({
    ...data,
    book_category_items: categoryIds.map((catId) => ({ category_id: catId })),
  })
}

export const updateBook = async (
  id: string,
  payload: Partial<BookFormPayload>
): Promise<Book> => {
  const supabase = getSupabaseBrowserClient()

  const updates: Record<string, unknown> = {}
  if (payload.title       !== undefined) updates.title        = payload.title
  if (payload.author      !== undefined) updates.author       = payload.author
  if (payload.description !== undefined) updates.description  = payload.description || null
  if (payload.coverUrl    !== undefined) updates.cover_url    = payload.coverUrl    || null
  if (payload.purchaseUrl !== undefined) updates.purchase_url = payload.purchaseUrl || null
  if (payload.pdfUrl      !== undefined) updates.pdf_url      = payload.pdfUrl      || null
  if (payload.year        !== undefined) updates.year         = payload.year        ?? null
  if (payload.isPublished !== undefined) updates.is_published = payload.isPublished
  if (payload.sortOrder   !== undefined) updates.sort_order   = payload.sortOrder

  const { data, error } = await supabase
    .from(TABLE_NAMES.BOOKS)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (payload.categoryIds !== undefined) {
    await supabase.from(TABLE_NAMES.BOOK_CATEGORY_ITEMS).delete().eq('book_id', id)
    if (payload.categoryIds.length > 0) {
      const { error: catErr } = await supabase
        .from(TABLE_NAMES.BOOK_CATEGORY_ITEMS)
        .insert(payload.categoryIds.map((catId) => ({ book_id: id, category_id: catId })))
      if (catErr) throw new Error(catErr.message)
    }
  }

  const { data: catData } = await supabase
    .from(TABLE_NAMES.BOOK_CATEGORY_ITEMS)
    .select('category_id')
    .eq('book_id', id)

  return adaptBook({ ...data, book_category_items: catData ?? [] })
}

export const deleteBook = async (id: string): Promise<void> => {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.BOOKS)
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
