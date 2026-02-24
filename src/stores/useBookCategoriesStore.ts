'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { BookCategory } from '@/types/app.types'

interface BookCategoriesState {
  categories:      BookCategory[]
  isLoading:       boolean
  error:           string | null
  setCategories:   (categories: BookCategory[]) => void
  addCategory:     (category: BookCategory) => void
  updateCategory:  (id: string, updates: Partial<BookCategory>) => void
  removeCategory:  (id: string) => void
  setLoading:      (isLoading: boolean) => void
  setError:        (error: string | null) => void
}

export const useBookCategoriesStore = create<BookCategoriesState>()(
  devtools(
    (set) => ({
      categories: [],
      isLoading:  false,
      error:      null,

      setCategories:  (categories) => set({ categories }),
      addCategory:    (category)   => set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      removeCategory: (id) =>
        set((state) => ({ categories: state.categories.filter((c) => c.id !== id) })),
      setLoading: (isLoading) => set({ isLoading }),
      setError:   (error)     => set({ error }),
    }),
    { name: 'book-categories-store' }
  )
)
