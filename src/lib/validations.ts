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
  youtubeId:    z.string().max(20).optional().or(z.literal('')),
  externalUrl:  z.string().url('Debe ser una URL válida').nullable().optional().or(z.literal('')),
  thumbnailUrl: z.string().url('Debe ser una URL válida').nullable().optional().or(z.literal('')),
  year:         z.number().int().min(1900).max(2100).nullable().optional(),
  categoryIds:  z.array(z.string().uuid()),
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
  categoryIds: z.array(z.string().uuid()),
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
  categoryIds:  z.array(z.string().uuid()),
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

// ─────────────────────────────────────────────
// Schema para propuestas de contenido
// ─────────────────────────────────────────────
export const submissionSchema = z.object({
  type:           z.enum(['pelicula', 'libro', 'cancion'], { message: 'Selecciona un tipo' }),
  title:          z.string().min(1, 'El título es obligatorio').max(200),
  categoryIds:    z.array(z.string().uuid()),
  platformIds:    z.array(z.string().uuid()),
  description:    z.string().max(2000).optional(),
  year:           z.coerce.number().int().min(1900).max(2100).optional().or(z.literal('')),
  youtubeId:      z.string().max(30).optional(),
  externalUrl:    z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  thumbnailUrl:   z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  author:         z.string().max(200).optional(),
  coverUrl:       z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  purchaseUrl:    z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  pdfUrl:         z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  artist:         z.string().max(200).optional(),
  spotifyUrl:     z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  submitterName:  z.string().max(100).optional(),
  submitterEmail: z.string().email('Debe ser un email válido').optional().or(z.literal('')),
  notes:          z.string().max(500).optional(),
})

export type SubmissionSchema = z.infer<typeof submissionSchema>

// ─────────────────────────────────────────────
// Schema para mensajes de contacto
// ─────────────────────────────────────────────
export const contactSchema = z.object({
  name:    z.string().max(100).optional(),
  email:   z.string().email('Debe ser un email válido').optional().or(z.literal('')),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, 'El mensaje es obligatorio').max(2000),
})

export type ContactSchema = z.infer<typeof contactSchema>
