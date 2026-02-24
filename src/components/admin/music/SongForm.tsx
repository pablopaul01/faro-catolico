'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { songSchema, type SongSchema } from '@/lib/validations'
import { createSong, updateSong } from '@/services/music.service'
import { useMusicStore } from '@/stores/useMusicStore'
import { ROUTES, MUSIC_CATEGORIES, MUSIC_CATEGORY_LABELS } from '@/lib/constants'
import type { Song } from '@/types/app.types'

interface SongFormProps {
  song?: Song
}

export const SongForm = ({ song }: SongFormProps) => {
  const router = useRouter()
  const addSong = useMusicStore((s) => s.addSong)
  const updateSongInStore = useMusicStore((s) => s.updateSong)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SongSchema>({
    resolver: zodResolver(songSchema),
    defaultValues: song
      ? {
          title:        song.title,
          artist:       song.artist,
          category:     song.category,
          youtubeId:    song.youtubeId    ?? '',
          spotifyUrl:   song.spotifyUrl   ?? '',
          externalUrl:  song.externalUrl  ?? '',
          thumbnailUrl: song.thumbnailUrl ?? '',
          durationSec:  song.durationSec  ?? undefined,
          isPublished:  song.isPublished,
          sortOrder:    song.sortOrder,
        }
      : { category: MUSIC_CATEGORIES[0], isPublished: false, sortOrder: 0 },
  })

  const onSubmit = async (data: SongSchema) => {
    setServerError(null)
    try {
      const payload = {
        ...data,
        youtubeId:    data.youtubeId    || null,
        spotifyUrl:   data.spotifyUrl   || null,
        externalUrl:  data.externalUrl  || null,
        thumbnailUrl: data.thumbnailUrl || null,
        durationSec:  data.durationSec  ?? null,
      }

      if (song) {
        const updated = await updateSong(song.id, payload)
        updateSongInStore(song.id, updated)
      } else {
        const created = await createSong(payload)
        addSong(created)
      }
      router.push(ROUTES.ADMIN_MUSIC)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Título *" error={errors.title?.message}>
          <input {...register('title')} placeholder="Ave María" className={inputClass} />
        </FormField>
        <FormField label="Artista *" error={errors.artist?.message}>
          <input {...register('artist')} placeholder="Taizé" className={inputClass} />
        </FormField>
      </div>

      {/* Categoría */}
      <FormField label="Momento *" error={errors.category?.message}>
        <select {...register('category')} className={inputClass}>
          {MUSIC_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {MUSIC_CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </FormField>

      {/* ID YouTube y duración */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="ID de YouTube (opcional)"
          hint="Solo el ID, no la URL"
          error={errors.youtubeId?.message}
        >
          <input {...register('youtubeId')} placeholder="dQw4w9WgXcQ" className={inputClass} />
        </FormField>
        <FormField label="Duración (segundos)" error={errors.durationSec?.message}>
          <input
            type="number"
            {...register('durationSec', { valueAsNumber: true })}
            placeholder="245"
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label="URL de Spotify (opcional)" error={errors.spotifyUrl?.message}>
        <input {...register('spotifyUrl')} placeholder="https://open.spotify.com/..." className={inputClass} />
      </FormField>

      <FormField label="URL externa (opcional)" error={errors.externalUrl?.message}>
        <input {...register('externalUrl')} placeholder="https://..." className={inputClass} />
      </FormField>

      <FormField label="URL de miniatura (opcional)" error={errors.thumbnailUrl?.message}>
        <input {...register('thumbnailUrl')} placeholder="https://..." className={inputClass} />
      </FormField>

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
          {isSubmitting ? 'Guardando...' : song ? 'Guardar cambios' : 'Crear canción'}
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

const inputClass =
  'w-full px-4 py-2.5 rounded-sm bg-primary border border-border text-light placeholder-light/30 focus:outline-none focus:border-accent transition-colors text-sm'

const FormField = ({
  label,
  hint,
  error,
  children,
}: {
  label:    string
  hint?:    string
  error?:   string
  children: React.ReactNode
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
