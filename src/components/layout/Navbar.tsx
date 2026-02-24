'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ROUTES, SITE_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: ROUTES.MOVIES,       label: 'Películas'         },
  { href: ROUTES.BOOKS,        label: 'Libros'             },
  { href: ROUTES.MUSIC,        label: 'Música'             },
  { href: ROUTES.PROPOSE,      label: 'Sugerir contenido' },
  { href: ROUTES.SUGGESTIONS,  label: 'Contacto'           },
] as const

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2.5 font-display text-xl text-accent hover:text-accent/80 transition-colors"
        >
          <Image src="/fc-logo.png" alt={SITE_NAME} width={32} height={32} />
          {SITE_NAME}
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 text-sm text-light/70 hover:text-light hover:bg-white/5 rounded-sm transition-all duration-150"
            >
              {label}
            </Link>
          ))}
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
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 py-3 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 text-sm text-light/70 hover:text-light hover:bg-white/5 rounded-sm transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
