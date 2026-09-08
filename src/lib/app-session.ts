import { APP_ROUTES, APP_STORAGE } from '@/lib/constants'

interface AppFocusMemory {
  pathname: string
  href: string
  scrollY: number
  railId: string | null
  railScroll: number
}

const pathStack: string[] = []
let restoredFor: string | null = null

export function recordAppPath(pathname: string) {
  const previous = pathStack.at(-2)
  if (previous === pathname) {
    pathStack.pop()
    return
  }
  if (pathStack.at(-1) !== pathname) pathStack.push(pathname)
}

export function canGoBack() {
  return pathStack.length > 1
}

export function isAppHomePath(pathname: string) {
  return pathname === APP_ROUTES.HOME || pathname === `${APP_ROUTES.HOME}/`
}

function readFocusMemory(): AppFocusMemory | null {
  try {
    const raw = sessionStorage.getItem(APP_STORAGE.FOCUS)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AppFocusMemory
    if (!parsed.pathname || !parsed.href) return null
    return parsed
  } catch {
    return null
  }
}

export function rememberAppFocus(link: HTMLAnchorElement) {
  const href = link.getAttribute('href')
  if (!href) return

  const rail = link.closest('.app-rail')
  const scroller = rail?.querySelector('.app-rail-scroller')
  restoredFor = null
  try {
    sessionStorage.setItem(APP_STORAGE.FOCUS, JSON.stringify({
      pathname: window.location.pathname,
      href,
      scrollY: window.scrollY,
      railId: rail?.id ?? null,
      railScroll: scroller instanceof HTMLElement ? scroller.scrollLeft : 0,
    } satisfies AppFocusMemory))
  } catch {
    return
  }
}

export function hasPendingFocusRestore(pathname: string) {
  const memory = readFocusMemory()
  return Boolean(memory && memory.pathname === pathname && restoredFor !== pathname)
}

export function restoreAppFocus(pathname: string) {
  const memory = readFocusMemory()
  if (!memory || memory.pathname !== pathname || restoredFor === pathname) return

  restoredFor = pathname

  if (memory.railId) {
    const scroller = document.querySelector(`#${CSS.escape(memory.railId)} .app-rail-scroller`)
    if (scroller instanceof HTMLElement) scroller.scrollLeft = memory.railScroll
  }

  window.scrollTo(0, memory.scrollY)
  const target = document.querySelector<HTMLElement>(`a.app-focus[href="${CSS.escape(memory.href)}"]`)
  target?.focus({ preventScroll: true })
}
