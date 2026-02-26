'use client'

import { useState, useEffect } from 'react'
import { createPortal }        from 'react-dom'
import { Flag, X, Check }      from 'lucide-react'
import { createReport }        from '@/services/reports.service'
import type { ReportContentType } from '@/types/app.types'

const REASONS = [
  'Enlace roto',
  'Video no disponible',
  'Contenido inapropiado',
  'Otro',
] as const

interface ReportButtonProps {
  contentType:  ReportContentType
  contentId:    string
  contentTitle: string
}

export function ReportButton({ contentType, contentId, contentTitle }: ReportButtonProps) {
  const [open,     setOpen]     = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [sending,  setSending]  = useState(false)
  const [sent,     setSent]     = useState(false)
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen(true)
    setSelected(null)
    setSent(false)
  }

  const handleClose = () => {
    setOpen(false)
    setSelected(null)
  }

  const handleSend = async () => {
    if (!selected) return
    setSending(true)
    try {
      await createReport({ contentType, contentId, contentTitle, reason: selected })
      setSent(true)
      setTimeout(() => setOpen(false), 2000)
    } catch {
      // best-effort — silently fail
    } finally {
      setSending(false)
    }
  }

  const modal = mounted && open
    ? createPortal(
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 p-4"
          onClick={handleClose}
        >
          <div
            className="bg-secondary border border-border rounded-card p-5 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base text-light">Reportar problema</h3>
              <button onClick={handleClose} className="text-light/40 hover:text-light transition-colors">
                <X size={16} />
              </button>
            </div>

            {sent ? (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <Check size={32} className="text-green-400" />
                <p className="text-light/70 text-sm">¡Gracias por reportarlo!</p>
              </div>
            ) : (
              <>
                <p className="text-light/50 text-xs mb-3 truncate">
                  {contentTitle}
                </p>

                <div className="flex flex-col gap-2 mb-4">
                  {REASONS.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setSelected(reason)}
                      className={`px-3 py-2 rounded-sm text-sm text-left border transition-all ${
                        selected === reason
                          ? 'border-accent text-accent bg-accent/10'
                          : 'border-border text-light/60 hover:border-border/80 hover:text-light/80'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSend}
                  disabled={!selected || sending}
                  className="w-full py-2 rounded-sm text-sm font-medium bg-accent text-primary transition-opacity disabled:opacity-40"
                >
                  {sending ? 'Enviando…' : 'Enviar reporte'}
                </button>
              </>
            )}
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1 text-xs text-light/30 hover:text-red-400/70 transition-colors"
        title="Reportar problema"
      >
        <Flag size={12} />
        Reportar
      </button>

      {modal}
    </>
  )
}
