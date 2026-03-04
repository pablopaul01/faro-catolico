import { BookOpen } from 'lucide-react'
import { BookCard } from './BookCard'
import { FadeInWhenVisible } from '@/components/public/FadeInWhenVisible'
import { EmptyState } from '@/components/public/EmptyState'
import type { Book, RatingsMap } from '@/types/app.types'

interface BookGridProps {
  books:       Book[]
  ratingsMap?: RatingsMap
  slider?:     boolean
}

export const BookGrid = ({ books, ratingsMap, slider }: BookGridProps) => {
  if (books.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No hay libros disponibles por el momento."
        subtitle="Volvé pronto, estamos agregando contenido."
      />
    )
  }

  if (slider) {
    return (
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible">
        {books.map((book, index) => (
          <FadeInWhenVisible
            key={book.id}
            index={index}
            className="w-[78vw] max-w-xs shrink-0 snap-start sm:w-auto sm:max-w-none"
          >
            <BookCard book={book} ratingStats={ratingsMap?.[book.id]} />
          </FadeInWhenVisible>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {books.map((book, index) => (
        <FadeInWhenVisible key={book.id} index={index} className="h-full">
          <BookCard book={book} ratingStats={ratingsMap?.[book.id]} />
        </FadeInWhenVisible>
      ))}
    </div>
  )
}
