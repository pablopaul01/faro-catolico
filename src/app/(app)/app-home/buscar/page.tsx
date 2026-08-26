import { fetchCatalogSearch } from '@/lib/data-cache'
import { appContentHref } from '@/lib/constants'
import { AppSearchForm } from '@/components/app/AppSearchForm'
import { AppLoadingLink } from '@/components/app/AppLoadingLink'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ q?: string; tipo?: string }>
}

const TYPE_LABELS: Record<string, string> = {
  pelicula: 'Película',
  libro:    'Libro',
  cancion:  'Canción',
}

const TYPE_COLORS: Record<string, string> = {
  pelicula: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
  libro:    'bg-emerald-900/40 text-emerald-300 border-emerald-700/40',
  cancion:  'bg-purple-900/40 text-purple-300 border-purple-700/40',
}

export default async function AppSearchPage({ searchParams }: Props) {
  const { q, tipo } = await searchParams
  const query = q?.trim() ?? ''
  const results = query ? await fetchCatalogSearch(query, tipo) : []

  return (
    <main className="app-catalog">
      <div className="app-catalog-heading">
        <h1 className="font-display text-3xl text-light sm:text-5xl">Buscar</h1>
        <p className="mt-3 max-w-2xl text-sm text-light/55 sm:text-base">
          Encontrá películas, libros y canciones sin salir de la aplicación.
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <AppSearchForm initialQ={query} initialTipo={tipo ?? ''} />

        {query && results.length === 0 && (
          <div className="py-16 text-center text-light/30">
            <p className="mb-2 text-lg">Sin resultados para “{query}”</p>
            <p className="text-sm">Probá con otro término o filtrá por tipo.</p>
          </div>
        )}

        {!query && (
          <div className="py-16 text-center text-light/30">
            <p className="text-sm">Escribí algo para buscar en el catálogo.</p>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <p className="mb-4 text-xs text-light/40">
              {results.length} resultado{results.length !== 1 ? 's' : ''} para “{query}”
            </p>
            <ul className="space-y-2">
              {results.map((item) => (
                <li key={`${item.tipo}-${item.id}`}>
                  <AppLoadingLink
                    href={appContentHref(item.tipo, item.id)}
                    loadingLabel="Abriendo..."
                    className="app-focus group flex items-center gap-3 rounded-card border border-border bg-secondary p-3 transition-colors hover:border-accent/40"
                  >
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${TYPE_COLORS[item.tipo]}`}>
                      {TYPE_LABELS[item.tipo]}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-light transition-colors group-hover:text-accent">{item.title}</p>
                      {item.subtitle ? (
                        <p className="truncate text-xs text-light/40">{item.subtitle}</p>
                      ) : null}
                    </div>
                  </AppLoadingLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
