'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface SearchFormProps {
  initialQ?:    string
  initialTipo?: string
}

const TIPOS = [
  { value: '',         label: 'Todo' },
  { value: 'pelicula', label: 'Películas' },
  { value: 'libro',    label: 'Libros' },
  { value: 'cancion',  label: 'Canciones' },
]

const DEBOUNCE_MS = 400

export function SearchForm({ initialQ = '', initialTipo = '' }: SearchFormProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [q,    setQ]    = useState(initialQ)
  const [tipo, setTipo] = useState(initialTipo)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigate = (nextQ: string, nextTipo: string) => {
    const params = new URLSearchParams()
    if (nextQ.trim())  params.set('q',    nextQ.trim())
    if (nextTipo)      params.set('tipo', nextTipo)
    startTransition(() => {
      router.replace(`${ROUTES.SEARCH}?${params.toString()}`)
    })
  }

  // Debounce: navega automáticamente al escribir
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => navigate(q, tipo), DEBOUNCE_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (timerRef.current) clearTimeout(timerRef.current)
    navigate(q, tipo)
  }

  const handleTipoChange = (value: string) => {
    setTipo(value)
    if (timerRef.current) clearTimeout(timerRef.current)
    navigate(q, value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-light/30 pointer-events-none" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar películas, libros o canciones..."
          autoFocus
          className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-secondary border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm"
        />
      </div>
      <div className="flex gap-2">
        {TIPOS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => handleTipoChange(t.value)}
            className={cn(
              'px-3 py-2 rounded-sm text-xs transition-all duration-150 whitespace-nowrap',
              tipo === t.value
                ? 'bg-accent text-primary font-semibold'
                : 'border border-border text-light/50 hover:border-accent/40 hover:text-light'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
    </form>
  )
}
