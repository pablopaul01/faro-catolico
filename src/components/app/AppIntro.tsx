'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { SITE_NAME } from '@/lib/constants'

const INTRO_KEY = 'faro-app-intro-seen'
const INTRO_MS = 1800

export function AppIntro() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || sessionStorage.getItem(INTRO_KEY) === '1') return

    setVisible(true)
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_KEY, '1')
      setVisible(false)
    }, INTRO_MS)

    return () => window.clearTimeout(timer)
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
