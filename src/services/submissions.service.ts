import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { Submission } from '@/types/app.types'

function adaptSubmission(row: Record<string, unknown>): Submission {
  return {
    id:             row.id              as string,
    type:           row.type            as Submission['type'],
    title:          row.title           as string,
    categoryIds:    (row.category_ids   as string[] | null) ?? [],
    platformIds:    (row.platform_ids   as string[] | null) ?? [],
    description:    row.description     as string | null,
    year:           row.year            as number | null,
    youtubeId:      row.youtube_id      as string | null,
    dailymotionId:  row.dailymotion_id  as string | null,
    externalUrl:    row.external_url    as string | null,
    thumbnailUrl:   row.thumbnail_url  as string | null,
    author:         row.author         as string | null,
    coverUrl:       row.cover_url      as string | null,
    purchaseUrl:    row.purchase_url   as string | null,
    pdfUrl:         row.pdf_url        as string | null,
    artist:         row.artist         as string | null,
    spotifyUrl:     row.spotify_url    as string | null,
    durationSec:    row.duration_sec   as number | null,
    submitterName:  row.submitter_name  as string | null,
    submitterEmail: row.submitter_email as string | null,
    notes:          row.notes          as string | null,
    status:         row.status         as Submission['status'],
    createdAt:      row.created_at     as string,
  }
}

export async function createSubmission(payload: {
  type:            'pelicula' | 'libro' | 'cancion' | 'playlist' | 'youtube_playlist' | 'youtube_channel'
  title:           string
  categoryIds?:    string[]
  platformIds?:    string[]
  description?:    string
  year?:           number
  youtubeId?:      string
  dailymotionId?:  string
  externalUrl?:    string
  thumbnailUrl?:   string
  author?:         string
  coverUrl?:       string
  purchaseUrl?:    string
  pdfUrl?:         string
  artist?:         string
  spotifyUrl?:     string
  submitterName?:  string
  submitterEmail?: string
  notes?:          string
}): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const row: Record<string, unknown> = {
    type:            payload.type,
    title:           payload.title,
    description:     payload.description     || null,
    year:            payload.year            || null,
    youtube_id:      payload.youtubeId       || null,
    external_url:    payload.externalUrl     || null,
    thumbnail_url:   payload.thumbnailUrl    || null,
    author:          payload.author          || null,
    cover_url:       payload.coverUrl        || null,
    purchase_url:    payload.purchaseUrl     || null,
    pdf_url:         payload.pdfUrl          || null,
    artist:          payload.artist          || null,
    spotify_url:     payload.spotifyUrl      || null,
    submitter_name:  payload.submitterName   || null,
    submitter_email: payload.submitterEmail  || null,
    notes:           payload.notes           || null,
  }
  // Columnas opcionales — solo se incluyen si existen en la DB (evita error PGRST204)
  if (payload.categoryIds?.length)  row.category_ids   = payload.categoryIds
  if (payload.platformIds?.length)  row.platform_ids   = payload.platformIds
  if (payload.dailymotionId)        row.dailymotion_id = payload.dailymotionId

  const { error } = await supabase.from(TABLE_NAMES.SUBMISSIONS).insert(row)
  if (error) throw new Error(error.message)
}

export async function fetchAllSubmissions(): Promise<Submission[]> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.SUBMISSIONS)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(adaptSubmission)
}

export async function approveSubmission(sub: Submission): Promise<void> {
  const supabase = getSupabaseBrowserClient()

  if (sub.type === 'pelicula') {
    const { data: movie, error } = await supabase.from(TABLE_NAMES.MOVIES).insert({
      title:          sub.title,
      description:    sub.description,
      year:           sub.year,
      youtube_id:     sub.youtubeId      ?? '',
      dailymotion_id: sub.dailymotionId  ?? null,
      external_url:   sub.externalUrl,
      thumbnail_url:  sub.thumbnailUrl,
      is_published:   true,
      sort_order:     0,
    }).select('id').single()
    if (error) throw new Error(error.message)
    if (sub.categoryIds.length > 0) {
      const { error: catErr } = await supabase.from(TABLE_NAMES.MOVIE_CATEGORY_ITEMS).insert(
        sub.categoryIds.map((cid) => ({ movie_id: movie.id, category_id: cid }))
      )
      if (catErr) throw new Error(catErr.message)
    }
    if (sub.platformIds.length > 0) {
      const { error: platErr } = await supabase.from(TABLE_NAMES.MOVIE_PLATFORM_ITEMS).insert(
        sub.platformIds.map((pid) => ({ movie_id: movie.id, platform_id: pid }))
      )
      if (platErr) throw new Error(platErr.message)
    }
  } else if (sub.type === 'libro') {
    const { data: book, error } = await supabase.from(TABLE_NAMES.BOOKS).insert({
      title:        sub.title,
      author:       sub.author ?? '',
      description:  sub.description,
      year:         sub.year,
      cover_url:    sub.coverUrl,
      purchase_url: sub.purchaseUrl,
      pdf_url:      sub.pdfUrl,
      is_published: true,
      sort_order:   0,
    }).select('id').single()
    if (error) throw new Error(error.message)
    if (sub.categoryIds.length > 0) {
      const { error: catErr } = await supabase.from(TABLE_NAMES.BOOK_CATEGORY_ITEMS).insert(
        sub.categoryIds.map((cid) => ({ book_id: book.id, category_id: cid }))
      )
      if (catErr) throw new Error(catErr.message)
    }
  } else if (sub.type === 'cancion') {
    const { data: song, error } = await supabase.from(TABLE_NAMES.SONGS).insert({
      title:         sub.title,
      artist:        sub.artist ?? '',
      youtube_id:    sub.youtubeId,
      spotify_url:   sub.spotifyUrl,
      external_url:  sub.externalUrl,
      thumbnail_url: sub.thumbnailUrl,
      duration_sec:  sub.durationSec,
      is_published:  true,
      sort_order:    0,
    }).select('id').single()
    if (error) throw new Error(error.message)
    if (sub.categoryIds.length > 0) {
      const { error: catErr } = await supabase.from(TABLE_NAMES.SONG_CATEGORIES).insert(
        sub.categoryIds.map((cid) => ({ song_id: song.id, category_id: cid }))
      )
      if (catErr) throw new Error(catErr.message)
    }
  } else if (sub.type === 'playlist') {
    const { data: playlist, error } = await supabase.from(TABLE_NAMES.PLAYLISTS).insert({
      title:         sub.title,
      description:   sub.description,
      spotify_url:   sub.spotifyUrl ?? '',
      thumbnail_url: sub.thumbnailUrl,
      is_published:  true,
      sort_order:    0,
    }).select('id').single()
    if (error) throw new Error(error.message)
    if (sub.categoryIds.length > 0) {
      const { error: catErr } = await supabase.from(TABLE_NAMES.PLAYLIST_CATEGORY_ITEMS).insert(
        sub.categoryIds.map((cid) => ({ playlist_id: playlist.id, category_id: cid }))
      )
      if (catErr) throw new Error(catErr.message)
    }
  } else if (sub.type === 'youtube_playlist') {
    const { data: ytpl, error } = await supabase.from(TABLE_NAMES.YOUTUBE_PLAYLISTS).insert({
      title:           sub.title,
      description:     sub.description,
      youtube_list_id: sub.youtubeId ?? '',
      thumbnail_url:   sub.thumbnailUrl,
      is_published:    true,
      sort_order:      0,
    }).select('id').single()
    if (error) throw new Error(error.message)
    if (sub.categoryIds.length > 0) {
      const { error: catErr } = await supabase.from(TABLE_NAMES.YOUTUBE_PLAYLIST_CATEGORY_ITEMS).insert(
        sub.categoryIds.map((cid) => ({ playlist_id: ytpl.id, category_id: cid }))
      )
      if (catErr) throw new Error(catErr.message)
    }
  } else if (sub.type === 'youtube_channel') {
    const { data: ytch, error } = await supabase.from(TABLE_NAMES.YOUTUBE_CHANNELS).insert({
      name:          sub.title,
      description:   sub.description,
      channel_url:   sub.externalUrl ?? '',
      thumbnail_url: sub.thumbnailUrl,
      is_published:  true,
      sort_order:    0,
    }).select('id').single()
    if (error) throw new Error(error.message)
    if (sub.categoryIds.length > 0) {
      const { error: catErr } = await supabase.from(TABLE_NAMES.YOUTUBE_CHANNEL_CATEGORY_ITEMS).insert(
        sub.categoryIds.map((cid) => ({ channel_id: ytch.id, category_id: cid }))
      )
      if (catErr) throw new Error(catErr.message)
    }
  }

  const { error } = await supabase
    .from(TABLE_NAMES.SUBMISSIONS)
    .update({ status: 'aprobado' })
    .eq('id', sub.id)
  if (error) throw new Error(error.message)
}

export async function rejectSubmission(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.SUBMISSIONS)
    .update({ status: 'rechazado' })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function updateSubmission(id: string, payload: {
  title?:        string | null
  description?:  string | null
  year?:         number | null
  youtubeId?:    string | null
  externalUrl?:  string | null
  thumbnailUrl?: string | null
  author?:       string | null
  coverUrl?:     string | null
  purchaseUrl?:  string | null
  pdfUrl?:       string | null
  artist?:       string | null
  spotifyUrl?:   string | null
}): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.SUBMISSIONS)
    .update({
      title:         payload.title,
      description:   payload.description,
      year:          payload.year,
      youtube_id:    payload.youtubeId,
      external_url:  payload.externalUrl,
      thumbnail_url: payload.thumbnailUrl,
      author:        payload.author,
      cover_url:     payload.coverUrl,
      purchase_url:  payload.purchaseUrl,
      pdf_url:       payload.pdfUrl,
      artist:        payload.artist,
      spotify_url:   payload.spotifyUrl,
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteSubmission(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { data: sub } = await supabase
    .from(TABLE_NAMES.SUBMISSIONS)
    .select('type, pdf_url')
    .eq('id', id)
    .single()
  if (sub?.type === 'libro' && sub.pdf_url?.includes('/storage/v1/object/public/media/')) {
    const filePath = sub.pdf_url.split('/storage/v1/object/public/media/')[1]
    await supabase.storage.from('media').remove([filePath]) // best-effort
  }
  const { error } = await supabase
    .from(TABLE_NAMES.SUBMISSIONS)
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}
