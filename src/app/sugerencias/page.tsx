import { SuggestionForm } from '@/components/public/SuggestionForm'
import { SITE_NAME } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       `Sugerencias — ${SITE_NAME}`,
  description: 'Sugerí una película, libro o canción para el Faro Católico. Tu opinión ayuda a crecer el contenido.',
}

export default function SugerenciasPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-light mb-3">Sugerencias</h1>
        <p className="text-light/50 text-sm leading-relaxed max-w-md mx-auto">
          ¿Conocés una película, libro o canción que podría ayudar a crecer en la fe?
          Compartila con nosotros y la evaluaremos para agregarla al Faro.
        </p>
      </div>

      <div className="bg-secondary border border-border rounded-card p-6 sm:p-8">
        <SuggestionForm />
      </div>
    </main>
  )
}
