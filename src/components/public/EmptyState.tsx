import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  subtitle?: string
}

export const EmptyState = ({ icon: Icon, title, subtitle }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
    <div className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center">
      <Icon size={24} className="text-accent/50" />
    </div>
    <p className="text-light/40 font-display text-sm">{title}</p>
    {subtitle && <p className="text-light/25 text-xs">{subtitle}</p>}
  </div>
)
