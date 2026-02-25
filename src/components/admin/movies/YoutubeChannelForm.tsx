'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { youtubeChannelSchema, type YoutubeChannelSchema } from '@/lib/validations'
import { createYoutubeChannel, updateYoutubeChannel } from '@/services/youtubeChannels.service'
import { useYoutubeChannelsStore } from '@/stores/useYoutubeChannelsStore'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { YoutubeChannel, MovieCategory } from '@/types/app.types'

interface YoutubeChannelFormProps {
  channel?:    YoutubeChannel
  categories?: MovieCategory[]
}

const inputCls = 'w-full px-3 py-2 rounded-sm bg-background border border-border text-sm focus:outline-none focus:border-accent transition-colors'
const labelCls = 'block text-sm font-medium text-foreground/80 mb-1'

export function YoutubeChannelForm({ channel, categories = [] }: YoutubeChannelFormProps) {
  const router = useRouter()
  const { addChannel, updateChannel } = useYoutubeChannelsStore()
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(channel?.categoryIds ?? [])
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<YoutubeChannelSchema>({
    resolver: zodResolver(youtubeChannelSchema) as unknown as Resolver<YoutubeChannelSchema>,
    defaultValues: {
      name:         channel?.name         ?? '',
      description:  channel?.description  ?? '',
      channelUrl:   channel?.channelUrl   ?? '',
      thumbnailUrl: channel?.thumbnailUrl ?? '',
      categoryIds:  channel?.categoryIds  ?? [],
      isPublished:  channel?.isPublished  ?? false,
      sortOrder:    channel?.sortOrder    ?? 0,
    },
  })

  const toggleCategory = (id: string) => {
    const next = selectedCategoryIds.includes(id)
      ? selectedCategoryIds.filter((c) => c !== id)
      : [...selectedCategoryIds, id]
    setSelectedCategoryIds(next)
    setValue('categoryIds', next)
  }

  const onSubmit = async (data: YoutubeChannelSchema) => {
    setError(null)
    try {
      const payload = { ...data, categoryIds: selectedCategoryIds, description: data.description || null, thumbnailUrl: data.thumbnailUrl || null }
      if (channel) {
        const updated = await updateYoutubeChannel(channel.id, payload)
        updateChannel(channel.id, updated)
      } else {
        const created = await createYoutubeChannel(payload)
        addChannel(created)
      }
      router.push(ROUTES.ADMIN_YOUTUBE_CHANNELS)
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
        <label className={labelCls}>Nombre del canal *</label>
        <input {...register('name')} placeholder="Ej: Padre Fortea Oficial" className={inputCls} />
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelCls}>URL del canal *</label>
        <p className="text-xs text-muted-foreground mb-1">URL completa del canal en YouTube</p>
        <input {...register('channelUrl')} placeholder="https://www.youtube.com/@nombrecanal" className={inputCls} />
        {errors.channelUrl && <p className="text-xs text-red-400 mt-1">{errors.channelUrl.message}</p>}
      </div>

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
          {isSubmitting ? 'Guardando...' : channel ? 'Actualizar' : 'Crear canal'}
        </button>
        <button
          type="button"
          onClick={() => router.push(ROUTES.ADMIN_YOUTUBE_CHANNELS)}
          className="px-5 py-2 border border-border rounded-sm text-sm hover:border-accent/40 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
