/**
 * Funciones de fetch para páginas públicas.
 * Sin caché — datos frescos en cada request.
 */
import { createClient } from '@supabase/supabase-js'
import { TABLE_NAMES } from '@/lib/constants'
import type { Movie, RatingsMap } from '@/types/app.types'

// Cliente anónimo sin cookies — solo datos públicos
const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// ─── Settings ─────────────────────────────────────────────────────────────────

export const fetchSettingsPublic = async () => {
  const { data } = await sb()
    .from(TABLE_NAMES.SETTINGS)
    .select('copyright_mode')
    .eq('id', 'global')
    .single()
  return { copyrightMode: data?.copyright_mode ?? false }
}

// ─── Ratings ──────────────────────────────────────────────────────────────────

export const fetchRatingsPublic = async (contentType: 'pelicula' | 'libro' | 'cancion'): Promise<RatingsMap> => {
  const { data } = await sb()
    .from(TABLE_NAMES.RATINGS)
    .select('content_id, rating')
    .eq('content_type', contentType)

  const map: RatingsMap = {}
  for (const row of data ?? []) {
    const id = row.content_id as string
    if (!map[id]) map[id] = { avgRating: 0, ratingCount: 0 }
    map[id].ratingCount += 1
    map[id].avgRating   += row.rating as number
  }
  for (const id of Object.keys(map)) {
    map[id].avgRating = map[id].avgRating / map[id].ratingCount
  }
  return map
}

// ─── Películas destacadas (hero de la home y TVBox) ──────────────────────────

type FeaturedMovieRow = {
  id:                       string
  title:                    string
  description:              string | null
  youtube_id:               string | null
  dailymotion_id:           string | null
  ok_id:                    string | null
  vimeo_id:                 string | null
  external_url:             string | null
  thumbnail_url:            string | null
  year:                     number | null
  is_published:             boolean
  sort_order:               number
  is_featured:              boolean | null
  hero_order:               number | null
  created_at:               string
  updated_at:               string
  movie_platform_items:     { platform_id: string }[] | null
  movie_category_items:     { category_id: string }[] | null
}

const adaptFeaturedMovieRow = (row: FeaturedMovieRow): Movie => ({
  id:            row.id,
  title:         row.title,
  description:   row.description,
  youtubeId:     row.youtube_id,
  dailymotionId: row.dailymotion_id,
  okId:          row.ok_id,
  vimeoId:       row.vimeo_id,
  externalUrl:   row.external_url,
  thumbnailUrl:  row.thumbnail_url,
  year:          row.year,
  categoryIds:   (row.movie_category_items ?? []).map((r) => r.category_id),
  platformIds:   (row.movie_platform_items ?? []).map((r) => r.platform_id),
  isPublished:   row.is_published,
  sortOrder:     row.sort_order,
  isFeatured:    row.is_featured ?? false,
  heroOrder:     row.hero_order  ?? 0,
  createdAt:     row.created_at,
  updatedAt:     row.updated_at,
})

export const fetchFeaturedMovies = async (): Promise<Movie[]> => {
  const { data, error } = await sb()
    .from(TABLE_NAMES.MOVIES)
    .select(`*, ${TABLE_NAMES.MOVIE_CATEGORY_ITEMS}(category_id), ${TABLE_NAMES.MOVIE_PLATFORM_ITEMS}(platform_id)`)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('hero_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map(adaptFeaturedMovieRow)
}

// ─── Home (preview — últimos 6 de cada tipo) ──────────────────────────────────

export const fetchHomePreviewData = async () => {
  const client = sb()
  const [moviesRes, booksRes, songsRes, platsRes, ytPlRes, ytChRes, musicPlRes] = await Promise.all([
    client
      .from(TABLE_NAMES.MOVIES)
      .select(`*, ${TABLE_NAMES.MOVIE_PLATFORM_ITEMS}(platform_id)`)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6),
    client
      .from(TABLE_NAMES.BOOKS)
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6),
    client
      .from(TABLE_NAMES.SONGS)
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6),
    client
      .from(TABLE_NAMES.MOVIE_PLATFORMS)
      .select('*')
      .order('sort_order', { ascending: true }),
    client
      .from(TABLE_NAMES.YOUTUBE_PLAYLISTS)
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(6),
    client
      .from(TABLE_NAMES.YOUTUBE_CHANNELS)
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(6),
    client
      .from(TABLE_NAMES.PLAYLISTS)
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6),
  ])
  return {
    movies:           moviesRes.data ?? [],
    books:            booksRes.data ?? [],
    songs:            songsRes.data ?? [],
    platforms:        platsRes.data ?? [],
    youtubePlaylists: ytPlRes.data ?? [],
    youtubeChannels:  ytChRes.data ?? [],
    musicPlaylists:   musicPlRes.data ?? [],
  }
}

// ─── Libros page ──────────────────────────────────────────────────────────────

export const fetchBooksPageData = async () => {
  const client = sb()
  const [booksRes, catsRes] = await Promise.all([
    client
      .from(TABLE_NAMES.BOOKS)
      .select(`*, ${TABLE_NAMES.BOOK_CATEGORY_ITEMS}(category_id)`)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    client
      .from(TABLE_NAMES.BOOK_CATEGORIES)
      .select('*')
      .order('sort_order', { ascending: true }),
  ])
  return {
    books:      booksRes.data ?? [],
    categories: catsRes.data ?? [],
  }
}

// ─── Películas page ───────────────────────────────────────────────────────────

export const fetchMoviesPageData = async () => {
  const client = sb()
  const [moviesRes, catsRes, platsRes, ytPlRes, ytChRes] = await Promise.all([
    client
      .from(TABLE_NAMES.MOVIES)
      .select(`*, ${TABLE_NAMES.MOVIE_CATEGORY_ITEMS}(category_id), ${TABLE_NAMES.MOVIE_PLATFORM_ITEMS}(platform_id)`)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    client
      .from(TABLE_NAMES.MOVIE_CATEGORIES)
      .select('*')
      .order('sort_order', { ascending: true }),
    client
      .from(TABLE_NAMES.MOVIE_PLATFORMS)
      .select('*')
      .order('sort_order', { ascending: true }),
    client
      .from(TABLE_NAMES.YOUTUBE_PLAYLISTS)
      .select(`*, ${TABLE_NAMES.YOUTUBE_PLAYLIST_CATEGORY_ITEMS}(category_id)`)
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
    client
      .from(TABLE_NAMES.YOUTUBE_CHANNELS)
      .select(`*, ${TABLE_NAMES.YOUTUBE_CHANNEL_CATEGORY_ITEMS}(category_id)`)
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
  ])
  return {
    movies:           moviesRes.data ?? [],
    categories:       catsRes.data ?? [],
    platforms:        platsRes.data ?? [],
    youtubePlaylists: ytPlRes.data ?? [],
    youtubeChannels:  ytChRes.data ?? [],
  }
}

// ─── Música page ──────────────────────────────────────────────────────────────

export const fetchMusicPageData = async () => {
  const client = sb()
  const [songsRes, catsRes, playlistsRes] = await Promise.all([
    client
      .from(TABLE_NAMES.SONGS)
      .select(`*, ${TABLE_NAMES.SONG_CATEGORIES}(category_id)`)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    client
      .from(TABLE_NAMES.MUSIC_CATEGORIES)
      .select('*')
      .order('sort_order', { ascending: true }),
    client
      .from(TABLE_NAMES.PLAYLISTS)
      .select(`*, ${TABLE_NAMES.PLAYLIST_CATEGORY_ITEMS}(category_id)`)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
  ])
  return {
    songs:      songsRes.data ?? [],
    categories: catsRes.data ?? [],
    playlists:  playlistsRes.data ?? [],
  }
}

export type SearchContentType = 'pelicula' | 'libro'

export interface CatalogSearchItem {
  id:       string
  title:    string
  subtitle: string | null
  tipo:     SearchContentType
}

export const fetchCatalogSearch = async (query: string, tipo?: string): Promise<CatalogSearchItem[]> => {
  const trimmed = query.trim()
  if (!trimmed) return []

  const client  = sb()
  const pattern = `%${trimmed}%`

  const [moviesRes, booksRes] = await Promise.all([
    (!tipo || tipo === 'pelicula')
      ? client.from(TABLE_NAMES.MOVIES).select('id, title, description')
          .eq('is_published', true)
          .or(`title.ilike.${pattern},description.ilike.${pattern}`)
          .limit(20)
      : Promise.resolve({ data: [] as { id: string; title: string; description: string | null }[] }),
    (!tipo || tipo === 'libro')
      ? client.from(TABLE_NAMES.BOOKS).select('id, title, author')
          .eq('is_published', true)
          .or(`title.ilike.${pattern},author.ilike.${pattern}`)
          .limit(20)
      : Promise.resolve({ data: [] as { id: string; title: string; author: string | null }[] }),
  ])

  return [
    ...(moviesRes.data ?? []).map((row) => ({
      id: row.id, title: row.title, subtitle: row.description, tipo: 'pelicula' as const,
    })),
    ...(booksRes.data ?? []).map((row) => ({
      id: row.id, title: row.title, subtitle: row.author, tipo: 'libro' as const,
    })),
  ]
}
