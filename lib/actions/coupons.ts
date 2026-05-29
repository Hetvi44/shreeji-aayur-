'use server'

import { db } from '@/lib/db'

export async function validateCoupon(code: string, orderTotal: number) {
  try {
    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) return { valid: false, message: 'Coupon not found' }
    if (!coupon.isActive) return { valid: false, message: 'Coupon is inactive' }
    if (coupon.usedCount >= coupon.maxUses) return { valid: false, message: 'Coupon usage limit reached' }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, message: 'Coupon expired' }
    if (orderTotal < coupon.minOrderValue) return { valid: false, message: `Minimum order value ₹${coupon.minOrderValue / 100} required` }

    let discount = 0
    if (coupon.type === 'PERCENTAGE') {
      discount = Math.floor((orderTotal * coupon.value) / 100)
    } else {
      discount = coupon.value
    }

    return { valid: true, discount, coupon }
  } catch (error) {
    console.error('[validateCoupon]', error)
    throw new Error('Failed to validate coupon')
  }
}

export async function createCoupon(data: any) {
  try {
    const coupon = await db.coupon.create({
      data,
    })
    return coupon
  } catch (error) {
    console.error('[createCoupon]', error)
    throw new Error('Failed to create coupon')
  }
}

export async function toggleCoupon(couponId: string, isActive: boolean) {
  try {
    return await db.coupon.update({
      where: { id: couponId },
      data: { isActive },
    })
  } catch (error) {
    console.error('[toggleCoupon]', error)
    throw new Error('Failed to toggle coupon')
  }
}

export async function deleteCoupon(couponId: string) {
  try {
    await db.coupon.delete({
      where: { id: couponId },
    })
    return { success: true }
  } catch (error) {
    console.error('[deleteCoupon]', error)
    throw new Error('Failed to delete coupon')
  }
}

export async function getAdminCoupons() {
  try {
    return await db.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('[getAdminCoupons]', error)
    throw new Error('Failed to fetch coupons')
  }
}