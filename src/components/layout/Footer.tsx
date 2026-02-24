import Image from 'next/image'
import Link from 'next/link'
import { ROUTES, SITE_NAME, SITE_TAGLINE } from '@/lib/constants'

const footerLinks = [
  { href: ROUTES.MOVIES, label: 'Películas' },
  { href: ROUTES.BOOKS,  label: 'Libros'    },
  { href: ROUTES.MUSIC,  label: 'Música'    },
] as const

export const Footer = () => (
  <footer className="border-t border-border bg-secondary mt-auto">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Marca */}
        <div>
          <Link href={ROUTES.HOME} className="flex items-center gap-2 font-display text-lg text-accent mb-3">
            <Image src="/fc-logo.png" alt={SITE_NAME} width={28} height={28} />
            {SITE_NAME}
          </Link>
          <p className="text-light/40 text-sm leading-relaxed">{SITE_TAGLINE}</p>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="text-light/60 text-xs uppercase tracking-wider mb-4">Contenido</h3>
          <ul className="space-y-2">
            {footerLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-light/50 hover:text-accent transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Movimiento */}
        {/* <div>
          <h3 className="text-light/60 text-xs uppercase tracking-wider mb-4">Movimiento</h3>
          <p className="text-light/40 text-sm leading-relaxed">
            Lazos de Amor Mariano
          </p>
          <p className="text-light/30 text-xs mt-2">
            Contenido curado con amor para el crecimiento espiritual
          </p>
        </div> */}
      </div>

      <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-light/25 text-xs">
          © {new Date().getFullYear()} {SITE_NAME}. Hecho con fe.
        </p>
        <Link href={ROUTES.ADMIN} className="text-light/20 text-xs hover:text-light/40 transition-colors">
          Admin
        </Link>
      </div>
    </div>
  </footer>
)
