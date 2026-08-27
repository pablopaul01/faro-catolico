'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { SITE_NAME } from '@/lib/constants'

const INTRO_KEY = 'faro-app-intro-v3'
const INTRO_MS = 2800
const FADE_MS = 600

export function AppIntro() {
  const [phase, setPhase] = useState<'hidden' | 'showing' | 'fading'>('hidden')
  const timers = useRef<number[]>([])

  useEffect(() => {
    let cancelled = false

    const hideNativeSplash = async () => {
      if (Capacitor.getPlatform() === 'web') return
      await SplashScreen.hide({ fadeOutDuration: 280 }).catch(() => undefined)
    }

    const schedule = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, ms))
    }

    const run = async () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const alreadySeen = sessionStorage.getItem(INTRO_KEY) === '1'

      if (reduced || alreadySeen) {
        await hideNativeSplash()
        return
      }

      // Hide native splash first
      await hideNativeSplash()
      if (cancelled) return

      // Show intro overlay — CSS animations start cleanly
      setPhase('showing')

      // After all animations complete, start fade-out
      schedule(INTRO_MS, () => {
        if (cancelled) return
        setPhase('fading')
      })

      // After fade-out transition, fully remove
      schedule(INTRO_MS + FADE_MS, () => {
        if (cancelled) return
        sessionStorage.setItem(INTRO_KEY, '1')
        setPhase('hidden')
      })
    }

    void run()

    return () => {
      cancelled = true
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [])

  if (phase === 'hidden') return null

  return (
    <div
      className={`app-intro ${phase === 'fading' ? 'app-intro--leaving' : ''}`}
      role="presentation"
    >
      {/* Lighthouse beam sweep */}
      <div className="app-intro-beam" />

      {/* Concentric light rings */}
      <div className="app-intro-rings">
        <div className="app-intro-ring" />
        <div className="app-intro-ring" />
        <div className="app-intro-ring" />
      </div>

      {/* Logo with glow */}
      <div className="app-intro-mark">
        <div className="app-intro-logo">
          <div className="app-intro-glow" />
          <Image src="/fc-logo.png" alt="" width={160} height={160} priority />
        </div>
        <p className="app-intro-name">{SITE_NAME}</p>
      </div>
    </div>
  )
}
