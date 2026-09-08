'use client'

import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { APP_ROUTES } from '@/lib/constants'
import { canGoBack, isAppHomePath } from '@/lib/app-session'

export function AppBackHandler() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (Capacitor.getPlatform() === 'web') return

    void App.toggleBackButtonHandler({ enabled: true }).catch(() => undefined)

    const listener = App.addListener('backButton', () => {
      if (isAppHomePath(pathname)) {
        void App.exitApp()
        return
      }

      if (canGoBack()) {
        router.back()
        return
      }

      router.replace(APP_ROUTES.HOME)
    })

    return () => {
      void listener.then((handle) => handle.remove())
    }
  }, [pathname, router])

  return null
}
