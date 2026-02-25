'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { YoutubeChannel } from '@/types/app.types'

interface YoutubeChannelsState {
  channels:      YoutubeChannel[]
  isLoading:     boolean
  error:         string | null
  setChannels:   (channels: YoutubeChannel[]) => void
  addChannel:    (channel: YoutubeChannel) => void
  updateChannel: (id: string, updates: Partial<YoutubeChannel>) => void
  removeChannel: (id: string) => void
  setLoading:    (isLoading: boolean) => void
  setError:      (error: string | null) => void
}

export const useYoutubeChannelsStore = create<YoutubeChannelsState>()(
  devtools(
    (set) => ({
      channels:  [],
      isLoading: false,
      error:     null,
      setChannels:   (channels)    => set({ channels }),
      addChannel:    (channel)     => set((s) => ({ channels: [...s.channels, channel] })),
      updateChannel: (id, updates) => set((s) => ({ channels: s.channels.map((c) => c.id === id ? { ...c, ...updates } : c) })),
      removeChannel: (id)          => set((s) => ({ channels: s.channels.filter((c) => c.id !== id) })),
      setLoading:    (isLoading)   => set({ isLoading }),
      setError:      (error)       => set({ error }),
    }),
    { name: 'youtube-channels-store' }
  )
)
