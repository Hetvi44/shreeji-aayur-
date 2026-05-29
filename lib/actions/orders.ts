"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import type { ActionResult, OrderWithItems } from "@/types"

// ─── CREATE ORDER ────────────────────────────────────────────
export async function createOrder(input: {
  addressId: string
  paymentMethod: "razorpay" | "cod"
  couponCode?: string
}): Promise<ActionResult<{ orderId: string; orderNumber: string; razorpayOrderId?: string }>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: "Please login to place an order" }

    const user = await db.user.findUnique({
      where: { clerkId },
      include: {
        cart: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!user) return { success: false, error: "User not found" }
    if (user.cart.length === 0) return { success: false, error: "Cart is empty" }

    // Validate stock for all items
    for (const item of user.cart) {
      if (item.product.stock < item.quantity) {
        return {
          success: false,
          error: `"${item.product.name}" has only ${item.product.stock} units left`,
        }
      }
    }

    // Calculate subtotal
    const subtotal = user.cart.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    )

    // Apply coupon
    let discount  = 0
    let couponId: string | undefined

    if (input.couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: input.couponCode.toUpperCase(), isActive: true },
      })

      if (coupon) {
        const isExpired = coupon.expiresAt && coupon.expiresAt < new Date()
        const isMaxed   = coupon.usedCount >= coupon.maxUses
        const meetsMin  = subtotal >= coupon.minOrderValue

        if (!isExpired && !isMaxed && meetsMin) {
          discount =
            coupon.type === "PERCENTAGE"
              ? Math.round((subtotal * coupon.value) / 100)
              : coupon.value
          couponId = coupon.id
        }
      }
    }

    // Shipping: free above ₹999
    const shippingCharge = subtotal >= 99900 ? 0 : 9900 // paise
    const total = subtotal - discount + shippingCharge

    // Generate readable order number
    const orderNumber = `SA-${Date.now().toString().slice(-8)}`

    // Create order in transaction
    const order = await db.$transaction(async (tx: any) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId:        user.id,
          addressId:     input.addressId,
          paymentMethod: input.paymentMethod,
          paymentStatus: input.paymentMethod === "cod" ? "PENDING" : "PENDING",
          status:        "PENDING",
          subtotal,
          discount,
          shippingCharge,
          total,
          couponId,
          items: {
            create: user.cart.map((item: any) => ({
              productId: item.productId,
              quantity:  item.quantity,
              price:     item.product.price,
              name:      item.product.name,
              image:     item.product.images[0] ?? "",
            })),
          },
        },
      })

      // Decrement stock
      for (const item of user.cart) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      // Increment coupon usage
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        })
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { userId: user.id } })

      return newOrder
    })

    revalidatePath("/cart")
    revalidatePath("/orders")
    revalidatePath("/admin/orders")

    return {
      success: true,
      data: { orderId: order.id, orderNumber: order.orderNumber },
    }
  } catch (error) {
    console.error("[createOrder]", error)
    return { success: false, error: "Failed to place order. Please try again." }
  }
}

// ─── GET USER ORDERS ─────────────────────────────────────────
export async function getUserOrders(): Promise<OrderWithItems[]> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return []

    const user = await db.user.findUnique({ where: { clerkId } })
    if (!user) return []

    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: {
        items:   true,
        address: true,
        coupon:  { select: { code: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return orders
  } catch (error) {
    console.error("[getUserOrders]", error)
    return []
  }
}

// ─── GET SINGLE ORDER ────────────────────────────────────────
export async function getOrderById(
  orderId: string
): Promise<OrderWithItems | null> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return null

    const user = await db.user.findUnique({ where: { clerkId } })
    if (!user) return null

    const order = await db.order.findFirst({
      where: { id: orderId, userId: user.id },
      include: {
        items:   true,
        address: true,
        coupon:  { select: { code: true } },
      },
    })

    return order
  } catch (error) {
    console.error("[getOrderById]", error)
    return null
  }
}

// ─── UPDATE ORDER STATUS (ADMIN) ─────────────────────────────
export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string
): Promise<ActionResult> {
  try {
    await db.order.update({
      where: { id: orderId },
      data: {
        status: status as any,
        ...(trackingNumber && { trackingNumber }),
        ...(status === "DELIVERED" && {
          paymentStatus: "PAID",
        }),
      },
    })

    revalidatePath("/admin/orders")
    revalidatePath("/orders")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[updateOrderStatus]", error)
    return { success: false, error: "Failed to update order status" }
  }
}

// ─── GET ALL ORDERS (ADMIN) ──────────────────────────────────
export async function getAdminOrders(params?: {
  status?: string
  limit?: number
  page?: number
}) {
  try {
    const page  = params?.page ?? 1
    const limit = params?.limit ?? 20
    const skip  = (page - 1) * limit

    const where = params?.status && params.status !== "ALL"
      ? { status: params.status as any }
      : {}

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          user:    { select: { name: true, email: true } },
          items:   { select: { quantity: true, name: true } },
          address: { select: { city: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.order.count({ where }),
    ])

    return { orders, total, pages: Math.ceil(total / limit) }
  } catch (error) {
    console.error("[getAdminOrders]", error)
    return { orders: [], total: 0, pages: 0 }
  }
}

// ─── ADMIN DASHBOARD STATS ───────────────────────────────────
export async function getDashboardStats() {
  try {
    const [totalRevenue, totalOrders, totalCustomers, lowStockCount] =
      await Promise.all([
        db.order.aggregate({
          where: { paymentStatus: "PAID" },
          _sum: { total: true },
        }),
        db.order.count(),
        db.user.count({ where: { role: "CUSTOMER" } }),
        db.product.count({
          where: { stock: { lt: 10 }, isActive: true },
        }),
      ])

    return {
      revenue:    totalRevenue._sum.total ?? 0,
      orders:     totalOrders,
      customers:  totalCustomers,
      lowStock:   lowStockCount,
    }
  } catch (error) {
    console.error("[getDashboardStats]", error)
    return { revenue: 0, orders: 0, customers: 0, lowStock: 0 }
  }
}
