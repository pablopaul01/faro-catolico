export const TV_MIN_WIDTH = 780
export const TV_MEDIA_QUERY = `(min-width: ${TV_MIN_WIDTH}px)`

export function isTvDevice() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(TV_MEDIA_QUERY).matches
}

export function applyTvMode() {
  const isTv = isTvDevice()
  document.documentElement.classList.toggle('tv-mode', isTv)
  return isTv
}

export const TV_BOOTSTRAP_SCRIPT =
  `(function(){try{document.documentElement.classList.toggle('tv-mode',matchMedia('${TV_MEDIA_QUERY}').matches)}catch(e){}})()`
