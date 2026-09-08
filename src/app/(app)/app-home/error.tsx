'use client'

import { APP_ROUTES } from '@/lib/constants'

export default function AppHomeError({ reset }: { reset: () => void }) {
  return (
    <main className="app-loading-screen">
      <h1 className="font-display text-2xl text-light">No pudimos cargar el contenido</h1>
      <p className="max-w-sm text-center text-sm text-light/50">
        Revisá tu conexión e intentá de nuevo.
      </p>
      <button
        type="button"
        onClick={reset}
        className="app-focus mt-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-primary"
      >
        Reintentar
      </button>
      <a href={APP_ROUTES.HOME} className="app-focus text-sm text-accent">
        Volver al inicio
      </a>
    </main>
  )
}
