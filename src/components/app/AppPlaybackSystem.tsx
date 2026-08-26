'use client'

import { Capacitor } from '@capacitor/core'
import { ScreenOrientation } from '@capacitor/screen-orientation'
import { SystemBars } from '@capacitor/core'
import { useEffect } from 'react'

export function AppPlaybackSystem() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const enterPlaybackMode = async () => {
      await Promise.all([
        ScreenOrientation.lock({ orientation: 'landscape' }),
        SystemBars.hide(),
      ])
    }

    const leavePlaybackMode = async () => {
      await Promise.all([
        ScreenOrientation.unlock(),
        SystemBars.show(),
      ])
    }

    void enterPlaybackMode()
    return () => { void leavePlaybackMode() }
  }, [])

  return null
}
