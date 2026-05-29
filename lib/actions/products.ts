'use server'

import { db } from '@/lib/db'
import { Product } from '@/types'

interface GetProductsOptions {
  featured?: boolean
  trending?: boolean
  limit?: number
  categoryId?: string
  search?: string
}

export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  const { featured, trending, limit = 10, categoryId, search } = options

  try {
    const where: any = { isActive: true }

    if (featured) where.isFeatured = true
    if (trending) where.isTrending = true
    if (categoryId) where.categoryId = categoryId
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

    return products
  } catch (error) {
    console.error('[getProducts]', error)
    throw new Error('Failed to fetch products')
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: { category: true },
    })
    return product
  } catch (error) {
    console.error('[getProductBySlug]', error)
    throw new Error('Failed to fetch product')
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: { category: true },
    })
    return product
  } catch (error) {
    console.error('[getProductById]', error)
    throw new Error('Failed to fetch product')
  }
}

export async function createProduct(data: any) {
  try {
    const product = await db.product.create({
      data,
      include: { category: true },
    })
    return product
  } catch (error) {
    console.error('[createProduct]', error)
    throw new Error('Failed to create product')
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await db.product.update({
      where: { id },
      data,
      include: { category: true },
    })
    return product
  } catch (error) {
    console.error('[updateProduct]', error)
    throw new Error('Failed to update product')
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.update({
      where: { id },
      data: { isActive: false },
    })
    return { success: true }
  } catch (error) {
    console.error('[deleteProduct]', error)
    throw new Error('Failed to delete product')
  }
}

export async function getAdminProducts() {
  try {
    const products = await db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    return products
  } catch (error) {
    console.error('[getAdminProducts]', error)
    throw new Error('Failed to fetch products')
  }
}