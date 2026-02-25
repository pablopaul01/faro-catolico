'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { youtubePlaylistSchema, type YoutubePlaylistSchema } from '@/lib/validations'
import { createYoutubePlaylist, updateYoutubePlaylist } from '@/services/youtubePlaylistsService'
import { useYoutubePlaylistsStore } from '@/stores/useYoutubePlaylistsStore'
import { ROUTES, YOUTUBE_NOCOOKIE_BASE } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { YoutubePlaylist, MovieCategory } from '@/types/app.types'

interface YoutubePlaylistFormProps {
  playlist?:   YoutubePlaylist
  categories?: MovieCategory[]
}

const inputCls  = 'w-full px-3 py-2 rounded-sm bg-background border border-border text-sm focus:outline-none focus:border-accent transition-colors'
const labelCls  = 'block text-sm font-medium text-foreground/80 mb-1'

export function YoutubePlaylistForm({ playlist, categories = [] }: YoutubePlaylistFormProps) {
  const router = useRouter()
  const { addPlaylist, updatePlaylist } = useYoutubePlaylistsStore()
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(playlist?.categoryIds ?? [])
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<YoutubePlaylistSchema>({
    resolver: zodResolver(youtubePlaylistSchema) as unknown as Resolver<YoutubePlaylistSchema>,
    defaultValues: {
      title:         playlist?.title         ?? '',
      description:   playlist?.description   ?? '',
      youtubeListId: playlist?.youtubeListId ?? '',
      thumbnailUrl:  playlist?.thumbnailUrl  ?? '',
      categoryIds:   playlist?.categoryIds   ?? [],
      isPublished:   playlist?.isPublished   ?? false,
      sortOrder:     playlist?.sortOrder     ?? 0,
    },
  })

  const youtubeListId = watch('youtubeListId')
  const embedUrl = youtubeListId
    ? `${YOUTUBE_NOCOOKIE_BASE}/videoseries?list=${youtubeListId}`
    : null

  const toggleCategory = (id: string) => {
    const next = selectedCategoryIds.includes(id)
      ? selectedCategoryIds.filter((c) => c !== id)
      : [...selectedCategoryIds, id]
    setSelectedCategoryIds(next)
    setValue('categoryIds', next)
  }

  const onSubmit = async (data: YoutubePlaylistSchema) => {
    setError(null)
    try {
      const payload = { ...data, categoryIds: selectedCategoryIds, description: data.description || null, thumbnailUrl: data.thumbnailUrl || null }
      if (playlist) {
        const updated = await updateYoutubePlaylist(playlist.id, payload)
        updatePlaylist(playlist.id, updated)
      } else {
        const created = await createYoutubePlaylist(payload)
        addPlaylist(created)
      }
      router.push(ROUTES.ADMIN_YOUTUBE_PLAYLISTS)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-700/40 rounded-sm text-red-400 text-sm">{error}</div>
      )}

      <div>
        <label className={labelCls}>Título *</label>
        <input {...register('title')} placeholder="Ej: Documentales católicos" className={inputCls} />
        {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className={labelCls}>ID de la playlist de YouTube *</label>
        <p className="text-xs text-muted-foreground mb-1">
          El código que aparece después de <code className="bg-muted px-1 rounded">?list=</code> en la URL de YouTube
        </p>
        <input {...register('youtubeListId')} placeholder="Ej: PLxxxxxxxxxxxxxxxxxxxxxx" className={inputCls} />
        {errors.youtubeListId && <p className="text-xs text-red-400 mt-1">{errors.youtubeListId.message}</p>}
      </div>

      {embedUrl && (
        <div className="rounded-sm overflow-hidden border border-border">
          <iframe
            src={embedUrl}
            width="100%"
            height="200"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="block"
          />
        </div>
      )}

      <div>
        <label className={labelCls}>Descripción</label>
        <textarea {...register('description')} rows={3} className={cn(inputCls, 'resize-none')} />
      </div>

      <div>
        <label className={labelCls}>URL de miniatura (opcional)</label>
        <input {...register('thumbnailUrl')} placeholder="https://..." className={inputCls} />
        {errors.thumbnailUrl && <p className="text-xs text-red-400 mt-1">{errors.thumbnailUrl.message}</p>}
      </div>

      {categories.length > 0 && (
        <div>
          <label className={labelCls}>Categorías</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {categories.map((cat) => {
              const active = selectedCategoryIds.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-sm text-xs transition-all',
                    active ? 'bg-accent text-primary font-semibold' : 'border border-border text-muted-foreground hover:border-accent/50'
                  )}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Orden</label>
          <input {...register('sortOrder', { valueAsNumber: true })} type="number" min={0} className={inputCls} />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register('isPublished')} type="checkbox" className="w-4 h-4 accent-[hsl(var(--accent))]" />
            <span className="text-sm">Publicado</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-accent text-primary font-semibold rounded-sm hover:bg-accent/90 transition-colors disabled:opacity-60 text-sm"
        >
          {isSubmitting ? 'Guardando...' : playlist ? 'Actualizar' : 'Crear playlist'}
        </button>
        <button
          type="button"
          onClick={() => router.push(ROUTES.ADMIN_YOUTUBE_PLAYLISTS)}
          className="px-5 py-2 border border-border rounded-sm text-sm hover:border-accent/40 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
