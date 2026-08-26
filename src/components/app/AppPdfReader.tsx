'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const BookPdfViewer = dynamic(
  () => import('@/components/public/books/BookPdfViewer').then((module) => module.BookPdfViewer),
  { ssr: false }
)

interface AppPdfReaderProps {
  pdfUrl: string
  title: string
  author: string
  backHref: string
}

const isSupabaseUrl = (url: string) => url.includes('.supabase.co/storage/')

export function AppPdfReader({ pdfUrl, title, author, backHref }: AppPdfReaderProps) {
  const router = useRouter()
  const fileUrl = isSupabaseUrl(pdfUrl)
    ? pdfUrl
    : `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`

  return (
    <BookPdfViewer
      pdfUrl={fileUrl}
      title={title}
      author={author}
      onClose={() => router.replace(backHref)}
    />
  )
}
