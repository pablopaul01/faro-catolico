import type { Metadata, Viewport } from 'next'
import { Cinzel, Inter } from 'next/font/google'
import Script from 'next/script'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants'
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
    images: [{
      url:    '/og-image.png',
      width:  1200,
      height: 630,
      alt:    `${SITE_NAME} — Películas, libros y música para crecer en gracia`,
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       SITE_NAME,
    description: SITE_DESCRIPTION,
    images:      ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor:   '#0D1B2A',
  colorScheme:  'dark',
  initialScale: 1,
  width:        'device-width',
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${cinzel.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
      </head>
      <body className="flex flex-col min-h-screen">
        <ScrollToTop />
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="58cf83ae-1a96-4045-b994-5ceec589978b"
        />
      </body>
    </html>
  )
}
