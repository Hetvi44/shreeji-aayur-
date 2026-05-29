"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import type { ActionResult } from "@/types"

// ─── VALIDATE COUPON ─────────────────────────────────────────
export async function validateCoupon(
  code: string,
  orderTotal: number // in paise
): Promise<ActionResult<{ discount: number; type: string; value: number }>> {
  try {
    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase(), isActive: true },
    })

    if (!coupon) {
      return { success: false, error: "Invalid coupon code" }
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return { success: false, error: "This coupon has expired" }
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return { success: false, error: "This coupon has reached its usage limit" }
    }

    if (orderTotal < coupon.minOrderValue) {
      const minRupees = Math.round(coupon.minOrderValue / 100)
      return {
        success: false,
        error: `Minimum order value of ₹${minRupees} required for this coupon`,
      }
    }

    const discount =
      coupon.type === "PERCENTAGE"
        ? Math.round((orderTotal * coupon.value) / 100)
        : coupon.value

    return {
      success: true,
      data: { discount, type: coupon.type, value: coupon.value },
    }
  } catch (error) {
    console.error("[validateCoupon]", error)
    return { success: false, error: "Failed to validate coupon" }
  }
}

// ─── GET ALL COUPONS (ADMIN) ─────────────────────────────────
export async function getAdminCoupons() {
  try {
    return await db.coupon.findMany({
      include: {
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[getAdminCoupons]", error)
    return []
  }
}

// ─── CREATE COUPON ───────────────────────────────────────────
export async function createCoupon(input: {
  code: string
  type: "PERCENTAGE" | "FIXED"
  value: number
  minOrderValue?: number
  maxUses?: number
  expiresAt?: string
}): Promise<ActionResult<{ id: string }>> {
  try {
    const existing = await db.coupon.findUnique({
      where: { code: input.code.toUpperCase() },
    })
    if (existing) {
      return { success: false, error: "Coupon code already exists" }
    }

    const coupon = await db.coupon.create({
      data: {
        code:          input.code.toUpperCase(),
        type:          input.type,
        value:         input.type === "PERCENTAGE" ? input.value : input.value * 100,
        minOrderValue: (input.minOrderValue ?? 0) * 100,
        maxUses:       input.maxUses ?? 100,
        expiresAt:     input.expiresAt ? new Date(input.expiresAt) : null,
      },
    })

    revalidatePath("/admin/coupons")
    return { success: true, data: { id: coupon.id } }
  } catch (error) {
    console.error("[createCoupon]", error)
    return { success: false, error: "Failed to create coupon" }
  }
}

// ─── TOGGLE COUPON STATUS ────────────────────────────────────
export async function toggleCoupon(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    await db.coupon.update({ where: { id }, data: { isActive } })
    revalidatePath("/admin/coupons")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[toggleCoupon]", error)
    return { success: false, error: "Failed to update coupon" }
  }
}

// ─── DELETE COUPON ───────────────────────────────────────────
export async function deleteCoupon(id: string): Promise<ActionResult> {
  try {
    await db.coupon.delete({ where: { id } })
    revalidatePath("/admin/coupons")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[deleteCoupon]", error)
    return { success: false, error: "Failed to delete coupon" }
  }
}
