'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { isTvDevice } from '@/lib/tv'

interface AppAutoFocusProps {
  children: ReactNode
  className?: string
}

export function AppAutoFocus({ children, className }: AppAutoFocusProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isTv = isTvDevice()
    if (!isTv || !ref.current) return

    const timer = setTimeout(() => {
      const focusable = ref.current?.querySelector<HTMLElement>('a, button, [tabindex="0"]')
      focusable?.focus()
    }, 120)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
