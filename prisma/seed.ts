// prisma/seed.ts
// Catalog (categories + products) is managed by admin — do not seed dummy products.
 // Run: npx prisma db seed
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
  console.log("🌿 Seeding ShreejiAayur (coupons only — catalog is admin-managed)...")

  const coupons = [
    { code: "HERBAL10",  type: "PERCENTAGE" as const, value: 10,   minOrderValue: 49900,  maxUses: 500, expiresAt: new Date("2026-12-31") },
    { code: "WELCOME15", type: "PERCENTAGE" as const, value: 15,   minOrderValue: 29900,  maxUses: 200, expiresAt: new Date("2026-12-31") },
    { code: "FLAT100",   type: "FIXED"      as const, value: 10000, minOrderValue: 99900, maxUses: 100, expiresAt: new Date("2026-12-31") },
  ]

  for (const coupon of coupons) {
    await db.coupon.upsert({
      where:  { code: coupon.code },
      create: coupon,
      update: { value: coupon.value, expiresAt: coupon.expiresAt },
    })
  }
  console.log(`✅ ${coupons.length} coupons seeded`)
  console.log("🌿 Done. Add categories and products from /admin.")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
