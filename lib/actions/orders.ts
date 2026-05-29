'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function createOrder(data: any) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error('User not found')

    const order = await db.order.create({
      data: {
        ...data,
        userId: user.id,
        orderNumber: `SA-${Date.now()}`,
      },
      include: { items: true, address: true },
    })

    return order
  } catch (error) {
    console.error('[createOrder]', error)
    throw new Error('Failed to create order')
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
      include: { items: { include: { product: true } }, address: true },
    })
  } catch (error) {
    console.error('[getOrderById]', error)
    throw new Error('Failed to fetch order')
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
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

export async function getAdminOrders() {
  try {
    return await db.order.findMany({
      include: { items: true, user: true, address: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
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