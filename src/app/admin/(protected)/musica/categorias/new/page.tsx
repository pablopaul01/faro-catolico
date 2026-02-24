import { CategoryForm } from '@/components/admin/categories/CategoryForm'

export default function NewMusicCategoryPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Nueva categoría de música</h1>
      <p className="text-light/50 text-sm mb-8">Define un nuevo momento o género musical</p>
      <CategoryForm entityType="musica" />
    </div>
  )
}
