'use client'

import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const catalogFromDetail = (pathname: string, base: string) => {
  if (pathname === base) return '/app-home'
  if (pathname.startsWith(`${base}/`)) return base
  return null
}

export function AppBackHandler() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (Capacitor.getPlatform() === 'web') return

    void App.toggleBackButtonHandler({ enabled: true }).catch(() => undefined)

    const listener = App.addListener('backButton', () => {
      const playbackMatch = pathname.match(/^\/app-home\/reproducir\/pelicula\/([^/]+)$/)
      if (playbackMatch) {
        router.replace(`/app-home/peliculas/${playbackMatch[1]}`)
        return
      }

      const readerMatch = pathname.match(/^\/app-home\/libros\/([^/]+)\/leer$/)
      if (readerMatch) {
        router.replace(`/app-home/libros/${readerMatch[1]}`)
        return
      }

      const catalog =
        catalogFromDetail(pathname, '/app-home/peliculas') ??
        catalogFromDetail(pathname, '/app-home/libros') ??
        catalogFromDetail(pathname, '/app-home/musica') ??
        catalogFromDetail(pathname, '/app-home/playlists') ??
        catalogFromDetail(pathname, '/app-home/canales')

      if (catalog) {
        router.replace(catalog)
        return
      }

      if (pathname !== '/app-home') {
        router.replace('/app-home')
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
