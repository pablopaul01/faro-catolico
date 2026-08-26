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

    const listener = App.addListener('backButton', ({ canGoBack }) => {
      if (pathname.startsWith('/app-home/reproducir/')) {
        router.replace(pathname.replace('/reproducir/pelicula/', '/peliculas/'))
        return
      }

      if (pathname.startsWith('/app-home/peliculas/')) {
        router.replace('/app-home/peliculas')
        return
      }

      if (pathname.startsWith('/app-home/libros/')) {
        router.replace('/app-home/libros')
        return
      }

      if (pathname.startsWith('/app-home/musica/')) {
        router.replace('/app-home/musica')
        return
      }

      if (pathname.startsWith('/app-home/playlists/')) {
        router.replace('/app-home/playlists')
        return
      }

      if (pathname.startsWith('/app-home/canales/')) {
        router.replace('/app-home/canales')
        return
      }

      if (pathname !== '/app-home') {
        router.replace('/app-home')
        return
      }

      if (!canGoBack) void App.exitApp()
    })

    return () => {
      void listener.then((handle) => handle.remove())
    }
  }, [pathname, router])

  return null
}
