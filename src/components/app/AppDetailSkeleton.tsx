export function AppDetailSkeleton() {
  return (
    <main className="app-detail app-detail-movie app-detail-skeleton">
      <div className="app-detail-back">
        <div className="inline-flex items-center gap-2 text-sm text-light/60">
          <div className="h-4 w-4 rounded bg-light/10" />
          <div className="h-4 w-28 rounded bg-light/10" />
        </div>
      </div>
      <div className="app-detail-layout">
        <div className="app-detail-media">
          <div className="h-full w-full animate-pulse bg-secondary" />
        </div>
        <div>
          <div className="h-3 w-16 animate-pulse rounded bg-light/10" />
          <div className="mt-3 h-10 w-3/4 animate-pulse rounded bg-light/10" />
          <div className="mt-3 h-4 w-12 animate-pulse rounded bg-light/10" />
          <div className="app-detail-actions">
            <div className="h-12 w-36 animate-pulse rounded-full bg-accent/20" />
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-light/8" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-light/8" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-light/8" />
          </div>
        </div>
      </div>
    </main>
  )
}
