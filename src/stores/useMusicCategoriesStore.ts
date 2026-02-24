'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MusicCategory } from '@/types/app.types'

interface MusicCategoriesState {
  categories:      MusicCategory[]
  isLoading:       boolean
  error:           string | null
  setCategories:   (categories: MusicCategory[]) => void
  addCategory:     (category: MusicCategory) => void
  updateCategory:  (id: string, updates: Partial<MusicCategory>) => void
  removeCategory:  (id: string) => void
  setLoading:      (isLoading: boolean) => void
  setError:        (error: string | null) => void
}

export const useMusicCategoriesStore = create<MusicCategoriesState>()(
  devtools(
    (set) => ({
      categories: [],
      isLoading:  false,
      error:      null,

      setCategories:  (categories)  => set({ categories }),
      addCategory:    (category)    => set((s) => ({ categories: [...s.categories, category] })),
      updateCategory: (id, updates) =>
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      removeCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
      setLoading: (isLoading) => set({ isLoading }),
      setError:   (error)     => set({ error }),
    }),
    { name: 'music-categories-store' }
  )
)
