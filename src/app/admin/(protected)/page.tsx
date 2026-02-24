import { createSupabaseServerClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/constants'
import { Film, BookOpen, Music, Eye } from 'lucide-react'

interface ContentStats {
  totalMovies:     number
  publishedMovies: number
  totalBooks:      number
  publishedBooks:  number
  totalSongs:      number
  publishedSongs:  number
}

const fetchStats = async (): Promise<ContentStats> => {
  const supabase = await createSupabaseServerClient()

  const [moviesRes, booksRes, songsRes] = await Promise.all([
    supabase.from(TABLE_NAMES.MOVIES).select('is_published'),
    supabase.from(TABLE_NAMES.BOOKS).select('is_published'),
    supabase.from(TABLE_NAMES.SONGS).select('is_published'),
  ])

  const countPublished = (data: Array<{ is_published: boolean }> | null) =>
    data?.filter((r) => r.is_published).length ?? 0

  return {
    totalMovies:     moviesRes.data?.length ?? 0,
    publishedMovies: countPublished(moviesRes.data),
    totalBooks:      booksRes.data?.length ?? 0,
    publishedBooks:  countPublished(booksRes.data),
    totalSongs:      songsRes.data?.length ?? 0,
    publishedSongs:  countPublished(songsRes.data),
  }
}

const StatCard = ({
  icon: Icon,
  label,
  total,
  published,
}: {
  icon: React.ElementType
  label: string
  total: number
  published: number
}) => (
  <div className="bg-card gold-glow p-6 rounded-card">
    <div className="flex items-center justify-between mb-4">
      <p className="text-light/60 text-sm">{label}</p>
      <Icon size={20} className="text-accent" />
    </div>
    <p className="font-display text-3xl text-light mb-1">{total}</p>
    <p className="text-xs text-light/40 flex items-center gap-1">
      <Eye size={12} /> {published} publicados
    </p>
  </div>
)

export default async function AdminDashboardPage() {
  const stats = await fetchStats()

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Dashboard</h1>
      <p className="text-light/50 text-sm mb-8">Resumen del contenido de Faro Católico</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Film}
          label="Películas"
          total={stats.totalMovies}
          published={stats.publishedMovies}
        />
        <StatCard
          icon={BookOpen}
          label="Libros"
          total={stats.totalBooks}
          published={stats.publishedBooks}
        />
        <StatCard
          icon={Music}
          label="Canciones"
          total={stats.totalSongs}
          published={stats.publishedSongs}
        />
      </div>
    </div>
  )
}
