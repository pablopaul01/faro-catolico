'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Song } from '@/types/app.types'

interface MusicState {
  songs:      Song[]
  isLoading:  boolean
  error:      string | null
  setSongs:   (songs: Song[]) => void
  addSong:    (song: Song) => void
  updateSong: (id: string, updates: Partial<Song>) => void
  removeSong: (id: string) => void
  setLoading: (isLoading: boolean) => void
  setError:   (error: string | null) => void
}

export const useMusicStore = create<MusicState>()(
  devtools(
    (set) => ({
      songs:     [],
      isLoading: false,
      error:     null,

      setSongs:   (songs)       => set({ songs }),
      addSong:    (song)        => set((s) => ({ songs: [song, ...s.songs] })),
      updateSong: (id, updates) =>
        set((s) => ({
          songs: s.songs.map((song) => (song.id === id ? { ...song, ...updates } : song)),
        })),
      removeSong: (id) => set((s) => ({ songs: s.songs.filter((song) => song.id !== id) })),
      setLoading: (isLoading)   => set({ isLoading }),
      setError:   (error)       => set({ error }),
    }),
    { name: 'music-store' }
  )
)

/** Selector: canciones filtradas por categoryId */
export const selectSongsByCategory = (songs: Song[], categoryId: string) =>
  songs.filter((s) => s.categoryIds.includes(categoryId))
