import { BookCard } from './BookCard'
import type { Book, RatingsMap } from '@/types/app.types'

interface BookGridProps {
  books:       Book[]
  ratingsMap?: RatingsMap
}

export const BookGrid = ({ books, ratingsMap }: BookGridProps) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-20 text-light/30">
        <p>No hay libros disponibles por el momento.</p>
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
