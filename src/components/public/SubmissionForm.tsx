'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle } from 'lucide-react'
import { submissionSchema, type SubmissionSchema } from '@/lib/validations'
import { createSubmission } from '@/services/submissions.service'
import { cn } from '@/lib/utils'

const inputClass = 'w-full px-3 py-2.5 rounded-sm bg-primary border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm'
const labelClass = 'block text-sm text-light/70 mb-1'

function Field({ label, hint, error, children }: {
  label: string; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {hint && <p className="text-xs text-light/40 mb-1">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

export function SubmissionForm() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<SubmissionSchema>({
    resolver: zodResolver(submissionSchema) as unknown as Resolver<SubmissionSchema>,
    defaultValues: { type: 'pelicula' },
  })

  const tipo = watch('type')

  const onSubmit = async (data: SubmissionSchema) => {
    await createSubmission({
      type:           data.type,
      title:          data.title,
      description:    data.description     || undefined,
      year:           typeof data.year === 'number' ? data.year : undefined,
      youtubeId:      data.youtubeId       || undefined,
      externalUrl:    data.externalUrl     || undefined,
      thumbnailUrl:   data.thumbnailUrl    || undefined,
      author:         data.author          || undefined,
      coverUrl:       data.coverUrl        || undefined,
      purchaseUrl:    data.purchaseUrl     || undefined,
      pdfUrl:         data.pdfUrl          || undefined,
      artist:         data.artist          || undefined,
      spotifyUrl:     data.spotifyUrl      || undefined,
      submitterName:  data.submitterName   || undefined,
      submitterEmail: data.submitterEmail  || undefined,
      notes:          data.notes           || undefined,
    })
    reset()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-secondary border border-border rounded-card p-8 text-center animate-fade-in">
        <CheckCircle size={40} className="text-accent mx-auto mb-4" />
        <h2 className="font-display text-xl text-light mb-2">¡Gracias por tu propuesta!</h2>
        <p className="text-light/50 text-sm mb-6">
          Tu contenido fue enviado y está pendiente de revisión por un moderador.
          Si es aprobado, aparecerá en el catálogo de Faro Católico.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-sm text-accent hover:text-accent/80 transition-colors"
        >
          Enviar otra propuesta
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Tipo */}
      <Field label="Tipo de contenido *" error={errors.type?.message}>
        <select {...register('type')} className={inputClass}>
          <option value="pelicula">Película</option>
          <option value="libro">Libro</option>
          <option value="cancion">Canción</option>
        </select>
      </Field>

      {/* Título */}
      <Field label="Título *" error={errors.title?.message}>
        <input
          {...register('title')}
          placeholder={tipo === 'pelicula' ? 'Ej: La Pasión de Cristo' : tipo === 'libro' ? 'Ej: El Señor del Mundo' : 'Ej: Ave María'}
          className={inputClass}
        />
      </Field>

      {/* Campos por tipo */}
      {tipo === 'pelicula' && (
        <Field label="ID de YouTube" hint="El código al final de la URL: youtube.com/watch?v=ESTE_CODIGO" error={errors.youtubeId?.message}>
          <input {...register('youtubeId')} placeholder="Ej: dQw4w9WgXcQ" className={inputClass} />
        </Field>
      )}

      {tipo === 'libro' && (
        <>
          <Field label="Autor *" error={errors.author?.message}>
            <input {...register('author')} placeholder="Ej: Robert Hugh Benson" className={inputClass} />
          </Field>
          <Field label="URL de imagen de portada" error={errors.coverUrl?.message}>
            <input {...register('coverUrl')} placeholder="https://..." className={inputClass} />
          </Field>
          <Field label="URL de compra" error={errors.purchaseUrl?.message}>
            <input {...register('purchaseUrl')} placeholder="https://..." className={inputClass} />
          </Field>
          <Field label="URL de PDF gratuito" error={errors.pdfUrl?.message}>
            <input {...register('pdfUrl')} placeholder="https://..." className={inputClass} />
          </Field>
        </>
      )}

      {tipo === 'cancion' && (
        <>
          <Field label="Artista *" error={errors.artist?.message}>
            <input {...register('artist')} placeholder="Ej: Coro Tierra Santa" className={inputClass} />
          </Field>
          <Field label="ID de YouTube" hint="El código al final de la URL: youtube.com/watch?v=ESTE_CODIGO" error={errors.youtubeId?.message}>
            <input {...register('youtubeId')} placeholder="Ej: dQw4w9WgXcQ" className={inputClass} />
          </Field>
          <Field label="URL de Spotify" error={errors.spotifyUrl?.message}>
            <input {...register('spotifyUrl')} placeholder="https://open.spotify.com/..." className={inputClass} />
          </Field>
        </>
      )}

      {/* Campos comunes opcionales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Año" error={errors.year?.message}>
          <input {...register('year')} type="number" placeholder="Ej: 2004" className={inputClass} />
        </Field>
        <Field label="URL de imagen / thumbnail" error={errors.thumbnailUrl?.message}>
          <input {...register('thumbnailUrl')} placeholder="https://..." className={inputClass} />
        </Field>
      </div>

      <Field label="Descripción" error={errors.description?.message}>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Breve descripción del contenido..."
          className={cn(inputClass, 'resize-none')}
        />
      </Field>

      <Field label="URL externa" hint="Link a la plataforma donde se puede ver/leer/escuchar" error={errors.externalUrl?.message}>
        <input {...register('externalUrl')} placeholder="https://..." className={inputClass} />
      </Field>

      {/* Sección del remitente */}
      <div className="border-t border-border pt-5">
        <p className="text-xs text-light/40 mb-4 uppercase tracking-wider">Tus datos (opcionales)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Tu nombre" error={errors.submitterName?.message}>
            <input {...register('submitterName')} placeholder="Nombre" className={inputClass} />
          </Field>
          <Field label="Tu email" error={errors.submitterEmail?.message}>
            <input {...register('submitterEmail')} type="email" placeholder="email@ejemplo.com" className={inputClass} />
          </Field>
        </div>
      </div>

      <Field label="Comentarios adicionales" error={errors.notes?.message}>
        <textarea
          {...register('notes')}
          rows={2}
          placeholder="¿Algo más que quieras contarnos sobre este contenido?"
          className={cn(inputClass, 'resize-none')}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-accent text-primary font-semibold rounded-sm hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar propuesta'}
      </button>
    </form>
  )
}
