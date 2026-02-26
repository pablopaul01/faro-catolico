'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ROUTES, SITE_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface SubLink {
  href:  string
  label: string
}

interface NavLink {
  href:      string
  label:     string
  children?: SubLink[]
}

const navLinks: NavLink[] = [
  {
    href:  ROUTES.MOVIES,
    label: 'Películas',
    children: [
      { href: ROUTES.MOVIES,                    label: 'Películas'        },
      { href: `${ROUTES.MOVIES}?tab=playlists`, label: 'Playlists YouTube' },
      { href: `${ROUTES.MOVIES}?tab=canales`,   label: 'Canales YouTube'  },
    ],
  },
  { href: ROUTES.BOOKS, label: 'Libros' },
  {
    href:  ROUTES.MUSIC,
    label: 'Música',
    children: [
      { href: ROUTES.MUSIC,                    label: 'Canciones' },
      { href: `${ROUTES.MUSIC}?tab=playlists`, label: 'Playlists' },
    ],
  },
  { href: ROUTES.PROPOSE,     label: 'Sugerir contenido' },
  { href: ROUTES.SUGGESTIONS, label: 'Contacto'          },
]

export const Navbar = () => {
  const [isOpen, setIsOpen]             = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openMobile, setOpenMobile]     = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenDropdown(label)
  }

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120)
  }

  const closeMobileMenu = () => {
    setIsOpen(false)
    setOpenMobile(null)
    window.scrollTo(0, 0)
  }

  return (
    <header className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2.5 font-display text-xl text-accent hover:text-accent/80 transition-colors"
        >
          <Image src="/fc-logo.png" alt={SITE_NAME} width={54} height={54} />
          {SITE_NAME}
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, children }) =>
            children ? (
              <div
                key={label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={href}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-light/70 hover:text-light hover:bg-white/5 rounded-sm transition-all duration-150"
                >
                  {label}
                  <ChevronDown
                    size={13}
                    className={cn('transition-transform duration-150', openDropdown === label ? 'rotate-180' : '')}
                  />
                </Link>

                {/* Dropdown */}
                <div
                  className={cn(
                    'absolute top-full left-0 mt-1 min-w-44 bg-primary border border-border rounded-card shadow-lg py-1 transition-all duration-150',
                    openDropdown === label ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
                  )}
                >
                  {children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-sm text-light/70 hover:text-light hover:bg-white/5 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-sm text-light/70 hover:text-light hover:bg-white/5 rounded-sm transition-all duration-150"
              >
                {label}
              </Link>
            )
          )}
        </div>

        {/* Buscar (desktop) */}
        <button
          onClick={() => router.push(ROUTES.SEARCH)}
          className="hidden md:flex p-2 text-light/60 hover:text-light transition-colors rounded-sm hover:bg-white/5"
          aria-label="Buscar"
        >
          <Search size={20} />
        </button>

        {/* Hamburger + buscar mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={() => router.push(ROUTES.SEARCH)}
            className="p-2 text-light/60 hover:text-light transition-colors"
            aria-label="Buscar"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 text-light/60 hover:text-light transition-colors"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Menú mobile */}
      <div
        className={cn(
          'md:hidden border-t border-border overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 py-3 space-y-1">
          {navLinks.map(({ href, label, children }) =>
            children ? (
              <div key={label}>
                <button
                  onClick={() => setOpenMobile((prev) => (prev === label ? null : label))}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-light/70 hover:text-light hover:bg-white/5 rounded-sm transition-colors"
                >
                  {label}
                  <ChevronDown
                    size={14}
                    className={cn('transition-transform duration-150', openMobile === label ? 'rotate-180' : '')}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    openMobile === label ? 'max-h-40' : 'max-h-0'
                  )}
                >
                  <div className="pl-4 pt-0.5 space-y-0.5">
                    {children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={closeMobileMenu}
                        className="block px-3 py-2 text-sm text-light/50 hover:text-light hover:bg-white/5 rounded-sm transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={href}
                href={href}
                onClick={closeMobileMenu}
                className="block px-3 py-2.5 text-sm text-light/70 hover:text-light hover:bg-white/5 rounded-sm transition-colors"
              >
                {label}
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}
