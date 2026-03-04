'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Movie } from '@/types/app.types'

interface MoviesState {
  movies:             Movie[]
  isLoading:          boolean
  error:              string | null
  listSearch:         string
  listFilterCatId:    string
  listPage:           number
  listPageSize:       number
  // Actions
  setMovies:          (movies: Movie[]) => void
  addMovie:           (movie: Movie) => void
  updateMovie:        (id: string, updates: Partial<Movie>) => void
  removeMovie:        (id: string) => void
  setLoading:         (isLoading: boolean) => void
  setError:           (error: string | null) => void
  setListSearch:      (v: string) => void
  setListFilterCatId: (v: string) => void
  setListPage:        (v: number) => void
  setListPageSize:    (v: number) => void
}

export const useMoviesStore = create<MoviesState>()(
  devtools(
    (set) => ({
      movies:          [],
      isLoading:       false,
      error:           null,
      listSearch:      '',
      listFilterCatId: '',
      listPage:        1,
      listPageSize:    10,

      setMovies:   (movies) => set({ movies }),
      addMovie:    (movie)  => set((state) => ({ movies: [movie, ...state.movies] })),
      updateMovie: (id, updates) =>
        set((state) => ({
          movies: state.movies.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      removeMovie: (id) =>
        set((state) => ({ movies: state.movies.filter((m) => m.id !== id) })),
      setLoading:         (isLoading) => set({ isLoading }),
      setError:           (error)     => set({ error }),
      setListSearch:      (v) => set({ listSearch: v,      listPage: 1 }),
      setListFilterCatId: (v) => set({ listFilterCatId: v, listPage: 1 }),
      setListPage:        (v) => set({ listPage: v }),
      setListPageSize:    (v) => set({ listPageSize: v,    listPage: 1 }),
    }),
    { name: 'movies-store' }
  )
)
