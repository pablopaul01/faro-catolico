import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { YoutubeChannel, YoutubeChannelFormPayload } from '@/types/app.types'

type CategoryRow = { category_id: string }

const YTCH_SELECT = `*, ${TABLE_NAMES.YOUTUBE_CHANNEL_CATEGORY_ITEMS}(category_id)`

function adaptYoutubeChannel(row: Record<string, unknown>): YoutubeChannel {
  return {
    id:           row.id           as string,
    name:         row.name         as string,
    description:  row.description  as string | null,
    channelUrl:   row.channel_url  as string,
    thumbnailUrl: row.thumbnail_url as string | null,
    categoryIds:  (row[TABLE_NAMES.YOUTUBE_CHANNEL_CATEGORY_ITEMS] as CategoryRow[] ?? []).map((r) => r.category_id),
    isPublished:  row.is_published as boolean,
    sortOrder:    row.sort_order   as number,
    createdAt:    row.created_at   as string,
    updatedAt:    row.updated_at   as string,
  }
}

export async function fetchAllYoutubeChannels(): Promise<YoutubeChannel[]> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.YOUTUBE_CHANNELS)
    .select(YTCH_SELECT)
    .order('sort_order', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(adaptYoutubeChannel)
}

export async function createYoutubeChannel(payload: YoutubeChannelFormPayload): Promise<YoutubeChannel> {
  const supabase = getSupabaseBrowserClient()
  const { data: channel, error } = await supabase
    .from(TABLE_NAMES.YOUTUBE_CHANNELS)
    .insert({
      name:          payload.name,
      description:   payload.description  || null,
      channel_url:   payload.channelUrl,
      thumbnail_url: payload.thumbnailUrl || null,
      is_published:  payload.isPublished,
      sort_order:    payload.sortOrder,
    })
    .select(YTCH_SELECT)
    .single()
  if (error) throw new Error(error.message)

  if (payload.categoryIds.length > 0) {
    const { error: catErr } = await supabase
      .from(TABLE_NAMES.YOUTUBE_CHANNEL_CATEGORY_ITEMS)
      .insert(payload.categoryIds.map((cid) => ({ channel_id: channel.id, category_id: cid })))
    if (catErr) throw new Error(catErr.message)
  }

  return adaptYoutubeChannel(channel as Record<string, unknown>)
}

export async function updateYoutubeChannel(id: string, payload: YoutubeChannelFormPayload): Promise<YoutubeChannel> {
  const supabase = getSupabaseBrowserClient()
  const { data: channel, error } = await supabase
    .from(TABLE_NAMES.YOUTUBE_CHANNELS)
    .update({
      name:          payload.name,
      description:   payload.description  || null,
      channel_url:   payload.channelUrl,
      thumbnail_url: payload.thumbnailUrl || null,
      is_published:  payload.isPublished,
      sort_order:    payload.sortOrder,
    })
    .eq('id', id)
    .select(YTCH_SELECT)
    .single()
  if (error) throw new Error(error.message)

  const { error: delErr } = await supabase
    .from(TABLE_NAMES.YOUTUBE_CHANNEL_CATEGORY_ITEMS)
    .delete()
    .eq('channel_id', id)
  if (delErr) throw new Error(delErr.message)

  if (payload.categoryIds.length > 0) {
    const { error: catErr } = await supabase
      .from(TABLE_NAMES.YOUTUBE_CHANNEL_CATEGORY_ITEMS)
      .insert(payload.categoryIds.map((cid) => ({ channel_id: id, category_id: cid })))
    if (catErr) throw new Error(catErr.message)
  }

  return adaptYoutubeChannel(channel as Record<string, unknown>)
}

export async function deleteYoutubeChannel(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from(TABLE_NAMES.YOUTUBE_CHANNELS).delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function toggleYoutubeChannelPublish(id: string, current: boolean): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.YOUTUBE_CHANNELS)
    .update({ is_published: !current })
    .eq('id', id)
  if (error) throw new Error(error.message)
}
