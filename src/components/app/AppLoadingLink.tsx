'use client'

import Link, { type LinkProps } from 'next/link'
import { useState, type MouseEvent, type ReactNode } from 'react'

interface AppLoadingLinkProps extends LinkProps {
  children: ReactNode
  loadingLabel: string
  className?: string
}

export function AppLoadingLink({ children, loadingLabel, className, ...props }: AppLoadingLinkProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) setIsLoading(true)
  }

  return (
    <Link {...props} onClick={handleClick} className={className} aria-label={isLoading ? loadingLabel : undefined}>
      {isLoading ? <><span className="app-loading-dot" aria-hidden /> {loadingLabel}</> : children}
    </Link>
  )
}
