'use client'

import Image from 'next/image'
import { Youtube, ExternalLink } from 'lucide-react'
import { ReportButton } from '@/components/public/ReportButton'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { YoutubeChannel } from '@/types/app.types'

interface YoutubeChannelCardProps {
  channel:        YoutubeChannel
  categoryNames?: string[]
}

export function YoutubeChannelCard({ channel, categoryNames = [] }: YoutubeChannelCardProps) {
  const copyrightMode = useSettingsStore((s) => s.copyrightMode)
  return (
    <article className="bg-secondary border border-border rounded-card overflow-hidden flex flex-col h-full group transition-all duration-300 hover:gold-glow hover:-translate-y-1">
      {/* Header con avatar circular */}
      <div className="h-24 bg-primary/60 flex items-end justify-center shrink-0 relative">
        <div className="absolute -bottom-8 w-16 h-16 rounded-full border-2 border-border overflow-hidden bg-primary flex items-center justify-center shadow-md">
          {channel.thumbnailUrl ? (
            <Image
              src={channel.thumbnailUrl}
              alt={channel.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <span className="font-display text-2xl text-accent/60 select-none">
              {channel.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="pt-10 px-4 pb-4 flex-1 flex flex-col gap-2 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Youtube size={13} className="text-accent/60 shrink-0" />
          <h3 className="font-display text-base text-light leading-snug line-clamp-1">{channel.name}</h3>
        </div>

        {channel.description && (
          <p className="text-light/50 text-xs leading-relaxed line-clamp-3">{channel.description}</p>
        )}

        {categoryNames.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {categoryNames.map((name) => (
              <span key={name} className="px-2 py-0.5 rounded-sm border border-accent/40 text-accent text-xs">
                {name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-1 flex justify-center">
          <ReportButton contentType="youtube_channel" contentId={channel.id} contentTitle={channel.name} />
        </div>

        {!copyrightMode && (
          <a
            href={channel.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
          >
            Ir al canal <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  )
}
