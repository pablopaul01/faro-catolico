export function AppLoadingState({ label = 'Cargando...' }: { label?: string }) {
  return (
    <main className="app-loading-screen" role="status" aria-live="polite">
      <div className="app-loading-mark" aria-hidden />
      <p>{label}</p>
    </main>
  )
}
