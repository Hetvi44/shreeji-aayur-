"use server"

import { revalidatePath } from "next/cache"
import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import type { ActionResult } from "@/types"

// ─── SYNC CLERK USER TO DATABASE ─────────────────────────────
// Call this after user signs up / signs in via Clerk webhook
export async function syncUser(): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: "Not authenticated" }

    const clerkUser = await currentUser()
    if (!clerkUser) return { success: false, error: "User not found in Clerk" }

    const email = clerkUser.emailAddresses[0]?.emailAddress ?? ""
    const name  = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim()
    const avatar = clerkUser.imageUrl ?? null

    const user = await db.user.upsert({
      where:  { clerkId },
      create: { clerkId, email, name, avatar },
      update: { email, name, avatar },
    })

    return { success: true, data: { id: user.id } }
  } catch (error) {
    console.error("[syncUser]", error)
    return { success: false, error: "Failed to sync user" }
  }
}

// ─── GET CURRENT USER PROFILE ────────────────────────────────
export async function getUserProfile() {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return null

    const user = await db.user.findUnique({
      where: { clerkId },
      include: {
        addresses: { orderBy: { isDefault: "desc" } },
        _count: {
          select: { orders: true, reviews: true, wishlist: true },
        },
      },
    })

    return user
  } catch (error) {
    console.error("[getUserProfile]", error)
    return null
  }
}

// ─── UPDATE PROFILE ──────────────────────────────────────────
export async function updateProfile(input: {
  name: string
  phone?: string
}): Promise<ActionResult> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: "Not authenticated" }

    await db.user.update({
      where: { clerkId },
      data: {
        name:  input.name,
        phone: input.phone ?? null,
      },
    })

    revalidatePath("/profile")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[updateProfile]", error)
    return { success: false, error: "Failed to update profile" }
  }
}

// ─── ADD ADDRESS ─────────────────────────────────────────────
export async function addAddress(input: {
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  isDefault?: boolean
}): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: "Not authenticated" }

    const user = await db.user.findUnique({ where: { clerkId } })
    if (!user) return { success: false, error: "User not found" }

    // If new address is default, unset all others
    if (input.isDefault) {
      await db.address.updateMany({
        where: { userId: user.id },
        data:  { isDefault: false },
      })
    }

    const address = await db.address.create({
      data: {
        userId:    user.id,
        name:      input.name,
        phone:     input.phone,
        line1:     input.line1,
        line2:     input.line2 ?? null,
        city:      input.city,
        state:     input.state,
        pincode:   input.pincode,
        isDefault: input.isDefault ?? false,
      },
    })

    revalidatePath("/profile")
    revalidatePath("/checkout")
    return { success: true, data: { id: address.id } }
  } catch (error) {
    console.error("[addAddress]", error)
    return { success: false, error: "Failed to add address" }
  }
}

// ─── DELETE ADDRESS ──────────────────────────────────────────
export async function deleteAddress(id: string): Promise<ActionResult> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: "Not authenticated" }

    await db.address.delete({ where: { id } })

    revalidatePath("/profile")
    revalidatePath("/checkout")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[deleteAddress]", error)
    return { success: false, error: "Failed to delete address" }
  }
}

// ─── SET DEFAULT ADDRESS ─────────────────────────────────────
export async function setDefaultAddress(id: string): Promise<ActionResult> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: "Not authenticated" }

    const user = await db.user.findUnique({ where: { clerkId } })
    if (!user) return { success: false, error: "User not found" }

    await db.address.updateMany({
      where: { userId: user.id },
      data:  { isDefault: false },
    })
    await db.address.update({
      where: { id },
      data:  { isDefault: true },
    })

    revalidatePath("/profile")
    revalidatePath("/checkout")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[setDefaultAddress]", error)
    return { success: false, error: "Failed to update address" }
  }
}

// ─── GET ALL USERS (ADMIN) ───────────────────────────────────
export async function getAdminUsers(params?: {
  page?: number
  limit?: number
  search?: string
}) {
  try {
    const page  = params?.page ?? 1
    const limit = params?.limit ?? 20
    const skip  = (page - 1) * limit

    const where = params?.search
      ? {
          OR: [
            { name:  { contains: params.search, mode: "insensitive" as const } },
            { email: { contains: params.search, mode: "insensitive" as const } },
          ],
        }
      : {}

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        include: {
          _count: { select: { orders: true } },
          orders: {
            select: { total: true },
            where:  { paymentStatus: "PAID" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ])

    return { users, total, pages: Math.ceil(total / limit) }
  } catch (error) {
    console.error("[getAdminUsers]", error)
    return { users: [], total: 0, pages: 0 }
  }
}

// ─── WISHLIST TOGGLE ─────────────────────────────────────────
export async function toggleWishlist(
  productId: string
): Promise<ActionResult<{ wishlisted: boolean }>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: "Please login first" }

    const user = await db.user.findUnique({ where: { clerkId } })
    if (!user) return { success: false, error: "User not found" }

    const existing = await db.wishlistItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    })

    if (existing) {
      await db.wishlistItem.delete({ where: { id: existing.id } })
      revalidatePath("/wishlist")
      return { success: true, data: { wishlisted: false } }
    } else {
      await db.wishlistItem.create({
        data: { userId: user.id, productId },
      })
      revalidatePath("/wishlist")
      return { success: true, data: { wishlisted: true } }
    }
  } catch (error) {
    console.error("[toggleWishlist]", error)
    return { success: false, error: "Failed to update wishlist" }
  }
}

// ─── GET WISHLIST ────────────────────────────────────────────
export async function getWishlist() {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return []

    const user = await db.user.findUnique({ where: { clerkId } })
    if (!user) return []

    const items = await db.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: { category: { select: { name: true, slug: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return items
  } catch (error) {
    console.error("[getWishlist]", error)
    return []
  }
}
