'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { YoutubePlaylist } from '@/types/app.types'

interface YoutubePlaylistsState {
  playlists:      YoutubePlaylist[]
  isLoading:      boolean
  error:          string | null
  setPlaylists:   (playlists: YoutubePlaylist[]) => void
  addPlaylist:    (playlist: YoutubePlaylist) => void
  updatePlaylist: (id: string, updates: Partial<YoutubePlaylist>) => void
  removePlaylist: (id: string) => void
  setLoading:     (isLoading: boolean) => void
  setError:       (error: string | null) => void
}

export const useYoutubePlaylistsStore = create<YoutubePlaylistsState>()(
  devtools(
    (set) => ({
      playlists:  [],
      isLoading:  false,
      error:      null,
      setPlaylists:   (playlists)          => set({ playlists }),
      addPlaylist:    (playlist)           => set((s) => ({ playlists: [...s.playlists, playlist] })),
      updatePlaylist: (id, updates)        => set((s) => ({ playlists: s.playlists.map((p) => p.id === id ? { ...p, ...updates } : p) })),
      removePlaylist: (id)                 => set((s) => ({ playlists: s.playlists.filter((p) => p.id !== id) })),
      setLoading:     (isLoading)          => set({ isLoading }),
      setError:       (error)              => set({ error }),
    }),
    { name: 'youtube-playlists-store' }
  )
)
