'use client'

import { useEffect, useState, type ReactNode } from 'react'

interface WebOnlyProps {
  children: ReactNode
}

export function WebOnly({ children }: WebOnlyProps) {
  const [isNativeApp, setIsNativeApp] = useState<boolean | null>(null)

  useEffect(() => {
    setIsNativeApp(navigator.userAgent.includes('FaroCatolicoApp/'))
  }, [])

  if (isNativeApp !== false) return null

  return children
}
