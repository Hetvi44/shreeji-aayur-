import { getProducts } from '@/lib/actions/products'
import { getCategories } from '@/lib/actions/categories'
import ProductsClient from './products-client'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>
}) {
  const resolvedParams = await searchParams
  const category = resolvedParams.category
  const search = resolvedParams.search
  const sort = resolvedParams.sort

  const [products, categories] = await Promise.all([
    getProducts({ category, search }),
    getCategories(),
  ])

  return <ProductsClient products={products} categories={categories} initialCategory={category} initialSearch={search} initialSort={sort} />
}
