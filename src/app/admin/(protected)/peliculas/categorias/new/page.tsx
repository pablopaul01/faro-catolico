import { CategoryForm } from '@/components/admin/categories/CategoryForm'

export default function NewMovieCategoryPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Nueva categoría de películas</h1>
      <p className="text-light/50 text-sm mb-8">Crea una nueva categoría para organizar las películas</p>
      <CategoryForm entityType="peliculas" />
    </div>
  )
}
