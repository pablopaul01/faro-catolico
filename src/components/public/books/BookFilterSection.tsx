'use client'

import { useState } from 'react'
import { BookGrid } from './BookGrid'
import { cn } from '@/lib/utils'
import type { Book, BookCategory, RatingsMap } from '@/types/app.types'

interface BookFilterSectionProps {
  books:       Book[]
  categories:  BookCategory[]
  ratingsMap?: RatingsMap
}

export const BookFilterSection = ({ books, categories, ratingsMap }: BookFilterSectionProps) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  if (categories.length === 0) {
    return <BookGrid books={books} ratingsMap={ratingsMap} />
  }

  const filtered = activeId === null
    ? books
    : books.filter((b) => b.categoryId === activeId)

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveId(null)}
          className={cn(
            'px-4 py-2 rounded-sm text-sm transition-all duration-200',
            activeId === null
              ? 'bg-accent text-primary font-semibold'
              : 'border border-border text-light/50 hover:border-accent/40 hover:text-light'
          )}
        >
          Todos
          <span className={cn('ml-2 text-xs', activeId === null ? 'text-primary/70' : 'text-light/30')}>
            {books.length}
          </span>
        </button>

        {categories.map((cat) => {
          const count = books.filter((b) => b.categoryId === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveId(cat.id)}
              className={cn(
                'px-4 py-2 rounded-sm text-sm transition-all duration-200',
                activeId === cat.id
                  ? 'bg-accent text-primary font-semibold'
                  : 'border border-border text-light/50 hover:border-accent/40 hover:text-light'
              )}
            >
              {cat.name}
              {count > 0 && (
                <span className={cn('ml-2 text-xs', activeId === cat.id ? 'text-primary/70' : 'text-light/30')}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-light/30 border border-border rounded-card">
          <p>No hay libros en esta categoría todavía.</p>
        </div>
      ) : (
        <BookGrid books={filtered} ratingsMap={ratingsMap} />
      )}
    </div>
  )
}
