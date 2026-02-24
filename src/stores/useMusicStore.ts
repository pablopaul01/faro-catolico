'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Song, MusicCategory } from '@/types/app.types'
import { MUSIC_CATEGORIES } from '@/lib/constants'

interface MusicState {
  songs:           Song[]
  activeCategory:  MusicCategory
  isLoading:       boolean
  error:           string | null
  setSongs:        (songs: Song[]) => void
  addSong:         (song: Song) => void
  updateSong:      (id: string, updates: Partial<Song>) => void
  removeSong:      (id: string) => void
  setCategory:     (category: MusicCategory) => void
  setLoading:      (isLoading: boolean) => void
  setError:        (error: string | null) => void
}

export const useMusicStore = create<MusicState>()(
  devtools(
    (set) => ({
      songs:          [],
      activeCategory: MUSIC_CATEGORIES[0],
      isLoading:      false,
      error:          null,

      setSongs:    (songs)    => set({ songs }),
      addSong:     (song)     => set((state) => ({ songs: [song, ...state.songs] })),
      updateSong:  (id, updates) =>
        set((state) => ({
          songs: state.songs.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
      removeSong:  (id)       => set((state) => ({ songs: state.songs.filter((s) => s.id !== id) })),
      setCategory: (category) => set({ activeCategory: category }),
      setLoading:  (isLoading) => set({ isLoading }),
      setError:    (error)    => set({ error }),
    }),
    { name: 'music-store' }
  )
)

/** Selector: canciones filtradas por categoría (para evitar re-renders innecesarios) */
export const selectSongsByCategory = (songs: Song[], category: MusicCategory) =>
  songs.filter((s) => s.category === category)
