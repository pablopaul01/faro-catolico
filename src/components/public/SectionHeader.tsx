import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface SectionHeaderProps {
  title:      string
  subtitle?:  string
  viewAllHref?: string
  viewAllLabel?: string
}

export const SectionHeader = ({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = 'Ver todo',
}: SectionHeaderProps) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <h2 className="font-display text-3xl sm:text-4xl text-light mb-2">{title}</h2>
      {subtitle && <p className="text-light/50 text-sm">{subtitle}</p>}
    </div>
    {viewAllHref && (
      <Link
        href={viewAllHref}
        className="flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors group"
      >
        {viewAllLabel}
        <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    )}
  </div>
)
