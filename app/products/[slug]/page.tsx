import { Metadata } from 'next'
import { getProductBySlug, getProducts } from '@/lib/actions/products'
import { notFound } from 'next/navigation'
import ProductDetailClient from './product-detail-client'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | ShreejiAayur`,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getProducts({
    category: product.category.slug,
    limit: 4,
  })

  return <ProductDetailClient product={product} relatedProducts={relatedProducts.filter(p => p.id !== product.id)} />
}
