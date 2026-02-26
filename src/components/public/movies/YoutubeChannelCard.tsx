'use client'

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
    <article className="bg-secondary border border-border rounded-card overflow-hidden flex flex-col group transition-all duration-300 hover:gold-glow hover:-translate-y-1">
      {/* Thumbnail o ícono */}
      {channel.thumbnailUrl ? (
        <div className="aspect-video w-full overflow-hidden flex-shrink-0">
          <img
            src={channel.thumbnailUrl}
            alt={channel.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video w-full flex items-center justify-center bg-primary/60 flex-shrink-0">
          <Youtube size={40} className="text-accent/40" />
        </div>
      )}

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Youtube size={14} className="text-accent/60 flex-shrink-0" />
          <h3 className="font-display text-base text-light leading-snug line-clamp-1">{channel.name}</h3>
        </div>

        {channel.description && (
          <p className="text-light/50 text-xs leading-relaxed line-clamp-3">{channel.description}</p>
        )}

        {categoryNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categoryNames.map((name) => (
              <span key={name} className="px-2 py-0.5 rounded-sm border border-accent/40 text-accent text-xs">
                {name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-1">
          <ReportButton contentType="youtube_channel" contentId={channel.id} contentTitle={channel.name} />
        </div>

        {!copyrightMode && (
          <a
            href={channel.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pt-1 flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
          >
            Ir al canal <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  )
}
