'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { AdminSidebar } from './AdminSidebar'
import { SITE_NAME } from '@/lib/constants'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-primary overflow-hidden">
      {/* Overlay oscuro — solo mobile cuando el drawer está abierto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar — drawer en mobile, fija en desktop */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Área de contenido */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header mobile */}
        <div className="lg:hidden flex items-center gap-3 px-4 h-14 border-b border-border bg-secondary shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-light/60 hover:text-light transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          <span className="font-display text-base text-accent">{SITE_NAME}</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
