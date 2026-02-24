import { SubmissionForm } from '@/components/public/SubmissionForm'
import { SITE_NAME } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       `Sugerir contenido — ${SITE_NAME}`,
  description: '¿Conocés una película, libro o canción que debería estar en Faro Católico? ¡Sugerila y la revisamos!',
}

export default function SugerirContenidoPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <h1 className="font-display text-3xl sm:text-4xl text-light mb-2">Sugerir contenido</h1>
      <p className="text-light/50 text-sm mb-8">
        ¿Conocés una película, libro o canción que debería estar en Faro Católico?
        Completá el formulario y lo revisamos. Si es aprobado, aparecerá en el catálogo.
      </p>
      <SubmissionForm />
    </main>
  )
}
