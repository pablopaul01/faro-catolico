import { SongForm } from '@/components/admin/music/SongForm'

export default function NewSongPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Nueva canción</h1>
      <p className="text-light/50 text-sm mb-8">Completa los datos de la canción a agregar</p>
      <SongForm />
    </div>
  )
}
