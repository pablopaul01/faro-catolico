-- ─────────────────────────────────────────────────────────────
-- Faro Católico — Supabase Schema
-- Ejecutar en el SQL Editor del dashboard de Supabase
-- ─────────────────────────────────────────────────────────────

-- Extensión UUID (ya activa en Supabase por defecto)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- Función para actualizar updated_at automáticamente
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────
-- Tabla: movies
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.movies (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT        NOT NULL,
  description   TEXT,
  youtube_id    TEXT        NOT NULL,   -- Solo el ID, ej: "dQw4w9WgXcQ"
  external_url  TEXT,                   -- Link externo opcional
  thumbnail_url TEXT,                   -- Miniatura personalizada
  year          SMALLINT,
  is_published  BOOLEAN     NOT NULL DEFAULT false,
  sort_order    SMALLINT    NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_movies_updated_at
  BEFORE UPDATE ON public.movies
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer películas publicadas
CREATE POLICY "movies_public_select"
  ON public.movies FOR SELECT
  USING (is_published = true);

-- Solo usuarios autenticados (admin) pueden hacer todo
CREATE POLICY "movies_admin_all"
  ON public.movies FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- Tabla: books
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.books (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT        NOT NULL,
  author        TEXT        NOT NULL,
  description   TEXT,
  cover_url     TEXT,
  purchase_url  TEXT,
  pdf_url       TEXT,
  year          SMALLINT,
  is_published  BOOLEAN     NOT NULL DEFAULT false,
  sort_order    SMALLINT    NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "books_public_select"
  ON public.books FOR SELECT
  USING (is_published = true);

CREATE POLICY "books_admin_all"
  ON public.books FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- Tabla: songs
-- ─────────────────────────────────────────────────────────────
CREATE TYPE public.music_category AS ENUM (
  'oracion',
  'estudio',
  'reunion',
  'fiesta'
);

CREATE TABLE public.songs (
  id            UUID                   PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT                   NOT NULL,
  artist        TEXT                   NOT NULL,
  category      public.music_category  NOT NULL,
  youtube_id    TEXT,
  spotify_url   TEXT,
  external_url  TEXT,
  thumbnail_url TEXT,
  duration_sec  SMALLINT,
  is_published  BOOLEAN                NOT NULL DEFAULT false,
  sort_order    SMALLINT               NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ            NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ            NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_songs_updated_at
  BEFORE UPDATE ON public.songs
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "songs_public_select"
  ON public.songs FOR SELECT
  USING (is_published = true);

CREATE POLICY "songs_admin_all"
  ON public.songs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- Storage bucket para imágenes (portadas, miniaturas)
-- Ejecutar en: Dashboard > Storage > New bucket
-- O con este SQL:
-- ─────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "media_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "media_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "media_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media');

CREATE POLICY "media_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media');

-- ─────────────────────────────────────────────────────────────
-- Crear usuario admin en Supabase Auth
-- Hacerlo desde: Dashboard > Authentication > Users > Add user
-- No desde SQL (más seguro)
-- ─────────────────────────────────────────────────────────────
