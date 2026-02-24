'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle } from 'lucide-react'
import { suggestionSchema, type SuggestionSchema } from '@/lib/validations'
import { createSuggestion } from '@/services/suggestions.service'

export function SuggestionForm() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SuggestionSchema>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: { type: 'pelicula', title: '', notes: '', email: '' },
  })

  const onSubmit = async (data: SuggestionSchema) => {
    await createSuggestion({
      type:  data.type,
      title: data.title,
      notes: data.notes || undefined,
      email: data.email || undefined,
    })
    reset()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle size={48} className="text-accent" />
        <h2 className="font-display text-xl text-light">¡Gracias por tu sugerencia!</h2>
        <p className="text-light/60 text-sm max-w-sm">
          La hemos recibido y la revisaremos con atención. Tu aporte ayuda a crecer el Faro.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-2 text-sm text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
        >
          Enviar otra sugerencia
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-lg mx-auto">
      {/* Tipo */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-light/70">Tipo de contenido</label>
        <select
          {...register('type')}
          className="px-4 py-2.5 rounded-sm bg-secondary border border-border text-light focus:outline-none focus:border-accent transition-colors text-sm cursor-pointer"
        >
          <option value="pelicula">Película</option>
          <option value="libro">Libro</option>
          <option value="cancion">Canción</option>
        </select>
        {errors.type && <p className="text-red-400 text-xs">{errors.type.message}</p>}
      </div>

      {/* Título */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-light/70">
          Título <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          placeholder="Nombre de la película, libro o canción"
          {...register('title')}
          className="px-4 py-2.5 rounded-sm bg-secondary border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm"
        />
        {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
      </div>

      {/* Notas */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-light/70">Notas adicionales (opcional)</label>
        <textarea
          rows={3}
          placeholder="¿Por qué lo recomiendas? ¿Algún detalle que quieras compartir?"
          {...register('notes')}
          className="px-4 py-2.5 rounded-sm bg-secondary border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm resize-none"
        />
        {errors.notes && <p className="text-red-400 text-xs">{errors.notes.message}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-light/70">Email (opcional)</label>
        <input
          type="email"
          placeholder="Para avisarte si lo agregamos"
          {...register('email')}
          className="px-4 py-2.5 rounded-sm bg-secondary border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm"
        />
        {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="py-3 rounded-sm bg-accent text-primary font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Enviando…' : 'Enviar sugerencia'}
      </button>
    </form>
  )
}
