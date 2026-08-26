'use client'

import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function AppBackHandler() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const listener = App.addListener('backButton', () => {
      if (pathname !== '/app-home') {
        router.back()
        return
      }

      void App.exitApp()
    })

    return () => {
      void listener.then((handle) => handle.remove())
    }
  }, [pathname, router])

  return null
}
