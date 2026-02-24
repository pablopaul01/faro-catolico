'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Book } from '@/types/app.types'

interface BooksState {
  books:       Book[]
  isLoading:   boolean
  error:       string | null
  setBooks:    (books: Book[]) => void
  addBook:     (book: Book) => void
  updateBook:  (id: string, updates: Partial<Book>) => void
  removeBook:  (id: string) => void
  setLoading:  (isLoading: boolean) => void
  setError:    (error: string | null) => void
}

export const useBooksStore = create<BooksState>()(
  devtools(
    (set) => ({
      books:     [],
      isLoading: false,
      error:     null,

      setBooks:   (books) => set({ books }),
      addBook:    (book)  => set((state) => ({ books: [book, ...state.books] })),
      updateBook: (id, updates) =>
        set((state) => ({
          books: state.books.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),
      removeBook: (id) =>
        set((state) => ({ books: state.books.filter((b) => b.id !== id) })),
      setLoading: (isLoading) => set({ isLoading }),
      setError:   (error)     => set({ error }),
    }),
    { name: 'books-store' }
  )
)
