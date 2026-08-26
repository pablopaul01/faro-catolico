import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'

interface AppSuggestionDetailsProps {
  backHref: string
  backLabel: string
  kindLabel: string
  title: string
  description: string | null
  imageUrl: string | null
  externalUrl: string
  externalLabel: string
}

export function AppSuggestionDetails({
  backHref,
  backLabel,
  kindLabel,
  title,
  description,
  imageUrl,
  externalUrl,
  externalLabel,
}: AppSuggestionDetailsProps) {
  return (
    <main className="app-detail">
      <Link href={backHref} className="app-focus inline-flex items-center gap-2 text-sm text-light/60 hover:text-accent">
        <ArrowLeft size={17} /> {backLabel}
      </Link>
      <div className="app-detail-layout">
        <div className="app-detail-media">
          {imageUrl ? (
            <Image src={imageUrl} alt="" fill sizes="(max-width: 767px) 100vw, 42vw" className="object-cover" priority />
          ) : (
            <div className="h-full bg-secondary" />
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/75">{kindLabel}</p>
          <h1 className="mt-3 font-display text-3xl text-light sm:text-5xl">{title}</h1>
          {description && (
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-light/65 sm:text-base">{description}</p>
          )}
          <p className="mt-4 text-sm italic text-light/45">
            Este contenido es una sugerencia. Se abre en YouTube, fuera del reproductor de la app.
          </p>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="app-focus mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-primary"
          >
            <ExternalLink size={16} /> {externalLabel}
          </a>
        </div>
      </div>
    </main>
  )
}
