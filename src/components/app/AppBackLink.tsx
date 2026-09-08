'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { canGoBack } from '@/lib/app-session'

interface AppBackLinkProps {
  href: string
  className?: string
  children: ReactNode
}

export function AppBackLink({ href, className, children }: AppBackLinkProps) {
  const router = useRouter()

  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (!canGoBack()) return
        event.preventDefault()
        router.back()
      }}
    >
      {children}
    </Link>
  )
}
