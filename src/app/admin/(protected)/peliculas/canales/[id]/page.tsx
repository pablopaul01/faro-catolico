import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { YoutubeChannelForm } from '@/components/admin/movies/YoutubeChannelForm'
import type { YoutubeChannel, MovieCategory } from '@/types/app.types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditYoutubeChannelPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const [channelRes, catsRes] = await Promise.all([
    supabase
      .from(TABLE_NAMES.YOUTUBE_CHANNELS)
      .select(`*, ${TABLE_NAMES.YOUTUBE_CHANNEL_CATEGORY_ITEMS}(category_id)`)
      .eq('id', id)
      .single(),
    supabase.from(TABLE_NAMES.MOVIE_CATEGORIES).select('*').order('sort_order', { ascending: true }),
  ])

  if (channelRes.error || !channelRes.data) notFound()

  const row = channelRes.data
  const channel: YoutubeChannel = {
    id:           row.id,
    name:         row.name,
    description:  row.description,
    channelUrl:   row.channel_url,
    thumbnailUrl: row.thumbnail_url,
    categoryIds:  (row.youtube_channel_category_items as { category_id: string }[] ?? []).map((r) => r.category_id),
    isPublished:  row.is_published,
    sortOrder:    row.sort_order,
    createdAt:    row.created_at,
    updatedAt:    row.updated_at,
  }

  const categories: MovieCategory[] = (catsRes.data ?? []).map((r) => ({
    id: r.id, name: r.name, sortOrder: r.sort_order, createdAt: r.created_at,
  }))

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Editar canal</h1>
      <p className="text-light/50 text-sm mb-8">{channel.name}</p>
      <YoutubeChannelForm channel={channel} categories={categories} />
    </div>
  )
}
