import { fetchCatalogSearch } from '@/lib/data-cache'
import { appContentHref } from '@/lib/constants'
import { AppSearchForm } from '@/components/app/AppSearchForm'
import { AppCard } from '@/components/app/AppHome'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ q?: string; tipo?: string }>
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
          Encontrá películas y libros sin salir de la aplicación.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
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
          <div className="app-search-results">
            <p className="mb-4 text-xs text-light/40">
              {results.length} resultado{results.length !== 1 ? 's' : ''} para “{query}”
            </p>
            <div className="app-catalog-grid">
              {results.map((item) => (
                <AppCard
                  key={`${item.tipo}-${item.id}`}
                  item={item.tipo === 'libro'
                    ? { id: item.id, title: item.title, coverUrl: item.imageUrl, author: item.subtitle ?? '' }
                    : { id: item.id, title: item.title, thumbnailUrl: item.imageUrl }}
                  href={appContentHref(item.tipo, item.id)}
                  kind={item.tipo === 'libro' ? 'book' : 'movie'}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
