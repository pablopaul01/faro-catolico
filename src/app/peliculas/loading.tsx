const SkeletonCard = () => (
  <div className="bg-secondary rounded-card overflow-hidden animate-pulse">
    <div className="aspect-video bg-primary/60" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-primary/60 rounded w-3/4" />
      <div className="h-3 bg-primary/60 rounded w-1/2" />
    </div>
  </div>
)

export default function PeliculasLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="h-9 bg-secondary rounded w-48 animate-pulse mb-2" />
        <div className="h-4 bg-secondary rounded w-80 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </main>
  )
}
