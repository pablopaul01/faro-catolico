import { ContactForm } from '@/components/public/ContactForm'
import { SITE_NAME } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       `Contacto — ${SITE_NAME}`,
  description: '¿Tenés alguna consulta, sugerencia o simplemente querés saludar? Escribinos.',
}

export default function ContactoPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-fade-in pb-24">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-light mb-3">Contacto</h1>
        <p className="text-light/50 text-sm leading-relaxed max-w-md mx-auto">
          ¿Tenés alguna consulta, sugerencia o simplemente querés saludar?
          Escribinos y lo leemos con mucho gusto.
        </p>
      </div>

      <ContactForm />
    </main>
  )
}
