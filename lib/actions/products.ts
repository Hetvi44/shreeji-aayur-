'use server'

import { db } from '@/lib/db'
import { rupeesToPaise, slugify } from '@/lib/utils'
import type { ProductWithCategory } from '@/types'
import { revalidatePath } from 'next/cache'

interface GetProductsOptions {
  featured?: boolean
  trending?: boolean
  limit?: number
  categoryId?: string
  category?: string
  search?: string
}

export async function getProducts(options: GetProductsOptions = {}): Promise<ProductWithCategory[]> {
  const { featured, trending, limit = 50, categoryId, category, search } = options

  try {
    const where: any = { isActive: true }

    if (featured) where.isFeatured = true
    if (trending) where.isTrending = true
    if (categoryId) where.categoryId = categoryId
    if (category) where.category = { slug: category }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const products = await db.product.findMany({
      where,
      take: limit,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })

    return products.map((product) => normalizeProductWithCategory(product))
  } catch (error) {
    console.error('[getProducts]', error)
    throw new Error('Failed to fetch products')
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: { category: true },
    })
    return product ? normalizeProductWithCategory(product) : null
  } catch (error) {
    console.error('[getProductBySlug]', error)
    throw new Error('Failed to fetch product')
  }
}

export async function getProductById(id: string): Promise<ProductWithCategory | null> {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: { category: true },
    })
    return product ? normalizeProductWithCategory(product) : null
  } catch (error) {
    console.error('[getProductById]', error)
    throw new Error('Failed to fetch product')
  }
}

async function uniqueProductSlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base) || 'product'
  let candidate = slug
  let i = 2
  while (true) {
    const existing = await db.product.findUnique({ where: { slug: candidate } })
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${slug}-${i++}`
  }
}

export type ProductFormInput = {
  name: string
  description: string
  categoryId: string
  priceRupees: number | string
  originalPriceRupees?: number | string | null
  stock: number | string
  images: string[]
  badge?: string | null
  isFeatured?: boolean
  isTrending?: boolean
  ingredients?: string | null
  benefits?: string | null
  howToUse?: string | null
}

function validateProductForm(input: ProductFormInput) {
  const name = input.name?.trim()
  const description = input.description?.trim()
  if (!name) throw new Error('Product name is required')
  if (!description) throw new Error('Description is required')
  if (!input.categoryId) throw new Error('Category is required')
  const price = Number(input.priceRupees)
  if (!Number.isFinite(price) || price <= 0) throw new Error('Valid sale price is required')
  const stock = Number(input.stock)
  if (!Number.isFinite(stock) || stock < 0) throw new Error('Valid stock quantity is required')
  const images = (input.images || []).map((u) => u.trim()).filter(Boolean)
  if (images.length === 0) throw new Error('At least one product image is required')
  return { name, description, price, stock, images }
}

export async function createProduct(input: ProductFormInput) {
  try {
    const { name, description, price, stock, images } = validateProductForm(input)
    const original =
      input.originalPriceRupees !== undefined &&
      input.originalPriceRupees !== null &&
      String(input.originalPriceRupees).trim() !== ''
        ? Number(input.originalPriceRupees)
        : null

    const slug = await uniqueProductSlug(name)
    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        categoryId: input.categoryId,
        price: rupeesToPaise(price),
        originalPrice:
          original !== null && Number.isFinite(original) && original > 0
            ? rupeesToPaise(original)
            : null,
        stock: Math.floor(stock),
        images,
        badge: input.badge?.trim() || null,
        isFeatured: !!input.isFeatured,
        isTrending: !!input.isTrending,
        ingredients: input.ingredients?.trim() || null,
        benefits: input.benefits?.trim() || null,
        howToUse: input.howToUse?.trim() || null,
        isActive: true,
      },
      include: { category: true },
    })
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')
    revalidatePath(`/category/${product.category.slug}`)
    return { success: true as const, data: product }
  } catch (error: any) {
    console.error('[createProduct]', error)
    return { success: false as const, error: error?.message || 'Failed to create product' }
  }
}

export async function updateProduct(id: string, input: ProductFormInput) {
  try {
    const { name, description, price, stock, images } = validateProductForm(input)
    const original =
      input.originalPriceRupees !== undefined &&
      input.originalPriceRupees !== null &&
      String(input.originalPriceRupees).trim() !== ''
        ? Number(input.originalPriceRupees)
        : null

    const slug = await uniqueProductSlug(name, id)
    const product = await db.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        categoryId: input.categoryId,
        price: rupeesToPaise(price),
        originalPrice:
          original !== null && Number.isFinite(original) && original > 0
            ? rupeesToPaise(original)
            : null,
        stock: Math.floor(stock),
        images,
        badge: input.badge?.trim() || null,
        isFeatured: !!input.isFeatured,
        isTrending: !!input.isTrending,
        ingredients: input.ingredients?.trim() || null,
        benefits: input.benefits?.trim() || null,
        howToUse: input.howToUse?.trim() || null,
      },
      include: { category: true },
    })
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')
    revalidatePath(`/products/${product.slug}`)
    revalidatePath(`/category/${product.category.slug}`)
    return { success: true as const, data: product }
  } catch (error: any) {
    console.error('[updateProduct]', error)
    return { success: false as const, error: error?.message || 'Failed to update product' }
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.update({
      where: { id },
      data: { isActive: false },
    })
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')
    return { success: true as const }
  } catch (error: any) {
    console.error('[deleteProduct]', error)
    return { success: false as const, error: error?.message || 'Failed to delete product' }
  }
}

export async function getAdminProducts() {
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    return products.map((product) => normalizeProductWithCategory(product))
  } catch (error) {
    console.error('[getAdminProducts]', error)
    throw new Error('Failed to fetch products')
  }
}

function normalizeProductImages<T extends { images: unknown }>(product: T) {
  const images = Array.isArray(product.images)
    ? product.images.filter((item): item is string => typeof item === 'string')
    : []

  return {
    ...product,
    images,
  }
}

function normalizeProductWithCategory<T extends { images: unknown; category: any }>(product: T): ProductWithCategory {
  const normalized = normalizeProductImages(product)
  return {
    ...normalized,
    category: normalized.category,
  } as unknown as ProductWithCategory
}
