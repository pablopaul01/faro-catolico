export default function MusicaLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="h-9 bg-secondary rounded w-36 animate-pulse mb-2" />
        <div className="h-4 bg-secondary rounded w-64 animate-pulse" />
      </div>
      {/* Tabs skeleton */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-secondary rounded-sm animate-pulse" />
        ))}
      </div>
      {/* Songs skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 bg-secondary rounded-card animate-pulse" />
        ))}
      </div>
    </main>
  )
}
