'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { ROUTES, SITE_NAME, SITE_TAGLINE } from '@/lib/constants'
import { HeroSearch } from './HeroSearch'

export const Hero = () => {
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-14 overflow-hidden">
      {/* Fondo decorativo — gradiente radial dorado */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212,175,55,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Logo */}
      <div className={`mb-20 lg:mb-10 ${ready ? 'animate-fade-in' : 'opacity-0'}`}>
        <Image
          src="/fc-logo.png"
          alt={`Logo ${SITE_NAME}`}
          width={200}
          height={200}
          className="drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          priority
        />
      </div>

      {/* Nombre del sitio */}
      <h1
        className={`font-display text-5xl sm:text-6xl lg:text-7xl text-light mb-5 ${ready ? 'animate-slide-up' : 'opacity-0'}`}
        style={{ animationDelay: '0.1s' }}
      >
        {SITE_NAME}
      </h1>

      {/* Tagline */}
      <p
        className={`text-lg sm:text-xl text-accent/80 font-display mb-4 ${ready ? 'animate-slide-up' : 'opacity-0'}`}
        style={{ animationDelay: '0.2s' }}
      >
        {SITE_TAGLINE}
      </p>

      {/* Subtexto */}
      <p
        className={`text-light/50 max-w-md text-sm sm:text-base leading-relaxed mb-10 ${ready ? 'animate-slide-up' : 'opacity-0'}`}
        style={{ animationDelay: '0.3s' }}
      >
        Contenido para crecer en la fe: películas, libros y música
        seleccionados con amor.
      </p>

      {/* CTAs */}
      <div
        className={`flex flex-col sm:flex-row gap-3 ${ready ? 'animate-slide-up' : 'opacity-0'}`}
        style={{ animationDelay: '0.4s' }}
      >
        <Link
          href={ROUTES.MOVIES}
          className="px-7 py-3 bg-accent text-primary font-semibold rounded-sm hover:bg-accent/90 transition-all duration-200 hover:scale-[1.02]"
        >
          Ver películas
        </Link>
        <Link
          href={ROUTES.MUSIC}
          className="px-7 py-3 border border-accent/40 text-accent rounded-sm hover:bg-accent/10 transition-all duration-200"
        >
          Explorar música
        </Link>
      </div>

      {/* Buscador */}
      <HeroSearch />

      {/* Flecha de scroll */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${ready ? 'animate-fade-in' : 'opacity-0'}`}
        style={{ animationDelay: '0.8s' }}
      >
        <ChevronDown size={20} className="text-light/20 animate-bounce" />
      </div>
    </section>
  )
}
