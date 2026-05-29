'use server'

import { db } from '@/lib/db'
import { Category } from '@/types'

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
    return categories
  } catch (error) {
    console.error('[getCategories]', error)
    throw new Error('Failed to fetch categories')
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const category = await db.category.findUnique({
      where: { slug },
    })
    return category
  } catch (error) {
    console.error('[getCategoryBySlug]', error)
    throw new Error('Failed to fetch category')
  }
}