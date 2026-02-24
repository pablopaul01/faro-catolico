import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { Book, BookFormPayload } from '@/types/app.types'

const adaptBook = (row: Record<string, unknown>): Book => ({
  id:          row.id           as string,
  title:       row.title        as string,
  author:      row.author       as string,
  description: row.description  as string | null,
  coverUrl:    row.cover_url    as string | null,
  purchaseUrl: row.purchase_url as string | null,
  pdfUrl:      row.pdf_url      as string | null,
  year:        row.year         as number | null,
  categoryId:  row.category_id  as string | null,
  isPublished: row.is_published as boolean,
  sortOrder:   row.sort_order   as number,
  createdAt:   row.created_at   as string,
  updatedAt:   row.updated_at   as string,
})

export const fetchAllBooks = async (): Promise<Book[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.BOOKS)
    .select('*')
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
      category_id:  payload.categoryId   ?? null,
      is_published: payload.isPublished,
      sort_order:   payload.sortOrder,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return adaptBook(data)
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
  if (payload.categoryId  !== undefined) updates.category_id  = payload.categoryId ?? null
  if (payload.isPublished !== undefined) updates.is_published = payload.isPublished
  if (payload.sortOrder   !== undefined) updates.sort_order   = payload.sortOrder

  const { data, error } = await supabase
    .from(TABLE_NAMES.BOOKS)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return adaptBook(data)
}

export const deleteBook = async (id: string): Promise<void> => {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.BOOKS)
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
