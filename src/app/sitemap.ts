import type { MetadataRoute } from 'next'
import { SITE_URL, ROUTES, TABLE_NAMES } from '@/lib/constants'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createSupabaseServerClient()

  const [moviesRes, booksRes, songsRes] = await Promise.all([
    supabase.from(TABLE_NAMES.MOVIES).select('updated_at').eq('is_published', true),
    supabase.from(TABLE_NAMES.BOOKS).select('updated_at').eq('is_published', true),
    supabase.from(TABLE_NAMES.SONGS).select('updated_at').eq('is_published', true),
  ])

  const lastMovieUpdate = moviesRes.data?.[0]?.updated_at
  const lastBookUpdate  = booksRes.data?.[0]?.updated_at
  const lastSongUpdate  = songsRes.data?.[0]?.updated_at

  return [
    {
      url:            SITE_URL,
      lastModified:   new Date(),
      changeFrequency: 'daily',
      priority:       1,
    },
    {
      url:            `${SITE_URL}${ROUTES.MOVIES}`,
      lastModified:   lastMovieUpdate ? new Date(lastMovieUpdate) : new Date(),
      changeFrequency: 'weekly',
      priority:       0.9,
    },
    {
      url:            `${SITE_URL}${ROUTES.BOOKS}`,
      lastModified:   lastBookUpdate ? new Date(lastBookUpdate) : new Date(),
      changeFrequency: 'weekly',
      priority:       0.9,
    },
    {
      url:            `${SITE_URL}${ROUTES.MUSIC}`,
      lastModified:   lastSongUpdate ? new Date(lastSongUpdate) : new Date(),
      changeFrequency: 'weekly',
      priority:       0.9,
    },
    {
      url:            `${SITE_URL}${ROUTES.PROPOSE}`,
      changeFrequency: 'monthly',
      priority:       0.5,
    },
    {
      url:            `${SITE_URL}${ROUTES.AVISO_LEGAL}`,
      changeFrequency: 'yearly',
      priority:       0.2,
    },
  ]
}
