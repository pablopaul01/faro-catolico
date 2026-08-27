'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface AppAutoFocusProps {
  children: ReactNode
  className?: string
}

export function AppAutoFocus({ children, className }: AppAutoFocusProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isTv = matchMedia('(min-width: 1000px) and (hover: none)').matches
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
