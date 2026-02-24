import { MUSIC_CATEGORIES } from '@/lib/constants'

// ─────────────────────────────────────────────
// Tipos de categoría de música
// ─────────────────────────────────────────────
export type MusicCategory = (typeof MUSIC_CATEGORIES)[number]

// ─────────────────────────────────────────────
// Categorías dinámicas (películas y libros)
// ─────────────────────────────────────────────
export interface MovieCategory {
  id:        string
  name:      string
  sortOrder: number
  createdAt: string
}

export interface BookCategory {
  id:        string
  name:      string
  sortOrder: number
  createdAt: string
}

export type CategoryFormPayload = { name: string; sortOrder: number }

// ─────────────────────────────────────────────
// Entidades del dominio (camelCase, desacopladas de la DB)
// ─────────────────────────────────────────────
export interface Movie {
  id:            string
  title:         string
  description:   string | null
  youtubeId:     string
  externalUrl:   string | null
  thumbnailUrl:  string | null
  year:          number | null
  categoryId:    string | null
  isPublished:   boolean
  sortOrder:     number
  createdAt:     string
  updatedAt:     string
}

export interface Book {
  id:           string
  title:        string
  author:       string
  description:  string | null
  coverUrl:     string | null
  purchaseUrl:  string | null
  pdfUrl:       string | null
  year:         number | null
  categoryId:   string | null
  isPublished:  boolean
  sortOrder:    number
  createdAt:    string
  updatedAt:    string
}

export interface Song {
  id:           string
  title:        string
  artist:       string
  category:     MusicCategory
  youtubeId:    string | null
  spotifyUrl:   string | null
  externalUrl:  string | null
  thumbnailUrl: string | null
  durationSec:  number | null
  isPublished:  boolean
  sortOrder:    number
  createdAt:    string
  updatedAt:    string
}

// ─────────────────────────────────────────────
// Payloads de formularios (sin campos generados por la DB)
// ─────────────────────────────────────────────
export type MovieFormPayload = Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>
export type BookFormPayload  = Omit<Book,  'id' | 'createdAt' | 'updatedAt'>
export type SongFormPayload  = Omit<Song,  'id' | 'createdAt' | 'updatedAt'>

// ─────────────────────────────────────────────
// Valoraciones
// ─────────────────────────────────────────────
export interface RatingStats {
  avgRating:   number
  ratingCount: number
}
export type RatingsMap = Record<string, RatingStats>  // contentId → stats

// ─────────────────────────────────────────────
// Sugerencias
// ─────────────────────────────────────────────
export interface Suggestion {
  id:        string
  type:      'pelicula' | 'libro' | 'cancion'
  title:     string
  notes:     string | null
  email:     string | null
  status:    'pendiente' | 'revisado'
  createdAt: string
}
