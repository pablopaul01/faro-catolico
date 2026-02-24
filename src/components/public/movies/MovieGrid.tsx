import { MovieCard } from './MovieCard'
import type { Movie, RatingsMap } from '@/types/app.types'

interface MovieGridProps {
  movies:      Movie[]
  ratingsMap?: RatingsMap
  slider?:     boolean
}

export const MovieGrid = ({ movies, ratingsMap, slider }: MovieGridProps) => {
  if (movies.length === 0) {
    return (
      <div className="text-center py-20 text-light/30">
        <p>No hay películas disponibles por el momento.</p>
        <p className="text-xs mt-2">Volvé pronto, estamos agregando contenido.</p>
      </div>
    )
  }

  if (slider) {
    return (
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="w-[78vw] max-w-xs shrink-0 snap-start sm:w-auto sm:max-w-none animate-slide-up"
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <MovieCard movie={movie} ratingStats={ratingsMap?.[movie.id]} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.06}s` }}
        >
          <MovieCard movie={movie} ratingStats={ratingsMap?.[movie.id]} />
        </div>
      ))}
    </div>
  )
}
