export default function Loading() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="h-10 w-32 bg-secondary rounded animate-pulse mb-6" />
      <div className="flex gap-3 mb-8">
        <div className="h-10 flex-1 bg-secondary rounded animate-pulse" />
        <div className="h-10 w-24 bg-secondary rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 bg-secondary rounded-card animate-pulse" />
        ))}
      </div>
    </main>
  )
}
