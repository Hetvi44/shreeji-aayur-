// app/api/webhooks/razorpay/route.ts
import { NextRequest, NextResponse } from "next/server"
import { handleRazorpayWebhook } from "@/lib/actions/razorpay"

export async function POST(req: NextRequest) {
  try {
    const body      = await req.text()
    const signature = req.headers.get("x-razorpay-signature") ?? ""

    const result = await handleRazorpayWebhook(body, signature)

    if (!result.success) {
      return NextResponse.json({ error: "Webhook error" }, { status: 400 })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[razorpay-webhook]", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
