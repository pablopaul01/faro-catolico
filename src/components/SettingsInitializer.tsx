'use client'

import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/useSettingsStore'

interface SettingsInitializerProps {
  copyrightMode: boolean
}

export function SettingsInitializer({ copyrightMode }: SettingsInitializerProps) {
  const setCopyrightMode = useSettingsStore((s) => s.setCopyrightMode)
  useEffect(() => {
    setCopyrightMode(copyrightMode)
  }, [copyrightMode, setCopyrightMode])
  return null
}
