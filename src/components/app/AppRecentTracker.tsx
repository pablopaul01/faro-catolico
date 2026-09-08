'use client'

import { useEffect } from 'react'
import { useAppRecentsStore, type AppRecentItem } from '@/stores/useAppRecentsStore'

export function AppRecentTracker({ item }: { item: Omit<AppRecentItem, 'openedAt'> }) {
  const remember = useAppRecentsStore((state) => state.remember)

  useEffect(() => {
    remember(item)
  }, [item.href, item.id, item.imageUrl, item.kind, item.subtitle, item.title, remember])

  return null
}
