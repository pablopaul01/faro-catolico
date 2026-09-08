import Link from 'next/link'
import { APP_ROUTES } from '@/lib/constants'

export default function AppNotFound() {
  return (
    <main className="app-loading-screen">
      <h1 className="font-display text-2xl text-light">No encontramos este contenido</h1>
      <p className="max-w-sm text-center text-sm text-light/50">
        Puede que ya no esté disponible en el catálogo.
      </p>
      <Link
        href={APP_ROUTES.HOME}
        className="app-focus rounded-full bg-accent px-5 py-3 text-sm font-semibold text-primary"
      >
        Volver al inicio
      </Link>
    </main>
  )
}
