// prisma/seed.ts
// Run: npx prisma db seed
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
  console.log("🌿 Seeding ShreejiAayur database...")

  // ── Categories ───────────────────────────────────────────
  const categories = await Promise.all([
    db.category.upsert({
      where:  { slug: "face-care" },
      create: { name: "Face Care", slug: "face-care", sortOrder: 1 },
      update: {},
    }),
    db.category.upsert({
      where:  { slug: "skin-care" },
      create: { name: "Skin Care", slug: "skin-care", sortOrder: 2 },
      update: {},
    }),
    db.category.upsert({
      where:  { slug: "hair-care" },
      create: { name: "Hair Care", slug: "hair-care", sortOrder: 3 },
      update: {},
    }),
    db.category.upsert({
      where:  { slug: "body-care" },
      create: { name: "Body Care", slug: "body-care", sortOrder: 4 },
      update: {},
    }),
  ])

  const [faceCare, skinCare, hairCare, bodyCare] = categories
  console.log("✅ Categories created")

  // ── Products ─────────────────────────────────────────────
  const productsData = [
    {
      name:          "Kumkumadi Radiance Serum",
      slug:          "kumkumadi-radiance-serum",
      description:   "A luxurious blend of 26 Ayurvedic herbs including saffron and sandalwood. Brightens skin, reduces dark spots, and gives a natural golden glow.",
      ingredients:   "Saffron, Sandalwood, Lotus, Vetiver, Licorice, Manjistha, Sesame Oil",
      benefits:      '["Brightens complexion","Reduces dark spots","Anti-aging","Natural golden glow"]',
      howToUse:      "Apply 2-3 drops to clean face at night. Massage gently until absorbed.",
      price:         129900,   // ₹1299 in paise
      originalPrice: 159900,
      stock:         42,
      images:        ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500"],
      badge:         "Best Seller",
      categoryId:    faceCare.id,
      isFeatured:    true,
      isTrending:    false,
    },
    {
      name:          "Rose & Saffron Face Mist",
      slug:          "rose-saffron-face-mist",
      description:   "Refreshing hydration mist infused with pure rose water and precious saffron extracts. Balances skin pH and provides instant freshness.",
      ingredients:   "Rose Water, Saffron Extract, Glycerin, Aloe Vera Juice",
      benefits:      '["Instant hydration","Balances pH","Sets makeup","Refreshing"]',
      howToUse:      "Hold 8-10 inches away. Mist over face with eyes closed. Use anytime.",
      price:         59900,
      originalPrice: null,
      stock:         67,
      images:        ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=500"],
      badge:         null,
      categoryId:    skinCare.id,
      isFeatured:    true,
      isTrending:    true,
    },
    {
      name:          "Neem Purifying Cleanser",
      slug:          "neem-purifying-cleanser",
      description:   "Gentle yet effective cleanser powered by neem and tulsi. Removes impurities without stripping natural oils. Ideal for oily and acne-prone skin.",
      ingredients:   "Neem Extract, Tulsi Extract, Tea Tree Oil, Aloe Vera, Green Tea",
      benefits:      '["Controls oil","Fights acne","Deep cleansing","Gentle formula"]',
      howToUse:      "Apply to wet face. Massage in circular motions for 60 seconds. Rinse thoroughly.",
      price:         44900,
      originalPrice: null,
      stock:         8,
      images:        ["https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500"],
      badge:         null,
      categoryId:    faceCare.id,
      isFeatured:    false,
      isTrending:    false,
    },
    {
      name:          "Ubtan Body Polish",
      slug:          "ubtan-body-polish",
      description:   "Traditional turmeric-based body scrub that exfoliates, brightens, and nourishes. Made with chickpea flour, turmeric, and rose petals.",
      ingredients:   "Chickpea Flour, Turmeric, Rose Petals, Sandalwood Powder, Milk Powder",
      benefits:      '["Exfoliates dead skin","Brightens tone","Natural glow","Nourishing"]',
      howToUse:      "Mix with rose water or milk. Apply on damp skin. Scrub gently. Rinse off.",
      price:         79900,
      originalPrice: 99900,
      stock:         31,
      images:        ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500"],
      badge:         "New",
      categoryId:    bodyCare.id,
      isFeatured:    true,
      isTrending:    true,
    },
    {
      name:          "Brahmi Hair Oil",
      slug:          "brahmi-hair-oil",
      description:   "Strengthening hair oil with brahmi, bhringraj, and amla. Promotes healthy hair growth, reduces hairfall, and adds natural shine.",
      ingredients:   "Brahmi, Bhringraj, Amla, Coconut Oil, Sesame Oil, Hibiscus",
      benefits:      '["Reduces hairfall","Strengthens roots","Promotes growth","Natural shine"]',
      howToUse:      "Warm oil slightly. Massage into scalp for 10 minutes. Leave for 1 hour. Shampoo off.",
      price:         69900,
      originalPrice: null,
      stock:         0,
      images:        ["https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500"],
      badge:         "Best Seller",
      categoryId:    hairCare.id,
      isFeatured:    true,
      isTrending:    false,
    },
    {
      name:          "Sandalwood Face Cream",
      slug:          "sandalwood-face-cream",
      description:   "Rich moisturizing cream with pure sandalwood and almond oil. Deeply hydrates and soothes while providing a luxurious fragrance.",
      ingredients:   "Sandalwood Extract, Sweet Almond Oil, Shea Butter, Vitamin E, Rose Hip",
      benefits:      '["Deep hydration","Calming effect","Anti-tan","Luxurious fragrance"]',
      howToUse:      "Apply a small amount to face and neck after cleansing. Use morning and night.",
      price:         89900,
      originalPrice: null,
      stock:         19,
      images:        ["https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?q=80&w=500"],
      badge:         "New",
      categoryId:    skinCare.id,
      isFeatured:    false,
      isTrending:    true,
    },
    {
      name:          "Turmeric Glow Mask",
      slug:          "turmeric-glow-mask",
      description:   "Traditional haldi mask enriched with besan and honey. Brightens complexion and gives you a natural wedding-ready glow.",
      ingredients:   "Turmeric, Chickpea Flour, Raw Honey, Sandalwood, Rose Water",
      benefits:      '["Instant glow","Even skin tone","Anti-bacterial","Deep cleanse"]',
      howToUse:      "Mix 1 tbsp with rose water. Apply on face for 15 min. Rinse with warm water.",
      price:         54900,
      originalPrice: null,
      stock:         5,
      images:        ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500"],
      badge:         "New",
      categoryId:    faceCare.id,
      isFeatured:    false,
      isTrending:    true,
    },
    {
      name:          "Aloe Vera Gel",
      slug:          "aloe-vera-gel",
      description:   "Pure aloe vera gel with added vitamin E. Multi-purpose hydrator for face, body, and hair. Soothes sunburn and irritation instantly.",
      ingredients:   "99% Pure Aloe Vera, Vitamin E, Cucumber Extract, Green Tea Extract",
      benefits:      '["Deep hydration","Soothes sunburn","Non-greasy","Multi-purpose"]',
      howToUse:      "Apply directly to skin or hair. Suitable for all skin types. Use as needed.",
      price:         34900,
      originalPrice: null,
      stock:         93,
      images:        ["https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500"],
      badge:         null,
      categoryId:    bodyCare.id,
      isFeatured:    false,
      isTrending:    false,
    },
    {
      name:          "Amla Hair Mask",
      slug:          "amla-hair-mask",
      description:   "Intensive hair treatment with amla, shikakai, and coconut milk. Strengthens roots, prevents premature greying, and adds bounce.",
      ingredients:   "Amla, Shikakai, Coconut Milk, Fenugreek, Hibiscus Flower",
      benefits:      '["Strengthens roots","Prevents greying","Adds shine","Deep conditioning"]',
      howToUse:      "Apply to hair and scalp. Leave for 30 minutes. Rinse with mild shampoo.",
      price:         64900,
      originalPrice: null,
      stock:         24,
      images:        ["https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500"],
      badge:         null,
      categoryId:    hairCare.id,
      isFeatured:    false,
      isTrending:    false,
    },
    {
      name:          "Vitamin C Brightening Serum",
      slug:          "vitamin-c-brightening-serum",
      description:   "Powerful antioxidant serum with vitamin C, hyaluronic acid, and orange extracts. Brightens skin and protects against pollution damage.",
      ingredients:   "Vitamin C (20%), Hyaluronic Acid, Orange Peel Extract, Niacinamide, Ferulic Acid",
      benefits:      '["Brightens skin","Fades dark spots","Anti-oxidant","Protects from pollution"]',
      howToUse:      "Apply 3-4 drops to face after cleansing. Follow with moisturizer. Use AM only.",
      price:         99900,
      originalPrice: 119900,
      stock:         12,
      images:        ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500"],
      badge:         "Trending",
      categoryId:    skinCare.id,
      isFeatured:    true,
      isTrending:    true,
    },
    {
      name:          "Jasmine Body Lotion",
      slug:          "jasmine-body-lotion",
      description:   "Lightweight body lotion infused with jasmine extract and shea butter. Non-greasy formula for all-day moisture.",
      ingredients:   "Jasmine Extract, Shea Butter, Jojoba Oil, Vitamin B5, Aloe Vera",
      benefits:      '["All-day moisture","Non-greasy","Heavenly fragrance","Softens skin"]',
      howToUse:      "Apply generously to body after shower on slightly damp skin. Massage until absorbed.",
      price:         49900,
      originalPrice: null,
      stock:         38,
      images:        ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=500"],
      badge:         null,
      categoryId:    bodyCare.id,
      isFeatured:    false,
      isTrending:    true,
    },
    {
      name:          "Ashwagandha Night Repair",
      slug:          "ashwagandha-night-repair",
      description:   "Overnight treatment serum with adaptogenic ashwagandha. Works while you sleep to reduce stress signs and restore youthful vitality.",
      ingredients:   "Ashwagandha Extract, Retinol Alternative (Bakuchiol), Peptides, Hyaluronic Acid",
      benefits:      '["Anti-aging","Overnight repair","Reduces stress lines","Restores radiance"]',
      howToUse:      "Apply 4-5 drops to face before bed. Do not rinse. Use nightly for best results.",
      price:         109900,
      originalPrice: 129900,
      stock:         7,
      images:        ["https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=500"],
      badge:         "New",
      categoryId:    faceCare.id,
      isFeatured:    true,
      isTrending:    true,
    },
  ]

  for (const product of productsData) {
    await db.product.upsert({
      where:  { slug: product.slug },
      create: product,
      update: product,
    })
  }
  console.log(`✅ ${productsData.length} products seeded`)

  // ── Coupons ──────────────────────────────────────────────
  const coupons = [
    { code: "HERBAL10",  type: "PERCENTAGE" as const, value: 10,   minOrderValue: 49900,  maxUses: 500, expiresAt: new Date("2025-12-31") },
    { code: "WELCOME15", type: "PERCENTAGE" as const, value: 15,   minOrderValue: 29900,  maxUses: 200, expiresAt: new Date("2025-08-31") },
    { code: "FLAT100",   type: "FIXED"      as const, value: 10000, minOrderValue: 99900, maxUses: 100, expiresAt: new Date("2025-09-30") },
    { code: "AYUR25",    type: "PERCENTAGE" as const, value: 25,   minOrderValue: 199900, maxUses: 30,  expiresAt: new Date("2025-07-31") },
  ]

  for (const coupon of coupons) {
    await db.coupon.upsert({
      where:  { code: coupon.code },
      create: coupon,
      update: { value: coupon.value, expiresAt: coupon.expiresAt },
    })
  }
  console.log(`✅ ${coupons.length} coupons seeded`)

  console.log("🌿 ShreejiAayur database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
