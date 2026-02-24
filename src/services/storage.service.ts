import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { STORAGE_BUCKETS } from '@/lib/constants'

/** Sube un PDF al bucket `media` y retorna la URL pública */
export const uploadPdf = async (file: File): Promise<string> => {
  const supabase = getSupabaseBrowserClient()

  const ext  = file.name.split('.').pop() ?? 'pdf'
  const path = `pdfs/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.MEDIA)
    .upload(path, file, { contentType: 'application/pdf', upsert: false })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(STORAGE_BUCKETS.MEDIA).getPublicUrl(path)
  return data.publicUrl
}
