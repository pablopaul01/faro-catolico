'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Download, X } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface BookPdfViewerProps {
  pdfUrl:  string
  title:   string
  author:  string
  onClose: () => void
}

export function BookPdfViewer({ pdfUrl, title, author, onClose }: BookPdfViewerProps) {
  const [pdfLoading,     setPdfLoading]     = useState(true)
  const [numPages,       setNumPages]       = useState(0)
  const [pdfError,       setPdfError]       = useState(false)
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined)

  useEffect(() => {
    const update = () => setContainerWidth(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="fixed inset-0 z-9999 flex flex-col bg-black/95 animate-fade-in">
      {/* Barra superior */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-secondary border-b border-border shrink-0">
        <div className="min-w-0">
          <p className="text-light font-display text-sm truncate">{title}</p>
          <p className="text-light/40 text-xs">{author}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {numPages > 0 && (
            <span className="text-xs text-light/40 tabular-nums mr-2">{numPages} págs.</span>
          )}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-sm border border-border text-light/50 hover:text-light hover:border-accent/40 transition-colors"
          >
            <Download size={13} />
            Descargar
          </a>
          <button
            onClick={onClose}
            className="p-1.5 text-light/50 hover:text-light hover:bg-white/10 rounded-sm transition-colors"
            aria-label="Cerrar visor"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Contenido PDF */}
      <div className="relative flex-1 min-h-0 overflow-y-auto flex flex-col items-center bg-neutral-900 py-4">
        {pdfLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 z-10">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            <span className="text-light/50 text-xs">Cargando PDF...</span>
          </div>
        )}
        {pdfError ? (
          <div className="flex flex-col items-center justify-center gap-4 p-8 text-center flex-1">
            <p className="text-light/50 text-sm">No se pudo cargar el PDF.</p>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-sm border border-accent/40 text-accent rounded-sm hover:bg-accent/10 transition-colors"
            >
              Abrir en nueva pestaña <ExternalLink size={13} />
            </a>
          </div>
        ) : (
          <Document
            key={pdfUrl}
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => { setNumPages(numPages); setPdfLoading(false) }}
            onLoadError={() => { setPdfError(true); setPdfLoading(false) }}
            loading={null}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                width={containerWidth ? Math.min(containerWidth - 32, 900) : undefined}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="mb-2"
              />
            ))}
          </Document>
        )}
      </div>
    </div>
  )
}
