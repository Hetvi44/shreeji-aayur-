// app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const { type, data } = payload

    // User created in Clerk → create in our DB
    if (type === "user.created") {
      const email  = data.email_addresses?.[0]?.email_address ?? ""
      const name   = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim()
      const avatar = data.image_url ?? null

      await db.user.upsert({
        where:  { clerkId: data.id },
        create: { clerkId: data.id, email, name, avatar },
        update: { email, name, avatar },
      })
    }

    // User updated in Clerk → update in our DB
    if (type === "user.updated") {
      const email  = data.email_addresses?.[0]?.email_address ?? ""
      const name   = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim()
      const avatar = data.image_url ?? null

      await db.user.update({
        where: { clerkId: data.id },
        data:  { email, name, avatar },
      })
    }

    // User deleted in Clerk → deactivate in our DB
    if (type === "user.deleted") {
      await db.user.updateMany({
        where: { clerkId: data.id },
        data:  { role: "CUSTOMER" }, // keep user data for order history
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[clerk-webhook]", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
