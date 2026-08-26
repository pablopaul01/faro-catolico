'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { SITE_NAME } from '@/lib/constants'

const INTRO_KEY = 'faro-app-intro-v2'
const INTRO_MS = 2200

export function AppIntro() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let cancelled = false
    let timer: number | undefined

    const hideNativeSplash = async () => {
      if (Capacitor.getPlatform() === 'web') return
      await SplashScreen.hide({ fadeOutDuration: 280 }).catch(() => undefined)
    }

    const run = async () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const alreadySeen = sessionStorage.getItem(INTRO_KEY) === '1'

      await hideNativeSplash()
      if (cancelled || reduced || alreadySeen) return

      setVisible(true)
      timer = window.setTimeout(() => {
        if (cancelled) return
        sessionStorage.setItem(INTRO_KEY, '1')
        setVisible(false)
      }, INTRO_MS)
    }

    void run()
    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="app-intro" role="presentation">
      <div className="app-intro-mark">
        <Image src="/fc-logo.png" alt="" width={160} height={160} priority />
        <p className="font-display text-2xl text-accent">{SITE_NAME}</p>
      </div>
    </div>
  )
}
