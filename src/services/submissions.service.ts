import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES } from '@/lib/constants'
import type { Submission } from '@/types/app.types'

function adaptSubmission(row: Record<string, unknown>): Submission {
  return {
    id:             row.id             as string,
    type:           row.type           as Submission['type'],
    title:          row.title          as string,
    description:    row.description    as string | null,
    year:           row.year           as number | null,
    youtubeId:      row.youtube_id     as string | null,
    externalUrl:    row.external_url   as string | null,
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
  type:           'pelicula' | 'libro' | 'cancion'
  title:          string
  description?:   string
  year?:          number
  youtubeId?:     string
  externalUrl?:   string
  thumbnailUrl?:  string
  author?:        string
  coverUrl?:      string
  purchaseUrl?:   string
  pdfUrl?:        string
  artist?:        string
  spotifyUrl?:    string
  submitterName?:  string
  submitterEmail?: string
  notes?:         string
}): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from(TABLE_NAMES.SUBMISSIONS).insert({
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
  })
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
    const { error } = await supabase.from(TABLE_NAMES.MOVIES).insert({
      title:         sub.title,
      description:   sub.description,
      year:          sub.year,
      youtube_id:    sub.youtubeId   ?? '',
      external_url:  sub.externalUrl,
      thumbnail_url: sub.thumbnailUrl,
      is_published:  true,
      sort_order:    0,
    })
    if (error) throw new Error(error.message)
  } else if (sub.type === 'libro') {
    const { error } = await supabase.from(TABLE_NAMES.BOOKS).insert({
      title:        sub.title,
      author:       sub.author ?? '',
      description:  sub.description,
      year:         sub.year,
      cover_url:    sub.coverUrl,
      purchase_url: sub.purchaseUrl,
      pdf_url:      sub.pdfUrl,
      is_published: true,
      sort_order:   0,
    })
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from(TABLE_NAMES.SONGS).insert({
      title:         sub.title,
      artist:        sub.artist ?? '',
      youtube_id:    sub.youtubeId,
      spotify_url:   sub.spotifyUrl,
      external_url:  sub.externalUrl,
      thumbnail_url: sub.thumbnailUrl,
      duration_sec:  sub.durationSec,
      is_published:  true,
      sort_order:    0,
    })
    if (error) throw new Error(error.message)
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
  const { error } = await supabase
    .from(TABLE_NAMES.SUBMISSIONS)
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}
