'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { APP_ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface AppSearchFormProps {
  initialQ?:    string
  initialTipo?: string
}

const TIPOS = [
  { value: '',         label: 'Todo' },
  { value: 'pelicula', label: 'Películas' },
  { value: 'libro',    label: 'Libros' },
]

const DEBOUNCE_MS = 400

export function AppSearchForm({ initialQ = '', initialTipo = '' }: AppSearchFormProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [q,    setQ]    = useState(initialQ)
  const [tipo, setTipo] = useState(initialTipo)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigate = (nextQ: string, nextTipo: string) => {
    const params = new URLSearchParams()
    if (nextQ.trim()) params.set('q', nextQ.trim())
    if (nextTipo)     params.set('tipo', nextTipo)
    startTransition(() => {
      router.replace(`${APP_ROUTES.SEARCH}?${params.toString()}`)
    })
  }

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => navigate(q, tipo), DEBOUNCE_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (timerRef.current) clearTimeout(timerRef.current)
    navigate(q, tipo)
  }

  const handleTipoChange = (value: string) => {
    setTipo(value)
    if (timerRef.current) clearTimeout(timerRef.current)
    navigate(q, value)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-light/30" />
        <input
          type="text"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Buscar películas o libros..."
          autoFocus
          className="app-focus w-full rounded-sm border border-border bg-secondary py-2.5 pl-9 pr-4 text-sm text-light placeholder-light/30 transition-colors focus:border-accent focus:outline-none"
        />
      </div>
      <div className="flex gap-2">
        {TIPOS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleTipoChange(option.value)}
            className={cn(
              'app-focus whitespace-nowrap rounded-sm px-3 py-2 text-xs transition-all duration-150',
              tipo === option.value
                ? 'bg-accent font-semibold text-primary'
                : 'border border-border text-light/50 hover:border-accent/40 hover:text-light'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </form>
  )
}
