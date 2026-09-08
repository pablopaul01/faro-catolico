interface AppEmptyStateProps {
  title: string
  description?: string
}

export function AppEmptyState({ title, description }: AppEmptyStateProps) {
  return (
    <div className="app-empty-state">
      <p className="text-lg text-light/70">{title}</p>
      {description ? <p className="mt-2 text-sm text-light/40">{description}</p> : null}
    </div>
  )
}
