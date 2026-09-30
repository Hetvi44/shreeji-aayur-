'use server'

import Razorpay from 'razorpay'
import crypto from 'crypto'
import { db } from '@/lib/db'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

export async function createRazorpayOrder(amount: number, orderId: string) {
  try {
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: orderId,
    }

    const order = await razorpay.orders.create(options)
    await db.order.update({
      where: { id: orderId },
      data: { razorpayOrderId: order.id },
    })

    return {
      success: true,
      data: {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '',
        amount: order.amount,
        currency: order.currency,
        razorpayOrderId: order.id,
      },
    }
  } catch (error) {
    console.error('[createRazorpayOrder]', error)
    return { success: false, error: 'Failed to create Razorpay order' }
  }
}

export async function verifyRazorpayPayment(data: {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
  orderId: string
}) {
  try {
    const body = data.razorpayOrderId + '|' + data.razorpayPaymentId
    const secret = process.env.RAZORPAY_KEY_SECRET

    if (!secret) {
      return { success: false, error: 'Razorpay secret is not configured' }
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (expectedSignature === data.razorpaySignature) {
      await db.order.update({
        where: { id: data.orderId },
        data: {
          paymentStatus: 'PAID',
          razorpayPaymentId: data.razorpayPaymentId,
          status: 'CONFIRMED',
        },
      })
      return { success: true, verified: true }
    } else {
      return { success: false, verified: false, error: 'Invalid payment signature' }
    }
  } catch (error) {
    console.error('[verifyRazorpayPayment]', error)
    return { success: false, verified: false, error: 'Failed to verify payment' }
  }
}

export async function handleRazorpayWebhook(body: string, signature: string) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET

    if (!secret) {
      console.error('[handleRazorpayWebhook] Missing webhook secret')
      return { success: false, error: 'Webhook secret is not configured' }
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      return { success: false, error: 'Invalid signature' }
    }

    const event = JSON.parse(body)
    const payment = event?.payload?.payment?.entity

    if (event?.event === 'payment.captured' && payment?.order_id) {
      await db.order.updateMany({
        where: { razorpayOrderId: payment.order_id },
        data: {
          paymentStatus: 'PAID',
          razorpayPaymentId: payment.id,
          status: 'CONFIRMED',
        },
      })
    }

    if (event?.event === 'payment.failed' && payment?.order_id) {
      await db.order.updateMany({
        where: { razorpayOrderId: payment.order_id },
        data: { paymentStatus: 'FAILED' },
      })
    }

    return { success: true }
  } catch (error) {
    console.error('[handleRazorpayWebhook]', error)
    return { success: false, error: 'Failed to process webhook' }
  }
}
