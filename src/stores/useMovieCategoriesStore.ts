'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MovieCategory } from '@/types/app.types'

interface MovieCategoriesState {
  categories:      MovieCategory[]
  isLoading:       boolean
  error:           string | null
  setCategories:   (categories: MovieCategory[]) => void
  addCategory:     (category: MovieCategory) => void
  updateCategory:  (id: string, updates: Partial<MovieCategory>) => void
  removeCategory:  (id: string) => void
  setLoading:      (isLoading: boolean) => void
  setError:        (error: string | null) => void
}

export const useMovieCategoriesStore = create<MovieCategoriesState>()(
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
    { name: 'movie-categories-store' }
  )
)
