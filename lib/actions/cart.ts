'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

function normalizeProduct<T extends { images: unknown }>(product: T) {
  return {
    ...product,
    images: Array.isArray(product.images)
      ? product.images.filter((item): item is string => typeof item === 'string')
      : [],
  }
}

function normalizeCartItem<T extends { product: { images: unknown } }>(item: T) {
  return {
    ...item,
    product: normalizeProduct(item.product),
  }
}

export async function getCart() {
  const { userId } = await auth()
  
  if (!userId) {
    return { items: [], total: 0, count: 0 }
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) return { items: [], total: 0, count: 0 }

    const items = await db.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    })

    const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    const count = items.reduce((acc, item) => acc + item.quantity, 0)

    return { items: items.map((item) => normalizeCartItem(item)), total, count }
  } catch (error) {
    console.error('[getCart]', error)
    throw new Error('Failed to fetch cart')
  }
}

export async function addToCart(productId: string, quantity: number = 1) {
  const { userId } = await auth()
  
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) return { success: false, error: 'User not found' }

    const existingItem = await db.cartItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    })

    if (existingItem) {
      const item = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
        include: { product: true },
      })
      return { success: true, data: normalizeCartItem(item) }
    } else {
      const item = await db.cartItem.create({
        data: { userId: user.id, productId, quantity },
        include: { product: true },
      })
      return { success: true, data: normalizeCartItem(item) }
    }
  } catch (error) {
    console.error('[addToCart]', error)
    return { success: false, error: 'Failed to add to cart' }
  }
}

export async function removeFromCart(cartItemId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    await db.cartItem.delete({
      where: { id: cartItemId },
    })
    return { success: true }
  } catch (error) {
    console.error('[removeFromCart]', error)
    return { success: false, error: 'Failed to remove from cart' }
  }
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    if (quantity <= 0) {
      return await removeFromCart(cartItemId)
    }

    const item = await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    })
    return { success: true, data: normalizeCartItem(item) }
  } catch (error) {
    console.error('[updateCartQuantity]', error)
    return { success: false, error: 'Failed to update cart' }
  }
}

export async function clearCart() {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) return { success: false, error: 'User not found' }

    await db.cartItem.deleteMany({
      where: { userId: user.id },
    })

    return { success: true }
  } catch (error) {
    console.error('[clearCart]', error)
    return { success: false, error: 'Failed to clear cart' }
  }
}

export async function getCartCount() {
  const { userId } = await auth()
  
  if (!userId) return 0

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) return 0

    const count = await db.cartItem.aggregate({
      where: { userId: user.id },
      _sum: { quantity: true },
    })

    return count._sum.quantity || 0
  } catch (error) {
    console.error('[getCartCount]', error)
    return 0
  }
}
