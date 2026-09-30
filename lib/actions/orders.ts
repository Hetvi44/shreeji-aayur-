'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import type { OrderStatus } from '@prisma/client'

export async function createOrder(data: any) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) return { success: false, error: 'User not found' }

    const cartItems = await db.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    })

    const normalizedCartItems = cartItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        images: Array.isArray(item.product.images)
          ? item.product.images.filter((img): img is string => typeof img === 'string')
          : [],
      },
    }))

    if (normalizedCartItems.length === 0) {
      return { success: false, error: 'Cart is empty' }
    }

    const subtotal = normalizedCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const shippingCharge = subtotal >= 99900 ? 0 : 9900
    const total = subtotal + shippingCharge

    const order = await db.order.create({
      data: {
        userId: user.id,
        addressId: data.addressId,
        paymentMethod: data.paymentMethod,
        orderNumber: `SA-${Date.now()}`,
        subtotal,
        shippingCharge,
        total,
        items: {
          create: normalizedCartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
            image: item.product.images[0] ?? '',
          })),
        },
      },
      include: { items: true, address: true },
    })

    return { success: true, data: { orderId: order.id, orderNumber: order.orderNumber, order } }
  } catch (error) {
    console.error('[createOrder]', error)
    return { success: false, error: 'Failed to create order' }
  }
}

export async function getUserOrders() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error('User not found')

    return await db.order.findMany({
      where: { userId: user.id },
      include: { items: true, address: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('[getUserOrders]', error)
    throw new Error('Failed to fetch orders')
  }
}

export async function getOrderById(orderId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error('User not found')

    return await db.order.findUnique({
      where: { id: orderId, userId: user.id },
      include: { items: { include: { product: true } }, address: true, coupon: true },
    })
  } catch (error) {
    console.error('[getOrderById]', error)
    throw new Error('Failed to fetch order')
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    return await db.order.update({
      where: { id: orderId },
      data: { status },
    })
  } catch (error) {
    console.error('[updateOrderStatus]', error)
    throw new Error('Failed to update order')
  }
}

export async function getAdminOrders(options: { limit?: number } = {}) {
  try {
    return await db.order.findMany({
      include: { items: true, user: true, address: true },
      orderBy: { createdAt: 'desc' },
      take: options.limit ?? 10,
    })
  } catch (error) {
    console.error('[getAdminOrders]', error)
    throw new Error('Failed to fetch orders')
  }
}

export async function getDashboardStats() {
  try {
    const totalOrders = await db.order.count()
    const totalRevenue = await db.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { total: true },
    })
    const totalCustomers = await db.user.count()
    const totalProducts = await db.product.count()

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalCustomers,
      totalProducts,
    }
  } catch (error) {
    console.error('[getDashboardStats]', error)
    throw new Error('Failed to fetch stats')
  }
}
