'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { MovieGrid } from './MovieGrid'
import { cn } from '@/lib/utils'
import type { Movie, MovieCategory, MoviePlatform, RatingsMap } from '@/types/app.types'

type SortKey = 'recent' | 'oldest' | 'year_desc' | 'year_asc' | 'az' | 'za' | 'rating_desc'

const DEBOUNCE_MS = 400
const PER_PAGE_OPTIONS = [9, 18, 36]

const sortMovies = (a: Movie, b: Movie, sort: SortKey, ratingsMap?: RatingsMap): number => {
  switch (sort) {
    case 'recent':      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    case 'oldest':      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    case 'year_desc':   return (b.year ?? 0) - (a.year ?? 0)
    case 'year_asc':    return (a.year ?? 0) - (b.year ?? 0)
    case 'az':          return a.title.localeCompare(b.title, 'es')
    case 'za':          return b.title.localeCompare(a.title, 'es')
    case 'rating_desc': return (ratingsMap?.[b.id]?.avgRating ?? 0) - (ratingsMap?.[a.id]?.avgRating ?? 0)
  }
}

interface MovieFilterSectionProps {
  movies:        Movie[]
  categories:    MovieCategory[]
  ratingsMap?:   RatingsMap
  platformsMap?: Record<string, MoviePlatform>
}

export const MovieFilterSection = ({ movies, categories, ratingsMap, platformsMap }: MovieFilterSectionProps) => {
  const [categoryId,  setCategoryId]  = useState('')
  const [platformId,  setPlatformId]  = useState('')
  const [inputQ,      setInputQ]      = useState('')
  const [q,           setQ]           = useState('')
  const [sort,        setSort]        = useState<SortKey>('recent')
  const [page,        setPage]        = useState(1)
  const [perPage,     setPerPage]     = useState(9)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const platforms = useMemo(
    () => Object.values(platformsMap ?? {}).sort((a, b) => a.sortOrder - b.sortOrder),
    [platformsMap]
  )

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setQ(inputQ.trim()), DEBOUNCE_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [inputQ])

  useEffect(() => { setPage(1) }, [q, categoryId, platformId, sort, perPage])

  const filtered = useMemo(() => {
    let result = categoryId ? movies.filter((m) => m.categoryIds.includes(categoryId)) : movies
    if (platformId) result = result.filter((m) => m.platformIds.includes(platformId))
    if (q) result = result.filter((m) => m.title.toLowerCase().includes(q.toLowerCase()))
    return [...result].sort((a, b) => sortMovies(a, b, sort, ratingsMap))
  }, [movies, categoryId, platformId, q, sort, ratingsMap])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage]
  )

  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== 'ellipsis') {
        pages.push('ellipsis')
      }
    }
    return pages
  }, [totalPages, page])

  const selectCls = 'px-3 py-2.5 rounded-sm bg-secondary border border-border text-light text-sm focus:outline-none focus:border-accent transition-colors'

  return (
    <div>
      {/* Fila 1: búsqueda + ordenar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-light/30 pointer-events-none" />
          <input
            type="text"
            value={inputQ}
            onChange={(e) => setInputQ(e.target.value)}
            placeholder="Buscar por título..."
            className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-secondary border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className={selectCls}
        >
          <option value="recent">Subidos recientemente</option>
          <option value="oldest">Subidos más antiguos</option>
          <option value="year_desc">Fecha de la película (reciente)</option>
          <option value="year_asc">Fecha de la película (antiguo)</option>
          <option value="az">Nombre A → Z</option>
          <option value="za">Nombre Z → A</option>
          <option value="rating_desc">Mejor valorada</option>
        </select>
      </div>

      {/* Fila 2: categoría + plataforma */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {categories.length > 0 && (
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={cn(selectCls, 'flex-1')}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        )}

        {platforms.length > 0 && (
          <select
            value={platformId}
            onChange={(e) => setPlatformId(e.target.value)}
            className={cn(selectCls, 'flex-1')}
          >
            <option value="">Todas las plataformas</option>
            {platforms.map((plat) => (
              <option key={plat.id} value={plat.id}>{plat.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Selector de cantidad por página */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 text-sm text-light/50">
          <span>Por página:</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="px-2 py-1 rounded-sm bg-secondary border border-border text-light text-sm focus:outline-none focus:border-accent transition-colors"
          >
            {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-light/30 border border-border rounded-card">
          <p>{q ? `Sin resultados para "${q}"` : 'No hay películas con esos filtros.'}</p>
        </div>
      ) : (
        <>
          <MovieGrid movies={paginated} ratingsMap={ratingsMap} platformsMap={platformsMap} />

          {/* Paginación */}
          <div className="flex items-center justify-between gap-4 mt-8">
            <span className="text-sm text-light/50">
              {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} de {filtered.length}
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-sm border border-border text-light/50 hover:text-light hover:border-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {pageNumbers.map((p, idx) =>
                  p === 'ellipsis' ? (
                    <span key={`e${idx}`} className="px-2 text-light/30 text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        'w-8 h-8 rounded-sm text-sm transition-colors',
                        p === page
                          ? 'bg-accent text-primary font-semibold'
                          : 'border border-border text-light/50 hover:text-light hover:border-accent/40'
                      )}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-sm border border-border text-light/50 hover:text-light hover:border-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
