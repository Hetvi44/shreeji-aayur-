"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import type { ActionResult, CartItemWithProduct } from "@/types"

// ─── GET CART ────────────────────────────────────────────────
export async function getCart(): Promise<CartItemWithProduct[]> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return []

    const user = await db.user.findUnique({ where: { clerkId } })
    if (!user) return []

    const items = await db.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true, name: true, slug: true,
            price: true, originalPrice: true,
            images: true, stock: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return items
  } catch (error) {
    console.error("[getCart]", error)
    return []
  }
}

// ─── ADD TO CART ─────────────────────────────────────────────
export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<ActionResult> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: "Please login to add items to cart" }

    const user = await db.user.findUnique({ where: { clerkId } })
    if (!user) return { success: false, error: "User not found" }

    // Check product stock
    const product = await db.product.findUnique({
      where: { id: productId, isActive: true },
    })
    if (!product) return { success: false, error: "Product not found" }
    if (product.stock < quantity) return { success: false, error: "Insufficient stock" }

    // Upsert cart item
    await db.cartItem.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      create: { userId: user.id, productId, quantity },
      update: { quantity: { increment: quantity } },
    })

    revalidatePath("/cart")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[addToCart]", error)
    return { success: false, error: "Failed to add to cart" }
  }
}

// ─── UPDATE CART QUANTITY ────────────────────────────────────
export async function updateCartQuantity(
  cartItemId: string,
  quantity: number
): Promise<ActionResult> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: "Unauthorized" }

    if (quantity <= 0) {
      await db.cartItem.delete({ where: { id: cartItemId } })
    } else {
      await db.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      })
    }

    revalidatePath("/cart")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[updateCartQuantity]", error)
    return { success: false, error: "Failed to update cart" }
  }
}

// ─── REMOVE FROM CART ────────────────────────────────────────
export async function removeFromCart(cartItemId: string): Promise<ActionResult> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: "Unauthorized" }

    await db.cartItem.delete({ where: { id: cartItemId } })

    revalidatePath("/cart")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[removeFromCart]", error)
    return { success: false, error: "Failed to remove item" }
  }
}

// ─── CLEAR CART ──────────────────────────────────────────────
export async function clearCart(): Promise<ActionResult> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: "Unauthorized" }

    const user = await db.user.findUnique({ where: { clerkId } })
    if (!user) return { success: false, error: "User not found" }

    await db.cartItem.deleteMany({ where: { userId: user.id } })

    revalidatePath("/cart")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[clearCart]", error)
    return { success: false, error: "Failed to clear cart" }
  }
}

// ─── GET CART COUNT ──────────────────────────────────────────
export async function getCartCount(): Promise<number> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return 0

    const user = await db.user.findUnique({ where: { clerkId } })
    if (!user) return 0

    const result = await db.cartItem.aggregate({
      where: { userId: user.id },
      _sum: { quantity: true },
    })

    return result._sum.quantity ?? 0
  } catch {
    return 0
  }
}
