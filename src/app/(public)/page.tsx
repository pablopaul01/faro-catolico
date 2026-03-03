import type { Metadata } from 'next'
import { ROUTES, SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants'
import { fetchHomePreviewData, fetchSettingsPublic, fetchRatingsPublic } from '@/lib/data-cache'
import { Hero } from '@/components/public/Hero'
import { SectionHeader } from '@/components/public/SectionHeader'
import { MovieGrid } from '@/components/public/movies/MovieGrid'
import { BookGrid } from '@/components/public/books/BookGrid'
import { SongCard } from '@/components/public/music/SongCard'
import { YoutubePlaylistCard } from '@/components/public/movies/YoutubePlaylistCard'
import { YoutubeChannelCard } from '@/components/public/movies/YoutubeChannelCard'
import { PlaylistCard } from '@/components/public/music/PlaylistCard'
import { SettingsInitializer } from '@/components/SettingsInitializer'
import type { Movie, Book, Song, MoviePlatform, YoutubePlaylist, YoutubeChannel, Playlist } from '@/types/app.types'

export const revalidate = 3600 // ISR: revalida cada 1 hora desde CDN

export const metadata: Metadata = {
  title:       SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title:       `${SITE_NAME} — Películas, libros y música para crecer en gracia`,
    description: SITE_DESCRIPTION,
    url:         SITE_URL,
    images: [{
      url:    '/og-image.png',
      width:  1200,
      height: 630,
    }],
  },
}

const Divider = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <div className="h-px bg-border" />
  </div>
)

export default async function HomePage() {
  const [homeData, settings, movieRatings, bookRatings, songRatings] = await Promise.all([
    fetchHomePreviewData(),
    fetchSettingsPublic(),
    fetchRatingsPublic('pelicula'),
    fetchRatingsPublic('libro'),
    fetchRatingsPublic('cancion'),
  ])

  const { movies: moviesRaw, books: booksRaw, songs: songsRaw, platforms: platsRaw,
          youtubePlaylists: ytPlRaw, youtubeChannels: ytChRaw, musicPlaylists: musicPlRaw } = homeData

  const platformsMap: Record<string, MoviePlatform> = {}
  for (const row of platsRaw) {
    platformsMap[row.id] = { id: row.id, name: row.name, sortOrder: row.sort_order, createdAt: row.created_at }
  }

  const movies: Movie[] = moviesRaw.map((row) => ({
    id: row.id, title: row.title, description: row.description,
    youtubeId: row.youtube_id, dailymotionId: row.dailymotion_id, externalUrl: row.external_url,
    thumbnailUrl: row.thumbnail_url, year: row.year, categoryIds: [],
    platformIds: (row.movie_platform_items as { platform_id: string }[] ?? []).map((r) => r.platform_id),
    isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))

  const books: Book[] = booksRaw.map((row) => ({
    id: row.id, title: row.title, author: row.author,
    description: row.description, coverUrl: row.cover_url,
    purchaseUrl: row.purchase_url, pdfUrl: row.pdf_url, year: row.year, categoryIds: [],
    isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))

  const songs: Song[] = songsRaw.map((row) => ({
    id: row.id, title: row.title, artist: row.artist,
    categoryIds: [], youtubeId: row.youtube_id,
    spotifyUrl: row.spotify_url, externalUrl: row.external_url,
    thumbnailUrl: row.thumbnail_url, durationSec: row.duration_sec,
    isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))

  const youtubePlaylists: YoutubePlaylist[] = ytPlRaw.map((row) => ({
    id: row.id, title: row.title, description: row.description,
    youtubeListId: row.youtube_list_id, thumbnailUrl: row.thumbnail_url,
    categoryIds: [], isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))

  const youtubeChannels: YoutubeChannel[] = ytChRaw.map((row) => ({
    id: row.id, name: row.name, description: row.description,
    channelUrl: row.channel_url, thumbnailUrl: row.thumbnail_url,
    categoryIds: [], isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))

  const musicPlaylists: Playlist[] = musicPlRaw.map((row) => ({
    id: row.id, title: row.title, description: row.description,
    spotifyUrl: row.spotify_url, thumbnailUrl: row.thumbnail_url,
    categoryIds: [], isPublished: row.is_published, sortOrder: row.sort_order,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }))

  return (
    <>
      <SettingsInitializer copyrightMode={settings.copyrightMode} />
      <Hero />

      {/* Películas */}
      <section id="peliculas" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <SectionHeader
          title="Películas"
          subtitle="Vidas de santos y films aptos para toda la familia"
          viewAllHref={ROUTES.MOVIES}
          viewAllLabel="Ver todas"
        />
        <MovieGrid movies={movies} ratingsMap={movieRatings} platformsMap={platformsMap} slider />
      </section>

      {/* YouTube Playlists */}
      {youtubePlaylists.length > 0 && (
        <>
          <Divider />
          <section id="playlists-youtube" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <SectionHeader
              title="Playlists de YouTube"
              subtitle="Colecciones de videos seleccionados para crecer en la fe"
              viewAllHref={`${ROUTES.MOVIES}?tab=playlists`}
              viewAllLabel="Ver todas"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {youtubePlaylists.map((pl) => (
                <YoutubePlaylistCard key={pl.id} playlist={pl} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Canales de YouTube */}
      {youtubeChannels.length > 0 && (
        <>
          <Divider />
          <section id="canales-youtube" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <SectionHeader
              title="Canales de YouTube"
              subtitle="Creadores católicos recomendados para el crecimiento espiritual"
              viewAllHref={`${ROUTES.MOVIES}?tab=canales`}
              viewAllLabel="Ver todos"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {youtubeChannels.map((ch) => (
                <YoutubeChannelCard key={ch.id} channel={ch} />
              ))}
            </div>
          </section>
        </>
      )}

      <Divider />

      {/* Libros */}
      <section id="libros" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeader
          title="Libros"
          subtitle="Lectura seleccionada para el crecimiento espiritual"
          viewAllHref={ROUTES.BOOKS}
          viewAllLabel="Ver todos"
        />
        <BookGrid books={books} ratingsMap={bookRatings} slider />
      </section>

      <Divider />

      {/* Música — canciones */}
      <section id="musica" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 pt-10">
        <SectionHeader
          title="Música"
          subtitle="Canciones para cada momento del corazón"
          viewAllHref={ROUTES.MUSIC}
          viewAllLabel="Ver todo"
        />
        <div className="space-y-2">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} ratingStats={songRatings?.[song.id]} />
          ))}
        </div>
      </section>

      {/* Playlists de música */}
      {musicPlaylists.length > 0 && (
        <>
          <Divider />
          <section id="playlists-musica" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 pb-24">
            <SectionHeader
              title="Playlists de Música"
              subtitle="Colecciones de canciones para cada momento del día"
              viewAllHref={`${ROUTES.MUSIC}?tab=playlists`}
              viewAllLabel="Ver todas"
            />
            <div className="space-y-3">
              {musicPlaylists.map((pl) => (
                <PlaylistCard key={pl.id} playlist={pl} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Padding bottom si no hay playlists de música */}
      {musicPlaylists.length === 0 && (
        <div className="pb-24" />
      )}
    </>
  )
}
