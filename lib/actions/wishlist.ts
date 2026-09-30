'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function getWishlist() {
  const { userId } = await auth()
  
  if (!userId) return []

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) return []

    const items = await db.wishlistItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    })

    return items.map((item) => normalizeWishlistItem(item))
  } catch (error) {
    console.error('[getWishlist]', error)
    throw new Error('Failed to fetch wishlist')
  }
}

export async function toggleWishlist(productId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) return { success: false, error: 'User not found' }

    const existing = await db.wishlistItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    })

    if (existing) {
      await db.wishlistItem.delete({
        where: { id: existing.id },
      })
      return { success: true, data: { wishlisted: false } }
    } else {
      await db.wishlistItem.create({
        data: { userId: user.id, productId },
      })
      return { success: true, data: { wishlisted: true } }
    }
  } catch (error) {
    console.error('[toggleWishlist]', error)
    return { success: false, error: 'Failed to update wishlist' }
  }
}

function normalizeProduct<T extends { images: unknown }>(product: T) {
  return {
    ...product,
    images: Array.isArray(product.images)
      ? product.images.filter((item): item is string => typeof item === 'string')
      : [],
  }
}

function normalizeWishlistItem<T extends { product: { images: unknown } }>(item: T) {
  return {
    ...item,
    product: normalizeProduct(item.product),
  }
}
