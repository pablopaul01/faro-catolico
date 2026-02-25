// ─────────────────────────────────────────────
// Categorías dinámicas (películas, libros y música)
// ─────────────────────────────────────────────
export interface MusicCategory {
  id:        string
  name:      string
  sortOrder: number
  createdAt: string
}

export interface MovieCategory {
  id:        string
  name:      string
  sortOrder: number
  createdAt: string
}

export interface MoviePlatform {
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
  youtubeId:     string | null
  externalUrl:   string | null
  thumbnailUrl:  string | null
  year:          number | null
  categoryIds:   string[]
  platformIds:   string[]
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
  categoryIds:  string[]
  isPublished:  boolean
  sortOrder:    number
  createdAt:    string
  updatedAt:    string
}

export interface Song {
  id:           string
  title:        string
  artist:       string
  categoryIds:  string[]
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

// ─────────────────────────────────────────────
// Mensajes de contacto
// ─────────────────────────────────────────────
export interface ContactMessage {
  id:        string
  name:      string | null
  email:     string | null
  subject:   string | null
  message:   string
  status:    'no_leido' | 'leido'
  createdAt: string
}

// ─────────────────────────────────────────────
// Propuestas de contenido (submissions)
// ─────────────────────────────────────────────
export interface Submission {
  id:             string
  type:           'pelicula' | 'libro' | 'cancion'
  title:          string
  description:    string | null
  year:           number | null
  youtubeId:      string | null
  externalUrl:    string | null
  thumbnailUrl:   string | null
  author:         string | null
  coverUrl:       string | null
  purchaseUrl:    string | null
  pdfUrl:         string | null
  artist:         string | null
  spotifyUrl:     string | null
  durationSec:    number | null
  categoryIds:    string[]
  platformIds:    string[]
  submitterName:  string | null
  submitterEmail: string | null
  notes:          string | null
  status:         'pendiente' | 'aprobado' | 'rechazado'
  createdAt:      string
}
