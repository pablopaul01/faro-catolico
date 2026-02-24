export default function SugerenciasLoading() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10 text-center">
        <div className="h-9 w-48 bg-secondary rounded mx-auto mb-3 animate-pulse" />
        <div className="h-4 w-72 bg-secondary rounded mx-auto animate-pulse" />
      </div>
      <div className="bg-secondary border border-border rounded-card p-6 sm:p-8 space-y-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-32 bg-primary rounded animate-pulse" />
            <div className="h-10 w-full bg-primary rounded animate-pulse" />
          </div>
        ))}
        <div className="h-11 w-full bg-primary rounded animate-pulse" />
      </div>
    </main>
  )
}
