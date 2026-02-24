'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle } from 'lucide-react'
import { contactSchema, type ContactSchema } from '@/lib/validations'
import { createContactMessage } from '@/services/contactMessages.service'
import { cn } from '@/lib/utils'

const inputClass = 'w-full px-3 py-2.5 rounded-sm bg-primary border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm'
const labelClass = 'block text-sm text-light/70 mb-1'

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactSchema) => {
    await createContactMessage({
      name:    data.name    || undefined,
      email:   data.email   || undefined,
      subject: data.subject || undefined,
      message: data.message,
    })
    reset()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-secondary border border-border rounded-card p-8 text-center animate-fade-in">
        <CheckCircle size={40} className="text-accent mx-auto mb-4" />
        <h2 className="font-display text-xl text-light mb-2">¡Mensaje enviado!</h2>
        <p className="text-light/50 text-sm mb-6">
          Gracias por escribirnos. Leemos cada mensaje con atención.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-sm text-accent hover:text-accent/80 transition-colors"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-secondary border border-border rounded-card p-6 sm:p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tu nombre</label>
          <input {...register('name')} placeholder="Nombre" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Tu email</label>
          <input {...register('email')} type="email" placeholder="email@ejemplo.com" className={inputClass} />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Asunto</label>
        <input {...register('subject')} placeholder="¿Sobre qué nos escribís?" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Mensaje *</label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="Escribí tu mensaje aquí..."
          className={cn(inputClass, 'resize-none')}
        />
        {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-accent text-primary font-semibold rounded-sm hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
