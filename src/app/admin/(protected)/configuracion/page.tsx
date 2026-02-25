'use client'

import { useEffect, useState } from 'react'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { fetchSettings, updateCopyrightMode } from '@/services/settings.service'

export default function ConfiguracionPage() {
  const [copyrightMode, setCopyrightMode] = useState(false)
  const [isLoading,     setIsLoading]     = useState(true)
  const [isSaving,      setIsSaving]      = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
      .then(({ copyrightMode: v }) => setCopyrightMode(v))
      .catch(() => setError('No se pudo cargar la configuración.'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleToggle = async () => {
    const next = !copyrightMode
    setIsSaving(true)
    setError(null)
    try {
      await updateCopyrightMode(next)
      setCopyrightMode(next)
    } catch {
      setError('No se pudo guardar el cambio. Inténtalo de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-light mb-1">Configuración</h1>
      <p className="text-light/40 text-sm mb-8">Ajustes globales de la plataforma.</p>

      <div className="bg-secondary border border-border rounded-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {copyrightMode
                ? <ShieldAlert size={18} className="text-red-400" />
                : <ShieldCheck  size={18} className="text-green-400" />
              }
              <h2 className="text-light font-medium text-sm">Modo copyright</h2>
            </div>
            <p className="text-light/40 text-xs leading-relaxed">
              Cuando está <strong className="text-light/60">ACTIVO</strong>, oculta en toda la web pública los reproductores embed
              (YouTube, Spotify), los links externos (PDF, compra, canales, playlists) y los botones de descarga.
              Los títulos, descripciones, categorías y valoraciones siguen siendo visibles.
            </p>
            <p className="text-light/30 text-xs mt-2">
              Útil para responder rápidamente ante reclamos de derechos de autor sin eliminar el contenido.
            </p>
          </div>

          {/* Toggle */}
          <button
            onClick={handleToggle}
            disabled={isLoading || isSaving}
            aria-label={copyrightMode ? 'Desactivar modo copyright' : 'Activar modo copyright'}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
              copyrightMode ? 'bg-red-500' : 'bg-white/10'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                copyrightMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Estado */}
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
          {isLoading ? (
            <span className="text-light/30 text-xs">Cargando...</span>
          ) : (
            <>
              <span className="text-light/40 text-xs">Estado actual:</span>
              <span className={`text-xs font-semibold ${copyrightMode ? 'text-red-400' : 'text-green-400'}`}>
                {copyrightMode ? 'ACTIVO — contenido restringido' : 'INACTIVO — contenido normal'}
              </span>
            </>
          )}
          {isSaving && <span className="text-light/30 text-xs ml-auto">Guardando...</span>}
        </div>

        {error && (
          <p className="mt-3 text-red-400 text-xs">{error}</p>
        )}
      </div>
    </div>
  )
}
