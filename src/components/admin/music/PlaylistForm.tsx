'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { playlistSchema, type PlaylistSchema } from '@/lib/validations'
import { createPlaylist, updatePlaylist } from '@/services/playlists.service'
import { usePlaylistsStore } from '@/stores/usePlaylistsStore'
import { ROUTES } from '@/lib/constants'
import type { Playlist, MusicCategory } from '@/types/app.types'

interface PlaylistFormProps {
  playlist?:  Playlist
  categories?: MusicCategory[]
}

const inputClass =
  'w-full px-4 py-2.5 rounded-sm bg-primary border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm'

const FormField = ({
  label, hint, error, children,
}: {
  label: string; hint?: string; error?: string; children: React.ReactNode
}) => (
  <div>
    <label className="block text-sm text-light/70 mb-1.5">
      {label}
      {hint && <span className="block text-xs text-light/30 mt-0.5">{hint}</span>}
    </label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
)

function getSpotifyEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (!u.hostname.includes('spotify.com')) return null
    const pathname = u.pathname.replace(/^\/intl-[a-z]+(-[a-z]+)?\//i, '/')
    return `https://open.spotify.com/embed${pathname}?utm_source=generator&theme=0`
  } catch {
    return null
  }
}

export const PlaylistForm = ({ playlist, categories = [] }: PlaylistFormProps) => {
  const router = useRouter()
  const addPlaylist    = usePlaylistsStore((s) => s.addPlaylist)
  const updateInStore  = usePlaylistsStore((s) => s.updatePlaylist)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PlaylistSchema>({
    resolver: zodResolver(playlistSchema),
    defaultValues: playlist
      ? {
          title:        playlist.title,
          description:  playlist.description  ?? '',
          spotifyUrl:   playlist.spotifyUrl,
          thumbnailUrl: playlist.thumbnailUrl ?? '',
          categoryIds:  playlist.categoryIds,
          isPublished:  playlist.isPublished,
          sortOrder:    playlist.sortOrder,
        }
      : { categoryIds: [], isPublished: false, sortOrder: 0, spotifyUrl: '' },
  })

  const selectedCategoryIds = watch('categoryIds') ?? []
  const spotifyUrl          = watch('spotifyUrl')
  const embedUrl            = spotifyUrl ? getSpotifyEmbedUrl(spotifyUrl) : null

  const toggleCategory = (catId: string) => {
    setValue(
      'categoryIds',
      selectedCategoryIds.includes(catId)
        ? selectedCategoryIds.filter((id) => id !== catId)
        : [...selectedCategoryIds, catId]
    )
  }

  const onSubmit = async (data: PlaylistSchema) => {
    setServerError(null)
    try {
      const payload = {
        ...data,
        categoryIds:  selectedCategoryIds,
        description:  data.description  || null,
        thumbnailUrl: data.thumbnailUrl || null,
      }

      if (playlist) {
        const updated = await updatePlaylist(playlist.id, payload)
        updateInStore(playlist.id, updated)
      } else {
        const created = await createPlaylist(payload)
        addPlaylist(created)
      }
      router.push(ROUTES.ADMIN_PLAYLISTS)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      <FormField label="Título *" error={errors.title?.message}>
        <input {...register('title')} placeholder="Canciones para la oración" className={inputClass} />
      </FormField>

      <FormField
        label="URL de la playlist de Spotify *"
        hint="Pega la URL completa de la playlist de Spotify"
        error={errors.spotifyUrl?.message}
      >
        <input
          {...register('spotifyUrl')}
          placeholder="https://open.spotify.com/playlist/..."
          className={inputClass}
        />
      </FormField>

      {/* Preview del embed */}
      {embedUrl && (
        <div>
          <p className="text-xs text-light/40 mb-2">Vista previa:</p>
          <iframe
            src={embedUrl}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-sm border-0"
            title="Preview Spotify"
          />
        </div>
      )}

      <FormField label="Descripción (opcional)" error={errors.description?.message}>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Breve descripción de la playlist..."
          className={`${inputClass} resize-none`}
        />
      </FormField>

      <FormField label="URL de miniatura (opcional)" error={errors.thumbnailUrl?.message}>
        <input {...register('thumbnailUrl')} placeholder="https://..." className={inputClass} />
      </FormField>

      {/* Categorías */}
      {categories.length > 0 && (
        <FormField label="Categorías" error={errors.categoryIds?.message}>
          <div className="flex flex-wrap gap-2 mt-1">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-sm transition-colors cursor-pointer ${
                  selectedCategoryIds.includes(cat.id)
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'border-border text-light/60 hover:border-accent/40 hover:text-light'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="sr-only"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </FormField>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Orden" error={errors.sortOrder?.message}>
          <input
            type="number"
            {...register('sortOrder', { valueAsNumber: true })}
            className={inputClass}
          />
        </FormField>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" {...register('isPublished')} className="w-4 h-4 accent-accent" />
        <span className="text-light/80 text-sm">Publicar (visible en el sitio)</span>
      </label>

      {serverError && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 px-3 py-2 rounded-sm">
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-accent text-primary font-semibold rounded-sm hover:bg-accent/90 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Guardando...' : playlist ? 'Guardar cambios' : 'Crear playlist'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 text-light/50 hover:text-light text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
