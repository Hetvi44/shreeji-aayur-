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

    return items
  } catch (error) {
    console.error('[getWishlist]', error)
    throw new Error('Failed to fetch wishlist')
  }
}

export async function toggleWishlist(productId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error('User not found')

    const existing = await db.wishlistItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    })

    if (existing) {
      await db.wishlistItem.delete({
        where: { id: existing.id },
      })
      return { added: false }
    } else {
      await db.wishlistItem.create({
        data: { userId: user.id, productId },
      })
      return { added: true }
    }
  } catch (error) {
    console.error('[toggleWishlist]', error)
    throw new Error('Failed to update wishlist')
  }
}