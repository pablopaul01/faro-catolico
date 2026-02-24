import { CategoryForm } from '@/components/admin/categories/CategoryForm'

export default function NewBookCategoryPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl text-light mb-2">Nueva categoría de libros</h1>
      <p className="text-light/50 text-sm mb-8">Crea una nueva categoría para organizar los libros</p>
      <CategoryForm entityType="libros" />
    </div>
  )
}
