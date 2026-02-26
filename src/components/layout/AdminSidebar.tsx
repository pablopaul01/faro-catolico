'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Film, BookOpen, Music, LayoutDashboard, LogOut, Tag, Mail, Send, MonitorPlay, ListMusic, PlaySquare, Youtube, Settings2 } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { ROUTES, SITE_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

type SubItem = { href: string; label: string; icon?: typeof Tag }

const navItems: { href: string; label: string; icon: typeof Film; sub: SubItem[] }[] = [
  { href: ROUTES.ADMIN,              label: 'Dashboard',  icon: LayoutDashboard, sub: [] },
  { href: ROUTES.ADMIN_MOVIES,       label: 'Películas',  icon: Film,            sub: [
    { href: ROUTES.ADMIN_MOVIE_CATEGORIES, label: 'Categorías',   icon: Tag },
    { href: ROUTES.ADMIN_MOVIE_PLATFORMS,  label: 'Plataformas',  icon: MonitorPlay },
    { href: ROUTES.ADMIN_YOUTUBE_PLAYLISTS, label: 'Playlists YT', icon: PlaySquare },
    { href: ROUTES.ADMIN_YOUTUBE_CHANNELS,  label: 'Canales YT',   icon: Youtube },
  ]},
  { href: ROUTES.ADMIN_BOOKS,        label: 'Libros',     icon: BookOpen,        sub: [
    { href: ROUTES.ADMIN_BOOK_CATEGORIES, label: 'Categorías', icon: Tag },
  ]},
  { href: ROUTES.ADMIN_MUSIC,        label: 'Música',     icon: Music,           sub: [
    { href: ROUTES.ADMIN_MUSIC_CATEGORIES, label: 'Categorías', icon: Tag },
    { href: ROUTES.ADMIN_PLAYLISTS,        label: 'Playlists',  icon: ListMusic },
  ]},
  { href: ROUTES.ADMIN_SUBMISSIONS,  label: 'Propuestas',    icon: Send,      sub: [] },
  { href: ROUTES.ADMIN_SUGGESTIONS,  label: 'Contacto',      icon: Mail,      sub: [] },
  { href: ROUTES.ADMIN_SETTINGS,     label: 'Configuración', icon: Settings2, sub: [] },
]

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export const AdminSidebar = ({ isOpen = false, onClose }: AdminSidebarProps) => {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.replace(ROUTES.ADMIN_LOGIN)
  }

  const handleNavClick = () => {
    onClose?.()
  }

  return (
    <aside
      className={cn(
        // Mobile: drawer fixed desde la izquierda con transición
        'fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-secondary border-r border-border transition-transform duration-300 ease-in-out',
        // Desktop: posición relativa dentro del flex layout, siempre visible
        'lg:relative lg:w-60 lg:z-auto lg:translate-x-0 lg:shrink-0',
        // Estado open/close (solo aplica en mobile)
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border shrink-0">
        <Link
          href={ROUTES.HOME}
          onClick={handleNavClick}
          className="font-display text-lg text-accent hover:text-accent/80 transition-colors"
        >
          {SITE_NAME}
        </Link>
        <p className="text-xs text-light/40 mt-0.5">Panel de administración</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, sub }) => {
          const isActive = pathname === href || (href !== ROUTES.ADMIN && pathname.startsWith(href) && sub.every((s) => !pathname.startsWith(s.href)))
          return (
            <div key={href}>
              <Link
                href={href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150',
                  isActive
                    ? 'bg-accent/15 text-accent font-medium'
                    : 'text-light/60 hover:text-light hover:bg-white/5'
                )}
              >
                <Icon size={17} />
                {label}
              </Link>
              {sub.map((s) => {
                const SubIcon = s.icon ?? Tag
                const isSubActive = pathname.startsWith(s.href)
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={handleNavClick}
                    className={cn(
                      'flex items-center gap-3 pl-9 pr-3 py-2 rounded-sm text-xs transition-all duration-150',
                      isSubActive
                        ? 'text-accent font-medium'
                        : 'text-light/40 hover:text-light/70 hover:bg-white/5'
                    )}
                  >
                    <SubIcon size={13} />
                    {s.label}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-sm text-light/50 hover:text-red-400 hover:bg-red-900/10 transition-all duration-150"
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
