'use server'

import { db } from '@/lib/db'
import { slugify } from '@/lib/utils'
import type { Category } from '@/types'
import { revalidatePath } from 'next/cache'

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

export async function getAdminCategories(): Promise<Category[]> {
  try {
    return await db.category.findMany({
      orderBy: { sortOrder: 'asc' },
    })
  } catch (error) {
    console.error('[getAdminCategories]', error)
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

async function uniqueCategorySlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base) || 'category'
  let candidate = slug
  let i = 2
  while (true) {
    const existing = await db.category.findUnique({ where: { slug: candidate } })
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${slug}-${i++}`
  }
}

export async function createCategory(input: {
  name: string
  description?: string | null
  image?: string | null
  sortOrder?: number
}) {
  try {
    const name = input.name.trim()
    if (!name) throw new Error('Category name is required')

    const slug = await uniqueCategorySlug(name)
    const category = await db.category.create({
      data: {
        name,
        slug,
        description: input.description?.trim() || null,
        image: input.image?.trim() || null,
        sortOrder: input.sortOrder ?? 0,
        isActive: true,
      },
    })
    revalidatePath('/')
    revalidatePath('/admin/categories')
    revalidatePath('/products')
    return { success: true as const, data: category }
  } catch (error: any) {
    console.error('[createCategory]', error)
    if (error?.code === 'P2002') {
      return { success: false as const, error: 'A category with this name already exists' }
    }
    return { success: false as const, error: error?.message || 'Failed to create category' }
  }
}

export async function updateCategory(
  id: string,
  input: {
    name?: string
    description?: string | null
    image?: string | null
    sortOrder?: number
    isActive?: boolean
  }
) {
  try {
    const data: Record<string, unknown> = {}
    if (input.name !== undefined) {
      const name = input.name.trim()
      if (!name) throw new Error('Category name is required')
      data.name = name
      data.slug = await uniqueCategorySlug(name, id)
    }
    if (input.description !== undefined) data.description = input.description?.trim() || null
    if (input.image !== undefined) data.image = input.image?.trim() || null
    if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder
    if (input.isActive !== undefined) data.isActive = input.isActive

    const category = await db.category.update({ where: { id }, data })
    revalidatePath('/')
    revalidatePath('/admin/categories')
    revalidatePath('/products')
    revalidatePath(`/category/${category.slug}`)
    return { success: true as const, data: category }
  } catch (error: any) {
    console.error('[updateCategory]', error)
    if (error?.code === 'P2002') {
      return { success: false as const, error: 'A category with this name already exists' }
    }
    return { success: false as const, error: error?.message || 'Failed to update category' }
  }
}

export async function deleteCategory(id: string) {
  try {
    const productCount = await db.product.count({
      where: { categoryId: id, isActive: true },
    })
    if (productCount > 0) {
      await db.category.update({
        where: { id },
        data: { isActive: false },
      })
      revalidatePath('/')
      revalidatePath('/admin/categories')
      return {
        success: true as const,
        deactivated: true as const,
        message: `Category deactivated (${productCount} active product${productCount === 1 ? '' : 's'} still linked)`,
      }
    }

    await db.category.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/categories')
    return { success: true as const, deactivated: false as const, message: 'Category deleted' }
  } catch (error: any) {
    console.error('[deleteCategory]', error)
    return { success: false as const, error: error?.message || 'Failed to delete category' }
  }
}
