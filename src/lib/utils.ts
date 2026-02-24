import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { YOUTUBE_NOCOOKIE_BASE, YOUTUBE_THUMBNAIL_BASE } from '@/lib/constants'

/** Combina clases de Tailwind evitando conflictos */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

/** Construye la URL de embed de YouTube (privacy-enhanced) */
export const getYouTubeEmbedUrl = (youtubeId: string) =>
  `${YOUTUBE_NOCOOKIE_BASE}/${youtubeId}?rel=0&modestbranding=1`

/** Obtiene la thumbnail de YouTube en máxima calidad disponible */
export const getYouTubeThumbnail = (youtubeId: string) =>
  `${YOUTUBE_THUMBNAIL_BASE}/${youtubeId}/maxresdefault.jpg`

/** Formatea segundos como "MM:SS" */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/** Trunca texto a una longitud máxima, agregando elipsis */
export const truncateText = (text: string, maxLength: number): string =>
  text.length <= maxLength ? text : `${text.slice(0, maxLength).trimEnd()}…`
