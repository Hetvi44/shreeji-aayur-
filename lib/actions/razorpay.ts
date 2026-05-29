'use server'

import Razorpay from 'razorpay'

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
    return order
  } catch (error) {
    console.error('[createRazorpayOrder]', error)
    throw new Error('Failed to create Razorpay order')
  }
}

export async function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  try {
    const crypto = require('crypto')
    const body = razorpayOrderId + '|' + razorpayPaymentId
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSignature === razorpaySignature) {
      return { verified: true }
    } else {
      return { verified: false }
    }
  } catch (error) {
    console.error('[verifyRazorpayPayment]', error)
    throw new Error('Failed to verify payment')
  }
}