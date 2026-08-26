'use client'

import { useEffect } from 'react'

const FOCUSABLE_SELECTOR = '.app-focus:not([aria-disabled="true"])'

function getDistance(current: DOMRect, candidate: DOMRect, direction: string) {
  const currentCenterX = current.left + current.width / 2
  const currentCenterY = current.top + current.height / 2
  const candidateCenterX = candidate.left + candidate.width / 2
  const candidateCenterY = candidate.top + candidate.height / 2
  const deltaX = candidateCenterX - currentCenterX
  const deltaY = candidateCenterY - currentCenterY

  if (direction === 'left' && deltaX >= -1) return null
  if (direction === 'right' && deltaX <= 1) return null
  if (direction === 'up' && deltaY >= -1) return null
  if (direction === 'down' && deltaY <= 1) return null

  const primary = direction === 'left' || direction === 'right' ? Math.abs(deltaX) : Math.abs(deltaY)
  const secondary = direction === 'left' || direction === 'right' ? Math.abs(deltaY) : Math.abs(deltaX)
  return primary + secondary * 2.5
}

export function AppDpadNavigation() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = event.key.replace('Arrow', '').toLowerCase()
      if (!['left', 'right', 'up', 'down'].includes(direction)) return

      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, select, iframe')) return

      const current = document.activeElement as HTMLElement | null
      if (!current?.matches(FOCUSABLE_SELECTOR)) return

      const currentRect = current.getBoundingClientRect()
      const candidates = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((element) => element !== current)
        .map((element) => ({ element, distance: getDistance(currentRect, element.getBoundingClientRect(), direction) }))
        .filter((candidate): candidate is { element: HTMLElement; distance: number } => candidate.distance !== null)
        .sort((a, b) => a.distance - b.distance)

      const next = candidates[0]?.element
      if (!next) return

      event.preventDefault()
      next.focus({ preventScroll: true })
      next.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return null
}
