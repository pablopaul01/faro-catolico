'use client'

import { useInView } from '@/hooks/useInView'

interface FadeInWhenVisibleProps {
  children: React.ReactNode
  index?: number
  className?: string
}

export const FadeInWhenVisible = ({ children, index = 0, className }: FadeInWhenVisibleProps) => {
  const { ref, inView } = useInView()
  const delay = Math.min(index, 5) * 0.06

  return (
    <div
      ref={ref}
      className={`${inView ? 'animate-slide-up' : 'opacity-0'} ${className ?? ''}`}
      style={inView ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  )
}
