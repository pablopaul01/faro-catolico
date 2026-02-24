'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export function HeroSearch() {
  const router = useRouter()
  const [q, setQ] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!q.trim()) return
    router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md animate-slide-up"
      style={{ animationDelay: '0.45s' }}
    >
      <div className="relative py-4">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-light/30 pointer-events-none"
        />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar películas, libros, canciones..."
          className="w-full pl-10 pr-4 py-3 rounded-sm bg-secondary/80 border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm backdrop-blur-sm"
        />
      </div>
    </form>
  )
}
