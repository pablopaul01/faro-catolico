'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { recordAppPath, rememberAppFocus, restoreAppFocus } from '@/lib/app-session'

const FOCUS_SOURCE_SELECTOR = '.app-card, .app-home-hero, .app-catalog-hero, .app-search-results, .app-detail-actions'

export function AppFocusRestore() {
  const pathname = usePathname()

  useEffect(() => {
    recordAppPath(pathname)
  }, [pathname])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const link = target?.closest<HTMLAnchorElement>('a.app-focus')
      if (!link || !link.closest(FOCUS_SOURCE_SELECTOR)) return
      rememberAppFocus(link)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => restoreAppFocus(pathname), 80)
    return () => window.clearTimeout(timer)
  }, [pathname])

  return null
}
