"use server"

import { db } from "@/lib/db"
import type { ActionResult } from "@/types"

// ─── CREATE RAZORPAY ORDER ───────────────────────────────────
export async function createRazorpayOrder(
  amount: number, // in paise
  orderId: string
): Promise<ActionResult<{ razorpayOrderId: string; amount: number; currency: string; key: string }>> {
  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt:  orderId,
        notes: { orderId },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[createRazorpayOrder] API error:", error)
      return { success: false, error: "Payment gateway error. Please try again." }
    }

    const razorpayOrder = await response.json()

    // Store razorpay order ID in our DB
    await db.order.update({
      where: { id: orderId },
      data:  { razorpayOrderId: razorpayOrder.id },
    })

    return {
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount:          razorpayOrder.amount,
        currency:        razorpayOrder.currency,
        key:             process.env.RAZORPAY_KEY_ID!,
      },
    }
  } catch (error) {
    console.error("[createRazorpayOrder]", error)
    return { success: false, error: "Failed to create payment order" }
  }
}

// ─── VERIFY RAZORPAY PAYMENT ─────────────────────────────────
export async function verifyRazorpayPayment(input: {
  razorpayOrderId:   string
  razorpayPaymentId: string
  razorpaySignature: string
  orderId:           string
}): Promise<ActionResult> {
  try {
    const crypto = await import("crypto")

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
      .digest("hex")

    if (expectedSignature !== input.razorpaySignature) {
      // Mark order as failed
      await db.order.update({
        where: { id: input.orderId },
        data:  { paymentStatus: "FAILED" },
      })
      return { success: false, error: "Payment verification failed. Please contact support." }
    }

    // Payment is verified — update order
    await db.order.update({
      where: { id: input.orderId },
      data: {
        paymentStatus:     "PAID",
        status:            "CONFIRMED",
        razorpayPaymentId: input.razorpayPaymentId,
      },
    })

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[verifyRazorpayPayment]", error)
    return { success: false, error: "Payment verification error" }
  }
}

// ─── RAZORPAY WEBHOOK HANDLER ────────────────────────────────
// Use in: app/api/webhooks/razorpay/route.ts
export async function handleRazorpayWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean }> {
  try {
    const crypto = await import("crypto")

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex")

    if (expectedSignature !== signature) {
      console.error("[webhook] Invalid signature")
      return { success: false }
    }

    const event = JSON.parse(body)

    if (event.event === "payment.captured") {
      const paymentId = event.payload.payment.entity.id
      const orderId   = event.payload.payment.entity.notes?.orderId

      if (orderId) {
        await db.order.update({
          where: { id: orderId },
          data: {
            paymentStatus:     "PAID",
            status:            "CONFIRMED",
            razorpayPaymentId: paymentId,
          },
        })
      }
    }

    if (event.event === "payment.failed") {
      const orderId = event.payload.payment.entity.notes?.orderId
      if (orderId) {
        await db.order.update({
          where: { id: orderId },
          data:  { paymentStatus: "FAILED" },
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error("[handleRazorpayWebhook]", error)
    return { success: false }
  }
}
