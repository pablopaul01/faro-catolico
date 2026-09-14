'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronsLeft, ChevronsRight, Pause, Play } from 'lucide-react'
import {
  PLAYER_CONTROLS_HIDE_MS,
  YOUTUBE_IFRAME_API_SRC,
  YOUTUBE_TV_SEEK_SECONDS,
} from '@/lib/constants'
import { isTvDevice } from '@/lib/tv'

const YOUTUBE_STATE_ENDED = 0
const YOUTUBE_STATE_PLAYING = 1
const YOUTUBE_STATE_PAUSED = 2
const KEYCODE_DPAD_LEFT = 21
const KEYCODE_DPAD_RIGHT = 22
const KEYCODE_DPAD_CENTER = 23
const KEYCODE_ENTER = 66
const KEYCODE_MEDIA_PLAY_PAUSE = 85
const KEYCODE_MEDIA_PAUSE = 127
const KEYCODE_MEDIA_PLAY = 126

type Cue = 'play' | 'pause' | 'back' | 'forward'

interface YouTubePlayer {
  playVideo: () => void
  pauseVideo: () => void
  getPlayerState: () => number
  getCurrentTime: () => number
  getDuration: () => number
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  destroy: () => void
}

interface YouTubeApi {
  Player: new (
    elementId: string,
    options: {
      events?: {
        onReady?: () => void
        onStateChange?: (event: { data: number }) => void
      }
    },
  ) => YouTubePlayer
}

interface YouTubeWindow extends Window {
  YT?: YouTubeApi
  onYouTubeIframeAPIReady?: () => void
}

let youtubeApiPromise: Promise<YouTubeApi> | null = null

function getYouTubeWindow() {
  return window as YouTubeWindow
}

function loadYouTubeIframeApi() {
  const youtubeWindow = getYouTubeWindow()
  if (youtubeWindow.YT?.Player) return Promise.resolve(youtubeWindow.YT)
  if (youtubeApiPromise) return youtubeApiPromise

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previous = youtubeWindow.onYouTubeIframeAPIReady
    youtubeWindow.onYouTubeIframeAPIReady = () => {
      previous?.()
      const api = getYouTubeWindow().YT
      if (!api?.Player) {
        youtubeApiPromise = null
        reject(new Error('YouTube iframe API missing Player'))
        return
      }
      resolve(api)
    }

    if (document.querySelector(`script[src="${YOUTUBE_IFRAME_API_SRC}"]`)) {
      if (youtubeWindow.YT?.Player) resolve(youtubeWindow.YT)
      return
    }

    const script = document.createElement('script')
    script.src = YOUTUBE_IFRAME_API_SRC
    script.async = true
    script.onerror = () => {
      youtubeApiPromise = null
      reject(new Error('YouTube iframe API failed to load'))
    }
    document.head.appendChild(script)
  })

  return youtubeApiPromise
}

function isToggleKey(event: KeyboardEvent) {
  return event.key === 'Enter'
    || event.key === ' '
    || event.key === 'NumpadEnter'
    || event.key === 'MediaPlayPause'
    || event.keyCode === KEYCODE_DPAD_CENTER
    || event.keyCode === KEYCODE_ENTER
    || event.keyCode === KEYCODE_MEDIA_PLAY_PAUSE
}

function isPlayKey(event: KeyboardEvent) {
  return event.key === 'MediaPlay' || event.keyCode === KEYCODE_MEDIA_PLAY
}

function isPauseKey(event: KeyboardEvent) {
  return event.key === 'MediaPause' || event.keyCode === KEYCODE_MEDIA_PAUSE
}

function isSeekLeft(event: KeyboardEvent) {
  return event.key === 'ArrowLeft' || event.keyCode === KEYCODE_DPAD_LEFT
}

function isSeekRight(event: KeyboardEvent) {
  return event.key === 'ArrowRight' || event.keyCode === KEYCODE_DPAD_RIGHT
}

function isOverlayKey(event: KeyboardEvent) {
  return event.key === 'ArrowUp' || event.key === 'ArrowDown'
}

export function AppYouTubeTvControls({ iframeId }: { iframeId: string }) {
  const [isTv, setIsTv] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [cue, setCue] = useState<Cue>('pause')
  const playerRef = useRef<YouTubePlayer | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setIsTv(isTvDevice())
  }, [])

  useEffect(() => {
    if (!isTv) return

    let cancelled = false
    let player: YouTubePlayer | null = null

    void loadYouTubeIframeApi()
      .then((api) => {
        if (cancelled || !document.getElementById(iframeId)) return

        player = new api.Player(iframeId, {
          events: {
            onReady: () => {
              if (cancelled) return
              playerRef.current = player
              setIsReady(true)
            },
            onStateChange: (event) => {
              if (cancelled) return
              const paused = event.data === YOUTUBE_STATE_PAUSED || event.data === YOUTUBE_STATE_ENDED
              setIsPaused(paused)
              setCue(paused ? 'play' : 'pause')
            },
          },
        })
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
      playerRef.current = null
      player?.destroy()
    }
  }, [iframeId, isTv])

  useEffect(() => {
    if (!isTv || !isReady) return

    const holdFocus = () => {
      const playback = document.querySelector<HTMLElement>('.app-playback')
      const active = document.activeElement
      if (!playback || active === playback) return
      if (active instanceof HTMLIFrameElement) active.blur()
      playback.focus({ preventScroll: true })
    }

    holdFocus()
    document.addEventListener('focusin', holdFocus)
    return () => document.removeEventListener('focusin', holdFocus)
  }, [isReady, isTv])

  useEffect(() => {
    if (!isTv || !isReady) return

    const clearHideTimer = () => {
      if (!hideTimerRef.current) return
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }

    const showOverlay = (nextCue: Cue, keep: boolean) => {
      setCue(nextCue)
      setIsVisible(true)
      clearHideTimer()
      if (keep) return
      hideTimerRef.current = setTimeout(() => setIsVisible(false), PLAYER_CONTROLS_HIDE_MS)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const player = playerRef.current
      if (!player) return

      if (isToggleKey(event)) {
        event.preventDefault()
        event.stopPropagation()
        const playing = player.getPlayerState() === YOUTUBE_STATE_PLAYING
        if (playing) {
          player.pauseVideo()
          setIsPaused(true)
          showOverlay('play', true)
          return
        }
        player.playVideo()
        setIsPaused(false)
        showOverlay('pause', false)
        return
      }

      if (isPauseKey(event)) {
        event.preventDefault()
        event.stopPropagation()
        player.pauseVideo()
        setIsPaused(true)
        showOverlay('play', true)
        return
      }

      if (isPlayKey(event)) {
        event.preventDefault()
        event.stopPropagation()
        player.playVideo()
        setIsPaused(false)
        showOverlay('pause', false)
        return
      }

      if (isSeekLeft(event) || isSeekRight(event)) {
        event.preventDefault()
        event.stopPropagation()
        const delta = isSeekLeft(event) ? -YOUTUBE_TV_SEEK_SECONDS : YOUTUBE_TV_SEEK_SECONDS
        const duration = player.getDuration()
        const nextTime = Math.min(duration, Math.max(0, player.getCurrentTime() + delta))
        player.seekTo(nextTime, true)
        const keep = player.getPlayerState() !== YOUTUBE_STATE_PLAYING
        showOverlay(isSeekLeft(event) ? 'back' : 'forward', keep)
        return
      }

      if (isOverlayKey(event)) {
        event.preventDefault()
        event.stopPropagation()
        const keep = player.getPlayerState() !== YOUTUBE_STATE_PLAYING
        showOverlay(keep ? 'play' : 'pause', keep)
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      clearHideTimer()
    }
  }, [isReady, isTv])

  if (!isTv || !isReady || (!isVisible && !isPaused)) return null

  const Icon = cue === 'back'
    ? ChevronsLeft
    : cue === 'forward'
      ? ChevronsRight
      : cue === 'play'
        ? Play
        : Pause

  return (
    <div className={`app-player-controls${isVisible || isPaused ? ' app-player-controls-visible' : ''}`}>
      <div className="app-player-controls-badge" aria-hidden="true">
        <Icon size={34} fill={cue === 'play' || cue === 'pause' ? 'currentColor' : 'none'} />
      </div>
    </div>
  )
}
