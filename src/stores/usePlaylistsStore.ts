'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Playlist } from '@/types/app.types'

interface PlaylistsState {
  playlists:      Playlist[]
  isLoading:      boolean
  error:          string | null
  setPlaylists:   (playlists: Playlist[]) => void
  addPlaylist:    (playlist: Playlist) => void
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void
  removePlaylist: (id: string) => void
  setLoading:     (isLoading: boolean) => void
  setError:       (error: string | null) => void
}

export const usePlaylistsStore = create<PlaylistsState>()(
  devtools(
    (set) => ({
      playlists: [],
      isLoading: false,
      error:     null,

      setPlaylists:   (playlists)       => set({ playlists }),
      addPlaylist:    (playlist)        => set((s) => ({ playlists: [playlist, ...s.playlists] })),
      updatePlaylist: (id, updates)     =>
        set((s) => ({
          playlists: s.playlists.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      removePlaylist: (id)              => set((s) => ({ playlists: s.playlists.filter((p) => p.id !== id) })),
      setLoading:     (isLoading)       => set({ isLoading }),
      setError:       (error)           => set({ error }),
    }),
    { name: 'playlists-store' }
  )
)
