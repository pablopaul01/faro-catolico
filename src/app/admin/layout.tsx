import type { Viewport } from 'next'
import { Cinzel, Inter } from 'next/font/google'
import '../globals.css'

const cinzel = Cinzel({
  subsets:  ['latin'],
  display:  'swap',
  variable: '--font-cinzel',
  weight:   ['400', '600', '700'],
})

const inter = Inter({
  subsets:  ['latin'],
  display:  'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  themeColor:   '#0D1B2A',
  colorScheme:  'dark',
  initialScale: 1,
  width:        'device-width',
}

// Nunca cachear páginas de admin — evita mismatch de chunks entre deploys
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${cinzel.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  )
}
