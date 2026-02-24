import { z } from 'zod'

// ─────────────────────────────────────────────
// Schema para categorías (películas y libros)
// ─────────────────────────────────────────────
export const categorySchema = z.object({
  name:      z.string().min(1, 'El nombre es obligatorio').max(100),
  sortOrder: z.number().int().min(0),
})

export type CategorySchema = z.infer<typeof categorySchema>

// ─────────────────────────────────────────────
// Schema para películas
// ─────────────────────────────────────────────
export const movieSchema = z.object({
  title:        z.string().min(1, 'El título es obligatorio').max(200),
  description:  z.string().max(1000).nullable().optional(),
  youtubeId:    z.string().min(1, 'El ID de YouTube es obligatorio').max(20),
  externalUrl:  z.string().url('Debe ser una URL válida').nullable().optional().or(z.literal('')),
  thumbnailUrl: z.string().url('Debe ser una URL válida').nullable().optional().or(z.literal('')),
  year:         z.number().int().min(1900).max(2100).nullable().optional(),
  categoryId:   z.string().uuid().nullable().optional(),
  // Sin .default() para compatibilidad con react-hook-form: los defaults van en useForm
  isPublished:  z.boolean(),
  sortOrder:    z.number().int().min(0),
})

export type MovieSchema = z.infer<typeof movieSchema>

// ─────────────────────────────────────────────
// Schema para libros
// ─────────────────────────────────────────────
export const bookSchema = z.object({
  title:       z.string().min(1, 'El título es obligatorio').max(200),
  author:      z.string().min(1, 'El autor es obligatorio').max(200),
  description: z.string().max(1000).nullable().optional(),
  coverUrl:    z.string().url('Debe ser una URL válida').nullable().optional().or(z.literal('')),
  purchaseUrl: z.string().url('Debe ser una URL válida').nullable().optional().or(z.literal('')),
  pdfUrl:      z.string().url('Debe ser una URL válida').nullable().optional().or(z.literal('')),
  year:        z.number().int().min(1000).max(2100).nullable().optional(),
  categoryId:  z.string().uuid().nullable().optional(),
  isPublished: z.boolean(),
  sortOrder:   z.number().int().min(0),
})

export type BookSchema = z.infer<typeof bookSchema>

// ─────────────────────────────────────────────
// Schema para canciones
// ─────────────────────────────────────────────
export const songSchema = z.object({
  title:        z.string().min(1, 'El título es obligatorio').max(200),
  artist:       z.string().min(1, 'El artista es obligatorio').max(200),
  categoryId:   z.string().uuid().nullable().optional(),
  youtubeId:    z.string().max(20).nullable().optional(),
  spotifyUrl:   z.string().url('Debe ser una URL válida').nullable().optional().or(z.literal('')),
  externalUrl:  z.string().url('Debe ser una URL válida').nullable().optional().or(z.literal('')),
  thumbnailUrl: z.string().url('Debe ser una URL válida').nullable().optional().or(z.literal('')),
  durationSec:  z.number().int().min(1).nullable().optional(),
  isPublished:  z.boolean(),
  sortOrder:    z.number().int().min(0),
})

export type SongSchema = z.infer<typeof songSchema>

// ─────────────────────────────────────────────
// Schema para sugerencias
// ─────────────────────────────────────────────
export const suggestionSchema = z.object({
  type:  z.enum(['pelicula', 'libro', 'cancion'], { message: 'Selecciona un tipo' }),
  title: z.string().min(1, 'El título es obligatorio').max(200),
  notes: z.string().max(1000).optional(),
  email: z.string().email('Debe ser un email válido').optional().or(z.literal('')),
})

export type SuggestionSchema = z.infer<typeof suggestionSchema>
