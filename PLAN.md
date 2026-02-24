# Faro Católico — Plan de desarrollo
> "Películas, libros y música para crecer en gracia"

---

## Descripción del proyecto

Plataforma web católica con tres secciones de contenido curado:
- **Películas** — vidas de santos, documentales y films aptos para católicos (con embed de YouTube y/o enlaces externos)
- **Libros** — recomendaciones con portada, descripción y links de compra/descarga
- **Música** — canciones organizadas por momento (oración, estudio, reunión, fiesta)

Incluye un **panel de administración** protegido para gestionar todo el contenido.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Estilos | Tailwind CSS v4 |
| Componentes UI | shadcn/ui (solo admin) |
| Estado cliente | Zustand v5 |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Deploy | Netlify + @netlify/plugin-nextjs |

---

## Decisiones de arquitectura

| Decisión | Elección | Motivo |
|---|---|---|
| Data fetching público | Server Components + Supabase server client | Zero JS en cliente, SEO, FCP rápido |
| Data fetching admin | Zustand + service layer + browser client | UI optimista para CRUD |
| Auth | Middleware edge + doble guard en admin layout | Rápido + verificado en server |
| Tailwind config | Solo CSS `@theme` (sin JS config) | Estándar Tailwind v4 |
| YouTube embeds | `youtube-nocookie.com` | Privacy-enhanced, sin cookies de tracking |
| Convención de nombres | snake_case en DB / camelCase en app | Adaptadores en service layer |
| shadcn/ui | Solo panel admin | UI pública es custom para fidelidad de marca |

---

## Design System

### Paleta de colores
```
primary:   #0D1B2A  (azul profundo)
secondary: #1B263B  (azul intermedio)
accent:    #D4AF37  (dorado elegante)
light:     #F8F9FA  (blanco cálido)
```

### Tipografías
- **Cinzel** (Google Fonts) — títulos y headings (`font-display`)
- **Inter** (Google Fonts) — body y UI (`font-body`)

### Tokens en `globals.css`
```css
@theme {
  --color-primary:        #0D1B2A;
  --color-secondary:      #1B263B;
  --color-accent:         #D4AF37;
  --color-light:          #F8F9FA;
  --font-family-display:  "Cinzel", Georgia, serif;
  --font-family-body:     "Inter", system-ui, sans-serif;
  --radius-card:          0.75rem;
  --animate-fade-in:      fadeIn  0.4s ease-out;
  --animate-slide-up:     slideUp 0.5s cubic-bezier(0.16,1,0.3,1);
}
```

---

## Estructura del proyecto

```
e:/Proyectos dev/Faroc/
├── PLAN.md
├── CLAUDE.md
├── netlify.toml
├── next.config.ts
├── .env.local              (no commitear)
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── src/
    ├── app/
    │   ├── globals.css                  # @theme + keyframes + base styles
    │   ├── layout.tsx                   # Root layout: fonts, providers, metadata
    │   ├── page.tsx                     # Home: Hero + previews de secciones
    │   ├── peliculas/page.tsx           # Server Component
    │   ├── libros/page.tsx              # Server Component
    │   ├── musica/page.tsx              # Server Component
    │   ├── auth/callback/route.ts       # Supabase OAuth callback
    │   └── admin/
    │       ├── layout.tsx               # Guard server-side + AdminSidebar
    │       ├── page.tsx                 # Dashboard con stats
    │       ├── login/page.tsx           # Login form (client)
    │       ├── peliculas/
    │       │   ├── page.tsx             # Lista + eliminar
    │       │   └── [id]/page.tsx        # Crear / editar
    │       ├── libros/
    │       │   ├── page.tsx
    │       │   └── [id]/page.tsx
    │       └── musica/
    │           ├── page.tsx
    │           └── [id]/page.tsx
    ├── components/
    │   ├── ui/                          # shadcn primitives (auto-generados)
    │   ├── layout/
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   ├── AdminSidebar.tsx
    │   │   └── MobileMenu.tsx
    │   ├── public/
    │   │   ├── Hero.tsx
    │   │   ├── SectionHeader.tsx        # Título + subtítulo reutilizable
    │   │   ├── movies/
    │   │   │   ├── MovieGrid.tsx
    │   │   │   ├── MovieCard.tsx
    │   │   │   └── YoutubeEmbed.tsx     # iframe youtube-nocookie wrapper
    │   │   ├── books/
    │   │   │   ├── BookGrid.tsx
    │   │   │   └── BookCard.tsx
    │   │   └── music/
    │   │       ├── MusicSection.tsx     # Tabs por categoría (use client)
    │   │       ├── MusicCategoryTab.tsx
    │   │       └── SongCard.tsx
    │   └── admin/
    │       ├── DataTable.tsx            # Tabla CRUD genérica
    │       ├── ConfirmDeleteDialog.tsx
    │       ├── movies/MovieForm.tsx
    │       ├── books/BookForm.tsx
    │       └── music/SongForm.tsx
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts               # Browser singleton
    │   │   └── server.ts               # Server client (cookies async)
    │   ├── constants.ts                # ROUTES, TABLE_NAMES, MUSIC_CATEGORIES
    │   ├── validations.ts              # Zod schemas para los 3 forms
    │   └── utils.ts                    # cn(), formatDuration(), etc.
    ├── services/
    │   ├── movies.service.ts           # CRUD + adaptador snake_case→camelCase
    │   ├── books.service.ts
    │   └── music.service.ts
    ├── stores/
    │   ├── useMoviesStore.ts
    │   ├── useBooksStore.ts
    │   ├── useMusicStore.ts
    │   └── useAuthStore.ts
    ├── types/
    │   ├── app.types.ts                # Movie, Book, Song, MusicCategory
    │   └── database.types.ts           # Auto-generado: supabase gen types
    └── middleware.ts                   # Protege /admin/*
```

---

## Base de datos Supabase

### Tabla `movies`
```sql
CREATE TABLE public.movies (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  description   TEXT,
  youtube_id    TEXT NOT NULL,        -- Solo el ID, ej: "dQw4w9WgXcQ"
  external_url  TEXT,                 -- Link externo opcional (EWTN, etc.)
  thumbnail_url TEXT,
  year          SMALLINT,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  sort_order    SMALLINT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tabla `books`
```sql
CREATE TABLE public.books (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  author        TEXT NOT NULL,
  description   TEXT,
  cover_url     TEXT,
  purchase_url  TEXT,
  pdf_url       TEXT,
  year          SMALLINT,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  sort_order    SMALLINT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tabla `songs`
```sql
CREATE TYPE public.music_category AS ENUM (
  'oracion', 'estudio', 'reunion', 'fiesta'
);

CREATE TABLE public.songs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  artist        TEXT NOT NULL,
  category      public.music_category NOT NULL,
  youtube_id    TEXT,
  spotify_url   TEXT,
  external_url  TEXT,
  thumbnail_url TEXT,
  duration_sec  SMALLINT,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  sort_order    SMALLINT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### RLS (en las 3 tablas)
- SELECT público: solo `is_published = true`
- ALL para rol `authenticated` (admin)

### Storage bucket `media`
- Bucket público `media` para imágenes de portadas
- SELECT público, INSERT/UPDATE/DELETE solo para `authenticated`

### Trigger `updated_at`
```sql
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Aplicar a las 3 tablas con CREATE TRIGGER
```

---

## Auth Flow

```
Usuario no autenticado → /admin/* → middleware → redirect /admin/login
Usuario autenticado → /admin/login → redirect /admin
Login page → signInWithPassword → router.replace('/admin')
Admin layout → supabase.auth.getUser() → redirect si no hay user (doble guard)
Auth callback → /auth/callback → exchangeCodeForSession → redirect /admin
```

---

## Orden de implementación

### Fase 1 — Fundación
1. `create-next-app@latest` con TypeScript, App Router, Tailwind, src/
2. Instalar deps: `zustand @supabase/supabase-js @supabase/ssr react-hook-form @hookform/resolvers zod lucide-react`
3. Instalar shadcn/ui: `npx shadcn@latest init`
4. `src/app/globals.css` — `@theme` completo + keyframes
5. `src/lib/constants.ts` — ROUTES, TABLE_NAMES, MUSIC_CATEGORIES, labels
6. `src/types/app.types.ts` — Movie, Book, Song, MusicCategory interfaces
7. Supabase: crear proyecto, ejecutar SQL schema, configurar RLS + Storage bucket
8. `src/lib/supabase/client.ts` + `src/lib/supabase/server.ts`
9. `supabase gen types typescript --project-id ...` → `database.types.ts`

### Fase 2 — Auth
10. `src/middleware.ts` — protección de rutas `/admin/*`
11. `src/app/auth/callback/route.ts`
12. `src/stores/useAuthStore.ts`
13. `src/app/admin/login/page.tsx` — verificar flujo login/logout completo
14. `src/app/admin/layout.tsx` — guard server-side

### Fase 3 — Admin CRUD
15. Services: `movies.service.ts`, `books.service.ts`, `music.service.ts`
16. Stores: `useMoviesStore.ts`, `useBooksStore.ts`, `useMusicStore.ts`
17. `src/lib/validations.ts` — Zod schemas para los 3 forms
18. `DataTable.tsx` genérico + `ConfirmDeleteDialog.tsx`
19. Forms: `MovieForm.tsx`, `BookForm.tsx`, `SongForm.tsx`
20. Páginas admin con CRUD completo para los 3 tipos
21. `AdminSidebar.tsx` con logout

### Fase 4 — UI Pública
22. `Navbar.tsx` + `Footer.tsx`
23. `Hero.tsx` con animación slide-up
24. `YoutubeEmbed.tsx` → `MovieCard.tsx` → `MovieGrid.tsx`
25. `BookCard.tsx` → `BookGrid.tsx`
26. `SongCard.tsx` → `MusicCategoryTab.tsx` → `MusicSection.tsx` (tabs)
27. Páginas públicas como Server Components: `/peliculas`, `/libros`, `/musica`
28. `src/app/page.tsx` — homepage compuesta

### Fase 5 — Polish & Deploy
29. `generateMetadata` en páginas públicas
30. `loading.tsx` (skeletons) + `error.tsx` por segmento de ruta
31. Micro-animaciones en cards y transiciones de sección
32. `netlify.toml` + `next.config.ts` con `remotePatterns` para imágenes
33. Variables de entorno en Netlify UI (nunca en archivo)
34. Deploy y verificación completa en producción

---

## Verificación final

- [ ] Rutas públicas accesibles sin login, datos desde Supabase
- [ ] `/admin` redirige a `/admin/login` sin sesión activa
- [ ] Login/logout funciona correctamente
- [ ] CRUD completo: crear, editar, publicar/despublicar, eliminar en los 3 tipos
- [ ] YouTube embed con `youtube-nocookie.com` renderiza en modal
- [ ] Responsive correcto en mobile (375px), tablet (768px) y desktop (1280px+)
- [ ] Deploy en Netlify con SSR y auth funcionando
- [ ] Imágenes optimizadas con `next/image`
