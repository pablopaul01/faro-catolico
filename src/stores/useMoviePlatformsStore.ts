'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MoviePlatform } from '@/types/app.types'

interface MoviePlatformsState {
  platforms:      MoviePlatform[]
  isLoading:      boolean
  error:          string | null
  setPlatforms:   (platforms: MoviePlatform[]) => void
  addPlatform:    (platform: MoviePlatform) => void
  updatePlatform: (id: string, updates: Partial<MoviePlatform>) => void
  removePlatform: (id: string) => void
  setLoading:     (isLoading: boolean) => void
  setError:       (error: string | null) => void
}

export const useMoviePlatformsStore = create<MoviePlatformsState>()(
  devtools(
    (set) => ({
      platforms:  [],
      isLoading:  false,
      error:      null,

      setPlatforms:   (platforms) => set({ platforms }),
      addPlatform:    (platform)  => set((state) => ({ platforms: [...state.platforms, platform] })),
      updatePlatform: (id, updates) =>
        set((state) => ({
          platforms: state.platforms.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      removePlatform: (id) =>
        set((state) => ({ platforms: state.platforms.filter((p) => p.id !== id) })),
      setLoading: (isLoading) => set({ isLoading }),
      setError:   (error)     => set({ error }),
    }),
    { name: 'movie-platforms-store' }
  )
)
