export default function Loading() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="h-10 w-64 bg-secondary rounded animate-pulse mb-2" />
      <div className="h-4 w-full bg-secondary rounded animate-pulse mb-8" />
      <div className="space-y-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-3 w-24 bg-secondary rounded animate-pulse mb-1" />
            <div className="h-10 w-full bg-secondary rounded animate-pulse" />
          </div>
        ))}
        <div className="h-12 w-full bg-secondary rounded animate-pulse" />
      </div>
    </main>
  )
}
