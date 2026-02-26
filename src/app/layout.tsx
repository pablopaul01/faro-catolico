import type { Metadata, Viewport } from 'next'
import { Cinzel, Inter } from 'next/font/google'
import Script from 'next/script'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants'
import './globals.css'

// ─────────────────────────────────────────────
// Fuentes Google via next/font (zero CLS, self-hosted)
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Metadata del sitio
// ─────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title:       SITE_NAME,
    description: SITE_DESCRIPTION,
    url:         SITE_URL,
    siteName:    SITE_NAME,
    locale:      'es_AR',
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       SITE_NAME,
    description: SITE_DESCRIPTION,
  },
}

export const viewport: Viewport = {
  themeColor:   '#0D1B2A',
  colorScheme:  'dark',
  initialScale: 1,
  width:        'device-width',
}

// ─────────────────────────────────────────────
// Layout raíz
// ─────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${cinzel.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        {children}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="58cf83ae-1a96-4045-b994-5ceec589978b"
        />
      </body>
    </html>
  )
}
