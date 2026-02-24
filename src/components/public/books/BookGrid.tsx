import { BookCard } from './BookCard'
import type { Book, RatingsMap } from '@/types/app.types'

interface BookGridProps {
  books:       Book[]
  ratingsMap?: RatingsMap
  slider?:     boolean
}

export const BookGrid = ({ books, ratingsMap, slider }: BookGridProps) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-20 text-light/30">
        <p>No hay libros disponibles por el momento.</p>
      </div>
    )
  }

  if (slider) {
    return (
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible">
        {books.map((book, index) => (
          <div
            key={book.id}
            className="w-[78vw] max-w-xs shrink-0 snap-start sm:w-auto sm:max-w-none animate-slide-up"
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <BookCard book={book} ratingStats={ratingsMap?.[book.id]} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {books.map((book, index) => (
        <div
          key={book.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.06}s` }}
        >
          <BookCard book={book} ratingStats={ratingsMap?.[book.id]} />
        </div>
      ))}
    </div>
  )
}
