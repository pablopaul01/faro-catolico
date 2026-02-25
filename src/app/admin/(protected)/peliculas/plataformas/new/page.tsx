import { CategoryForm } from '@/components/admin/categories/CategoryForm'

export default function NewMoviePlatformPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Nueva plataforma</h1>
      <p className="text-light/50 text-sm mb-8">Agrega una plataforma de streaming (ej: Netflix, Prime Video)</p>
      <CategoryForm entityType="plataformas" />
    </div>
  )
}
