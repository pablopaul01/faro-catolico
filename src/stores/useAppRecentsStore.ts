'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { APP_RECENTS_LIMIT, APP_STORAGE } from '@/lib/constants'

export type AppRecentKind = 'movie' | 'book'

export interface AppRecentItem {
  id: string
  kind: AppRecentKind
  title: string
  href: string
  imageUrl: string | null
  subtitle?: string | null
  openedAt: number
}

interface AppRecentsState {
  items: AppRecentItem[]
  hydrated: boolean
  hydrate: () => void
  remember: (item: Omit<AppRecentItem, 'openedAt'>) => void
}

function isRecentItem(value: unknown): value is AppRecentItem {
  if (!value || typeof value !== 'object') return false
  const item = value as AppRecentItem
  return (item.kind === 'movie' || item.kind === 'book')
    && typeof item.id === 'string'
    && typeof item.title === 'string'
    && typeof item.href === 'string'
}

function readRecents(): AppRecentItem[] {
  try {
    const raw = localStorage.getItem(APP_STORAGE.RECENTS)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isRecentItem)
  } catch {
    return []
  }
}

function writeRecents(items: AppRecentItem[]) {
  try {
    localStorage.setItem(APP_STORAGE.RECENTS, JSON.stringify(items))
  } catch {
    return
  }
}

export const useAppRecentsStore = create<AppRecentsState>()(
  devtools(
    (set, get) => ({
      items: [],
      hydrated: false,
      hydrate: () => {
        if (get().hydrated) return
        set({ items: readRecents(), hydrated: true })
      },
      remember: (item) => {
        const next = [
          { ...item, openedAt: Date.now() },
          ...get().items.filter((entry) => !(entry.kind === item.kind && entry.id === item.id)),
        ].slice(0, APP_RECENTS_LIMIT)
        writeRecents(next)
        set({ items: next, hydrated: true })
      },
    }),
    { name: 'app-recents-store' },
  ),
)
