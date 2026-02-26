import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { TABLE_NAMES }            from '@/lib/constants'
import type { Report, ReportContentType, ReportStatus } from '@/types/app.types'

function adaptReport(row: Record<string, unknown>): Report {
  return {
    id:           row.id           as string,
    contentType:  row.content_type as ReportContentType,
    contentId:    row.content_id   as string,
    contentTitle: row.content_title as string,
    reason:       row.reason       as string,
    status:       row.status       as ReportStatus,
    createdAt:    row.created_at   as string,
  }
}

export async function createReport(payload: {
  contentType:  ReportContentType
  contentId:    string
  contentTitle: string
  reason:       string
}): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from(TABLE_NAMES.REPORTS).insert({
    content_type:  payload.contentType,
    content_id:    payload.contentId,
    content_title: payload.contentTitle,
    reason:        payload.reason,
  })
  if (error) throw error
}

export async function fetchAllReports(): Promise<Report[]> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from(TABLE_NAMES.REPORTS)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(adaptReport)
}

export async function updateReportStatus(id: string, status: ReportStatus): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from(TABLE_NAMES.REPORTS)
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

export async function deleteReport(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from(TABLE_NAMES.REPORTS).delete().eq('id', id)
  if (error) throw error
}
