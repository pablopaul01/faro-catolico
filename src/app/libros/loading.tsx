const SkeletonBookCard = () => (
  <div className="bg-secondary rounded-card p-4 flex gap-4 animate-pulse">
    <div className="w-24 h-36 bg-primary/60 rounded-sm flex-shrink-0" />
    <div className="flex-1 space-y-2 pt-1">
      <div className="h-4 bg-primary/60 rounded w-3/4" />
      <div className="h-3 bg-primary/60 rounded w-1/2" />
      <div className="h-3 bg-primary/60 rounded w-full mt-3" />
      <div className="h-3 bg-primary/60 rounded w-2/3" />
    </div>
  </div>
)

export default function LibrosLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="h-9 bg-secondary rounded w-32 animate-pulse mb-2" />
        <div className="h-4 bg-secondary rounded w-72 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonBookCard key={i} />)}
      </div>
    </main>
  )
}
