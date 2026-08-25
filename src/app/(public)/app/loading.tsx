export default function AppDownloadLoading() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14 pb-24 animate-pulse">
      <div className="h-10 w-72 mx-auto bg-secondary rounded-card mb-3" />
      <div className="h-5 w-full max-w-xl mx-auto bg-secondary rounded-card mb-12" />
      <div className="h-64 bg-secondary rounded-card mb-12" />
      <div className="space-y-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 bg-secondary rounded-card" />
        ))}
      </div>
    </main>
  )
}
