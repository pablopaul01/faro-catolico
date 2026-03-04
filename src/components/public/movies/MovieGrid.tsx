import { Film } from 'lucide-react'
import { MovieCard } from './MovieCard'
import { FadeInWhenVisible } from '@/components/public/FadeInWhenVisible'
import { EmptyState } from '@/components/public/EmptyState'
import type { Movie, MoviePlatform, RatingsMap } from '@/types/app.types'

interface MovieGridProps {
  movies:        Movie[]
  ratingsMap?:   RatingsMap
  platformsMap?: Record<string, MoviePlatform>
  slider?:       boolean
}

export const MovieGrid = ({ movies, ratingsMap, platformsMap, slider }: MovieGridProps) => {
  if (movies.length === 0) {
    return (
      <EmptyState
        icon={Film}
        title="No hay películas disponibles por el momento."
        subtitle="Volvé pronto, estamos agregando contenido."
      />
    )
  }

  if (slider) {
    return (
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
        {movies.map((movie, index) => (
          <FadeInWhenVisible
            key={movie.id}
            index={index}
            className="w-[78vw] max-w-xs shrink-0 snap-start sm:w-auto sm:max-w-none"
          >
            <MovieCard
              movie={movie}
              ratingStats={ratingsMap?.[movie.id]}
              platforms={platformsMap ? movie.platformIds.map((pid) => platformsMap[pid]).filter(Boolean) : undefined}
              priority={index === 0}
            />
          </FadeInWhenVisible>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {movies.map((movie, index) => (
        <FadeInWhenVisible key={movie.id} index={index} className="h-full">
          <MovieCard
            movie={movie}
            ratingStats={ratingsMap?.[movie.id]}
            platforms={platformsMap ? movie.platformIds.map((pid) => platformsMap[pid]).filter(Boolean) : undefined}
            priority={index === 0}
          />
        </FadeInWhenVisible>
      ))}
    </div>
  )
}
