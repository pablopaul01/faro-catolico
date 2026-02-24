import Image from 'next/image'
import Link from 'next/link'
import { ROUTES, SITE_NAME, SITE_TAGLINE } from '@/lib/constants'

const contentLinks = [
  { href: ROUTES.MOVIES, label: 'Películas' },
  { href: ROUTES.BOOKS,  label: 'Libros'    },
  { href: ROUTES.MUSIC,  label: 'Música'    },
] as const

const communityLinks = [
  { href: ROUTES.PROPOSE,     label: 'Sugerir contenido' },
  { href: ROUTES.SUGGESTIONS, label: 'Contacto'          },
] as const

export const Footer = () => (
  <footer className="border-t border-border bg-secondary mt-auto">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Marca */}
        <div>
          <Link href={ROUTES.HOME} className="flex items-center gap-2 font-display text-lg text-accent mb-3">
            <Image src="/fc-logo.png" alt={SITE_NAME} width={28} height={28} />
            {SITE_NAME}
          </Link>
          <p className="text-light/40 text-sm leading-relaxed">{SITE_TAGLINE}</p>
          <p className="text-light/25 text-xs mt-3">Lazos de Amor Mariano</p>
        </div>

        {/* Contenido */}
        <div>
          <h3 className="text-light/60 text-xs uppercase tracking-wider mb-4">Contenido</h3>
          <ul className="space-y-2">
            {contentLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-light/50 hover:text-accent transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Comunidad */}
        <div>
          <h3 className="text-light/60 text-xs uppercase tracking-wider mb-4">Comunidad</h3>
          <ul className="space-y-2">
            {communityLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-light/50 hover:text-accent transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-light/25 text-xs flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
          © {new Date().getFullYear()} {SITE_NAME}. Hecho con fe. · Desarrollado por{' '}
          <a
            href="https://jpsalomon.com.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-sm"
            aria-label="JPS — Desarrollador"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:to-cyan-400 transition-all duration-500">
              {'<JPS />'}
            </span>
          </a>
        </p>
        <Link href={ROUTES.ADMIN} className="text-light/20 text-xs hover:text-light/40 transition-colors">
          Admin
        </Link>
      </div>
    </div>
  </footer>
)
