// Nunca cachear páginas de admin — evita mismatch de chunks entre deploys
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
