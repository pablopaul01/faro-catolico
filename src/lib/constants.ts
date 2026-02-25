// ─────────────────────────────────────────────
// Rutas de la aplicación
// ─────────────────────────────────────────────
export const ROUTES = {
  HOME:                    '/',
  MOVIES:                  '/peliculas',
  BOOKS:                   '/libros',
  MUSIC:                   '/musica',
  ADMIN:                   '/admin',
  ADMIN_LOGIN:             '/admin/login',
  ADMIN_MOVIES:            '/admin/peliculas',
  ADMIN_BOOKS:             '/admin/libros',
  ADMIN_MUSIC:             '/admin/musica',
  ADMIN_MOVIE_CATEGORIES:  '/admin/peliculas/categorias',
  ADMIN_BOOK_CATEGORIES:   '/admin/libros/categorias',
  ADMIN_MUSIC_CATEGORIES:  '/admin/musica/categorias',
  SUGGESTIONS:             '/sugerencias',
  ADMIN_SUGGESTIONS:       '/admin/sugerencias',
  PROPOSE:                 '/proponer',
  ADMIN_SUBMISSIONS:       '/admin/propuestas',
  SEARCH:                  '/buscar',
  AUTH_CALLBACK:           '/auth/callback',
} as const

// ─────────────────────────────────────────────
// Nombres de tablas de Supabase
// ─────────────────────────────────────────────
export const TABLE_NAMES = {
  MOVIES:           'movies',
  BOOKS:            'books',
  SONGS:            'songs',
  MOVIE_CATEGORIES: 'movie_categories',
  BOOK_CATEGORIES:  'book_categories',
  MUSIC_CATEGORIES: 'music_categories',
  SONG_CATEGORIES:        'song_categories',
  MOVIE_CATEGORY_ITEMS:   'movie_category_items',
  BOOK_CATEGORY_ITEMS:    'book_category_items',
  RATINGS:          'ratings',
  SUGGESTIONS:      'suggestions',
  SUBMISSIONS:      'submissions',
  CONTACT_MESSAGES: 'contact_messages',
} as const

// ─────────────────────────────────────────────
// Metadatos del sitio
// ─────────────────────────────────────────────
export const SITE_NAME        = 'Faro Católico'
export const SITE_TAGLINE     = 'Películas, libros y música para crecer en gracia'
export const SITE_DESCRIPTION = 'Una plataforma de contenido para católicos: películas, libros y música seleccionados para el crecimiento espiritual.'
export const SITE_URL         = 'https://farocatolico.netlify.app'

// ─────────────────────────────────────────────
// YouTube
// ─────────────────────────────────────────────
export const YOUTUBE_NOCOOKIE_BASE = 'https://www.youtube-nocookie.com/embed'
export const YOUTUBE_THUMBNAIL_BASE = 'https://img.youtube.com/vi'

// ─────────────────────────────────────────────
// Supabase Storage
// ─────────────────────────────────────────────
export const STORAGE_BUCKETS = {
  MEDIA: 'media',
} as const

// ─────────────────────────────────────────────
// Paginación
// ─────────────────────────────────────────────
export const ITEMS_PER_PAGE = 12
