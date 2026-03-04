'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Song } from '@/types/app.types'

interface MusicState {
  songs:              Song[]
  isLoading:          boolean
  error:              string | null
  listSearch:         string
  listFilterCatId:    string
  listPage:           number
  listPageSize:       number
  // Actions
  setSongs:           (songs: Song[]) => void
  addSong:            (song: Song) => void
  updateSong:         (id: string, updates: Partial<Song>) => void
  removeSong:         (id: string) => void
  setLoading:         (isLoading: boolean) => void
  setError:           (error: string | null) => void
  setListSearch:      (v: string) => void
  setListFilterCatId: (v: string) => void
  setListPage:        (v: number) => void
  setListPageSize:    (v: number) => void
}

export const useMusicStore = create<MusicState>()(
  devtools(
    (set) => ({
      songs:           [],
      isLoading:       false,
      error:           null,
      listSearch:      '',
      listFilterCatId: '',
      listPage:        1,
      listPageSize:    10,

      setSongs:   (songs)       => set({ songs }),
      addSong:    (song)        => set((s) => ({ songs: [song, ...s.songs] })),
      updateSong: (id, updates) =>
        set((s) => ({
          songs: s.songs.map((song) => (song.id === id ? { ...song, ...updates } : song)),
        })),
      removeSong: (id) => set((s) => ({ songs: s.songs.filter((song) => song.id !== id) })),
      setLoading:         (isLoading)   => set({ isLoading }),
      setError:           (error)       => set({ error }),
      setListSearch:      (v) => set({ listSearch: v,      listPage: 1 }),
      setListFilterCatId: (v) => set({ listFilterCatId: v, listPage: 1 }),
      setListPage:        (v) => set({ listPage: v }),
      setListPageSize:    (v) => set({ listPageSize: v,    listPage: 1 }),
    }),
    { name: 'music-store' }
  )
)

/** Selector: canciones filtradas por categoryId */
export const selectSongsByCategory = (songs: Song[], categoryId: string) =>
  songs.filter((s) => s.categoryIds.includes(categoryId))
