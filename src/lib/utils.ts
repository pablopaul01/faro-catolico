import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { YOUTUBE_NOCOOKIE_BASE, YOUTUBE_THUMBNAIL_BASE, DAILYMOTION_EMBED_BASE, DAILYMOTION_THUMBNAIL_BASE } from '@/lib/constants'

/** Combina clases de Tailwind evitando conflictos */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

/** Construye la URL de embed de YouTube (privacy-enhanced) */
export const getYouTubeEmbedUrl = (youtubeId: string) =>
  `${YOUTUBE_NOCOOKIE_BASE}/${youtubeId}?rel=0&modestbranding=1`

/** Obtiene la thumbnail de YouTube en máxima calidad disponible */
export const getYouTubeThumbnail = (youtubeId: string) =>
  `${YOUTUBE_THUMBNAIL_BASE}/${youtubeId}/maxresdefault.jpg`

/** Construye la URL de embed de Dailymotion */
export const getDailymotionEmbedUrl = (id: string) =>
  `${DAILYMOTION_EMBED_BASE}/${id}?autoplay=1&ui-logo=0`

/** Obtiene la thumbnail de Dailymotion */
export const getDailymotionThumbnail = (id: string) =>
  `${DAILYMOTION_THUMBNAIL_BASE}/${id}`

/** Extrae el ID de Dailymotion de una URL o devuelve el string si ya es un ID */
export const extractDailymotionId = (input: string): string => {
  try {
    const url = new URL(input)
    if (url.hostname.includes('dailymotion.com')) {
      // /video/x9jm09m  o  /embed/video/x9jm09m
      const match = url.pathname.match(/\/video\/([a-z0-9]+)/i)
      if (match) return match[1]
    }
  } catch {
    // No es URL válida — asumir que ya es un ID
  }
  return input.trim()
}

/** Formatea segundos como "MM:SS" */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/** Trunca texto a una longitud máxima, agregando elipsis */
export const truncateText = (text: string, maxLength: number): string =>
  text.length <= maxLength ? text : `${text.slice(0, maxLength).trimEnd()}…`
