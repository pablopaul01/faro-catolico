import type { Metadata, Viewport } from 'next'
import { Cinzel, Inter } from 'next/font/google'
import '../../app/globals.css'
import { AppNavigation } from '@/components/app/AppHome'
import { AppDpadNavigation } from '@/components/app/AppDpadNavigation'
import { AppBackHandler } from '@/components/app/AppBackHandler'
import { AppIntro } from '@/components/app/AppIntro'

const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cinzel',
  weight: ['400', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Faro Católico',
  description: 'Contenido católico para crecer en gracia.',
}

export const viewport: Viewport = {
  themeColor: '#0D1B2A',
  colorScheme: 'dark',
  initialScale: 1,
  width: 'device-width',
  viewportFit: 'cover',
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-primary text-light">
        <AppIntro />
        <AppNavigation />
        <AppDpadNavigation />
        <AppBackHandler />
        {children}
      </body>
    </html>
  )
}
