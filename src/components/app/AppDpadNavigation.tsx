'use client'

import { useEffect } from 'react'

const FOCUSABLE_SELECTOR = '.app-focus:not([aria-disabled="true"])'
const ROW_SELECTOR = '.app-header, .app-hero, .app-rail, .app-catalog-heading, .app-catalog-grid, .app-detail'
const HORIZONTAL_GROUP_SELECTOR = '.app-rail-scroller, .app-hero, .app-header, .app-catalog-grid, .app-catalog-heading'
const CHROME_SELECTOR = '.app-header, .app-bottom-nav'

type Direction = 'left' | 'right' | 'up' | 'down'

function isDisplayed(element: HTMLElement) {
  return element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden'
}

function isChrome(element: HTMLElement) {
  return Boolean(element.closest(CHROME_SELECTOR))
}

function getVisibleFocusables() {
  return Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isDisplayed)
}

function getFocusablesIn(container: ParentNode) {
  return getVisibleFocusables().filter((element) => container.contains(element))
}

function getRow(element: HTMLElement) {
  return element.closest<HTMLElement>(ROW_SELECTOR)
}

function sortByX(elements: HTMLElement[]) {
  return [...elements].sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left)
}

function horizontalOverlap(a: DOMRect, b: DOMRect) {
  return Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
}

function closestByColumn(current: HTMLElement, candidates: HTMLElement[]) {
  if (candidates.length === 0) return null

  const currentRect = current.getBoundingClientRect()
  const currentCenterX = currentRect.left + currentRect.width / 2

  return [...candidates].sort((a, b) => {
    const aRect = a.getBoundingClientRect()
    const bRect = b.getBoundingClientRect()
    const overlapDelta = horizontalOverlap(currentRect, bRect) - horizontalOverlap(currentRect, aRect)
    if (overlapDelta !== 0) return overlapDelta

    const aDx = Math.abs(aRect.left + aRect.width / 2 - currentCenterX)
    const bDx = Math.abs(bRect.left + bRect.width / 2 - currentCenterX)
    return aDx - bDx
  })[0] ?? null
}

function pickInRow(row: HTMLElement, current: HTMLElement) {
  const scroller = row.matches('.app-rail') ? row.querySelector('.app-rail-scroller') : null
  const preferred = scroller ? getFocusablesIn(scroller) : getFocusablesIn(row)
  return closestByColumn(current, preferred.length > 0 ? preferred : getFocusablesIn(row))
}

function collectRows() {
  const rows: HTMLElement[] = []
  const seen = new Set<HTMLElement>()

  for (const element of getVisibleFocusables()) {
    const row = getRow(element)
    if (!row || seen.has(row)) continue
    seen.add(row)
    rows.push(row)
  }

  return rows
}

function getDistance(current: DOMRect, candidate: DOMRect, direction: Direction) {
  const currentCenterX = current.left + current.width / 2
  const currentCenterY = current.top + current.height / 2
  const deltaX = candidate.left + candidate.width / 2 - currentCenterX
  const deltaY = candidate.top + candidate.height / 2 - currentCenterY

  if (direction === 'left' && deltaX >= -1) return null
  if (direction === 'right' && deltaX <= 1) return null
  if (direction === 'up' && deltaY >= -1) return null
  if (direction === 'down' && deltaY <= 1) return null

  const primary = direction === 'left' || direction === 'right' ? Math.abs(deltaX) : Math.abs(deltaY)
  const secondary = direction === 'left' || direction === 'right' ? Math.abs(deltaY) : Math.abs(deltaX)
  return primary + secondary * 2.5
}

function pickSpatial(current: HTMLElement, pool: HTMLElement[], direction: Direction) {
  const currentRect = current.getBoundingClientRect()
  let best: HTMLElement | null = null
  let bestScore = Infinity

  for (const element of pool) {
    if (element === current) continue
    const score = getDistance(currentRect, element.getBoundingClientRect(), direction)
    if (score === null || score >= bestScore) continue
    bestScore = score
    best = element
  }

  return best
}

function step(pool: HTMLElement[], current: HTMLElement, direction: 'left' | 'right') {
  const index = pool.indexOf(current)
  if (index < 0) return null
  return pool[direction === 'right' ? index + 1 : index - 1] ?? null
}

function groupGridRows(elements: HTMLElement[]) {
  const sorted = [...elements].sort((a, b) => {
    const aRect = a.getBoundingClientRect()
    const bRect = b.getBoundingClientRect()
    const dy = aRect.top - bRect.top
    if (Math.abs(dy) > 24) return dy
    return aRect.left - bRect.left
  })

  const rows: HTMLElement[][] = []

  for (const element of sorted) {
    const top = element.getBoundingClientRect().top
    const last = rows.at(-1)
    if (!last || Math.abs(top - last[0].getBoundingClientRect().top) > 24) {
      rows.push([element])
      continue
    }
    last.push(element)
  }

  return rows
}

function moveInGrid(current: HTMLElement, grid: HTMLElement, direction: Direction) {
  const rows = groupGridRows(getFocusablesIn(grid))
  const rowIndex = rows.findIndex((row) => row.includes(current))
  if (rowIndex < 0) return null

  const colIndex = rows[rowIndex].indexOf(current)

  if (direction === 'left' || direction === 'right') {
    return rows[rowIndex][colIndex + (direction === 'right' ? 1 : -1)] ?? null
  }

  const nextRow = rows[rowIndex + (direction === 'down' ? 1 : -1)]
  if (!nextRow) return null
  return nextRow[Math.min(colIndex, nextRow.length - 1)] ?? null
}

function getRailSeeAll(rail: HTMLElement) {
  const scroller = rail.querySelector('.app-rail-scroller')
  if (!scroller) return null
  return getFocusablesIn(rail).find((element) => !scroller.contains(element)) ?? null
}

function moveHorizontal(current: HTMLElement, direction: 'left' | 'right') {
  const grid = current.closest<HTMLElement>('.app-catalog-grid')
  if (grid) return moveInGrid(current, grid, direction)

  const scroller = current.closest('.app-rail-scroller')
  if (scroller) {
    return step(sortByX(getFocusablesIn(scroller)), current, direction)
  }

  const group = current.closest<HTMLElement>(HORIZONTAL_GROUP_SELECTOR)
  const pool = sortByX(
    group
      ? getFocusablesIn(group)
      : getVisibleFocusables().filter((element) => isChrome(element) === isChrome(current)),
  )
  return step(pool, current, direction)
}

function moveVertical(current: HTMLElement, direction: 'up' | 'down') {
  const row = getRow(current)

  if (row?.matches('.app-catalog-grid')) {
    const within = moveInGrid(current, row, direction)
    if (within) return within
  } else if (row && !row.matches('.app-rail')) {
    const within = pickSpatial(current, getFocusablesIn(row), direction)
    if (within) return within
  }

  if (row?.matches('.app-rail') && current.closest('.app-rail-scroller') && direction === 'up') {
    const seeAll = getRailSeeAll(row)
    if (seeAll) return seeAll
  }

  if (row?.matches('.app-rail') && !current.closest('.app-rail-scroller') && direction === 'down') {
    const card = pickInRow(row, current)
    if (card) return card
  }

  if (!row) {
    const visible = getVisibleFocusables()
    const content = visible.filter((element) => !isChrome(element))
    return pickSpatial(current, content, direction)
      ?? (direction === 'up' ? pickSpatial(current, visible.filter(isChrome), direction) : null)
  }

  const rows = collectRows()
  const nextRow = rows[rows.indexOf(row) + (direction === 'up' ? -1 : 1)]
  if (!nextRow) return null
  return pickInRow(nextRow, current)
}

function reveal(element: HTMLElement) {
  element.focus({ preventScroll: true })
  const hero = element.closest<HTMLElement>('.app-hero')
  if (hero) {
    hero.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' })
    return
  }
  element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' })
}

export function AppDpadNavigation() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.replace('Arrow', '').toLowerCase()
      if (!['left', 'right', 'up', 'down'].includes(key)) return

      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, select, iframe')) return

      const current = document.activeElement as HTMLElement | null
      if (!current?.matches(FOCUSABLE_SELECTOR)) return

      const direction = key as Direction
      const next = direction === 'left' || direction === 'right'
        ? moveHorizontal(current, direction)
        : moveVertical(current, direction)

      if (!next) return

      event.preventDefault()
      reveal(next)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return null
}
