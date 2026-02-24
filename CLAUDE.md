# CLAUDE.md — Faro Católico

Plataforma web católica: "Películas, libros y música para crecer en gracia".

---

## Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Estilos**: Tailwind CSS v4 (config solo en CSS con `@theme`, sin JS config)
- **Componentes UI**: shadcn/ui (solo panel admin)
- **Estado global**: Zustand v5 (no prop drilling)
- **Base de datos**: Supabase (PostgreSQL + Auth + Storage)
- **Deploy**: Netlify con `@netlify/plugin-nextjs`

---

## Prácticas de código

### Estilo general
- ES2025: usar optional chaining (`?.`), nullish coalescing (`??`), `structuredClone`, etc.
- Nombres descriptivos en **camelCase** para variables, funciones y propiedades
- No usar magic strings: definir todas las constantes en `src/lib/constants.ts`
- Aplicar DRY: extraer lógica repetida a funciones, hooks o componentes
- Comentarios solo cuando aporten valor real (no describir lo obvio)
- Desestructurar objetos y arrays cuando mejore la legibilidad

### Funciones y componentes
- Separar lógica de negocio del componente de UI
- Lógica de negocio en `src/services/` (funciones puras, sin UI)
- Lógica de estado en `src/stores/` (Zustand)
- Hooks reutilizables en `src/hooks/` cuando se encapsula estado + efectos
- Componentes pequeños y con una sola responsabilidad

### Next.js 15
- **Server Components por defecto** para páginas públicas (fetch en server, cero JS cliente)
- Usar `'use client'` solo donde sea necesario (tabs, modals, forms, stores)
- `cookies()`, `headers()` y `params` de rutas dinámicas son **async** — siempre `await`
- Usar `generateMetadata` en páginas para SEO
- Agregar `loading.tsx` y `error.tsx` por segmento de ruta

### Supabase
- Cliente browser en `src/lib/supabase/client.ts` (singleton, para Zustand y admin forms)
- Cliente server en `src/lib/supabase/server.ts` (con cookies async, para Server Components)
- Nunca usar el cliente browser en Server Components
- Nunca exponer la `SERVICE_ROLE_KEY` al cliente
- Adaptadores en service layer: DB usa `snake_case`, la app usa `camelCase`

### Zustand
- Sin prop drilling: consumir stores directamente donde se necesiten
- Stores en `src/stores/useXxxStore.ts`
- Selectores derivados fuera del store (evitar re-renders innecesarios)
- Devtools habilitados en desarrollo

### Formularios
- React Hook Form + Zod para validación
- Schemas Zod centralizados en `src/lib/validations.ts`
- Usar `@hookform/resolvers/zod`

### TypeScript
- Tipado estricto, sin `any`
- Tipos de dominio en `src/types/app.types.ts`
- Tipos de DB (auto-generados) en `src/types/database.types.ts`
- Preferir `interface` para objetos, `type` para uniones y aliases

---

## Design System

### Colores (via CSS `@theme`)
```
bg-primary   → #0D1B2A  fondo principal (azul profundo)
bg-secondary → #1B263B  fondo alternativo (azul intermedio)
text-accent  → #D4AF37  dorado para highlights y CTAs
text-light   → #F8F9FA  texto principal sobre fondos oscuros
```

### Tipografías
- `font-display` → Cinzel (serif) — títulos, headings
- `font-body` → Inter (sans-serif) — texto, UI

### Animaciones
- `animate-fade-in` — aparición suave (0.4s)
- `animate-slide-up` — entrada desde abajo (0.5s, spring)

### Cards
- Fondo `bg-secondary`, borde redondeado `rounded-card` (0.75rem)
- Sombra suave, hover con ligero scale o elevación
- Mobile-first: siempre diseñar para 375px primero

---

## Estructura de archivos importante

```
src/
├── lib/constants.ts         # ROUTES, TABLE_NAMES, MUSIC_CATEGORIES — fuente de verdad
├── lib/supabase/client.ts   # Browser Supabase (singleton)
├── lib/supabase/server.ts   # Server Supabase (async cookies)
├── lib/validations.ts       # Zod schemas
├── lib/utils.ts             # cn(), formatDuration(), etc.
├── services/                # Lógica de negocio (CRUD + adaptadores)
├── stores/                  # Estado global Zustand
├── types/app.types.ts       # Interfaces de dominio
└── middleware.ts            # Protección de rutas /admin/*
```

---

## Auth (Supabase)

- Solo el admin del movimiento tiene acceso al panel
- Login con email/password via `supabase.auth.signInWithPassword`
- Ruta `/admin/*` protegida en `middleware.ts` (edge) y en `app/admin/layout.tsx` (server)
- Crear el usuario admin directamente desde el dashboard de Supabase

---

## Variables de entorno

```bash
# .env.local — nunca commitear
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Las mismas variables se configuran en **Netlify UI** (no en archivos).

---

## Convenciones de archivos

- Componentes: `PascalCase.tsx`
- Hooks: `useNombreDescriptivo.ts`
- Stores: `useNombreStore.ts`
- Services: `nombre.service.ts`
- Constantes: `SCREAMING_SNAKE_CASE`
- Tipos/interfaces: `PascalCase`

---

## Lo que NO hacer

- No usar magic strings: siempre constantes
- No prop drilling: usar Zustand
- No `useEffect` para fetch en páginas públicas: usar Server Components
- No `any` en TypeScript
- No `getSession()` de Supabase en servidor: usar `getUser()` (seguro)
- No exponer `SERVICE_ROLE_KEY` al cliente
- No modificar archivos `ui/` de shadcn manualmente (se regeneran)
- No crear helpers para operaciones únicas (evitar sobre-ingeniería)
- No agregar features no pedidas
- No comentarios obvios ni documentación innecesaria
