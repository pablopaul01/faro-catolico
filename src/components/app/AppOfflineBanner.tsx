'use client'

import { useEffect, useState } from 'react'

export function AppOfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const sync = () => setIsOnline(navigator.onLine)
    sync()
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="app-offline-banner" role="status">
      Sin conexión. Revisá tu red para seguir navegando.
    </div>
  )
}
