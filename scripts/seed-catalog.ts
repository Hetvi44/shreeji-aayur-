import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const db = new PrismaClient()

const photoMap: Record<string, string[]> = {
  'kumkumadi-radiance-serum': ['Serum_1.jpg', 'Serum_2.jpg'],
  'brahmi-hair-oil': ['hair color.jpg'],
  'aloe-vera-gel': ['lotion.jpg', 'lotion_1.jpg', 'lotion_2.jpg'],
  'ubtan-body-polish': ['Scrub.jpg', 'scrub_1.jpg'],
  'neem-purifying-cleanser': ['cleanser.jpg', 'facecleanser.jpg'],
}

const productCatalog = [
  {
    name: 'Kumkumadi Radiance Serum',
    slug: 'kumkumadi-radiance-serum',
    category: 'Face Care',
    description:
      'A luxurious ayurvedic face serum infused with saffron, sandalwood and natural oils for a bright, healthy glow.',
    price: 1499,
    originalPrice: 1999,
    stock: 42,
    badge: 'Best Seller',
    isFeatured: true,
    isTrending: true,
    ingredients: 'Kumkumadi, Saffron, Sandalwood, Rose, Almond oil',
    benefits: 'Brightens skin tone, reduces dullness, improves radiance',
    howToUse: 'Apply 3-4 drops on cleansed face and neck every morning and night.',
  },
  {
    name: 'Brahmi Hair Oil',
    slug: 'brahmi-hair-oil',
    category: 'Hair Care',
    description:
      'A nourishing herbal hair oil enriched with Brahmi and medicinal herbs to support stronger, shinier hair.',
    price: 899,
    originalPrice: 1199,
    stock: 55,
    badge: 'Popular',
    isFeatured: true,
    isTrending: false,
    ingredients: 'Brahmi, Coconut oil, Amla, Sesame oil',
    benefits: 'Reduces hair fall, strengthens roots, adds shine',
    howToUse: 'Massage into scalp and lengths 2-3 times a week for best results.',
  },
  {
    name: 'Aloe Vera Gel',
    slug: 'aloe-vera-gel',
    category: 'Body Care',
    description:
      'Cooling aloe vera gel for smooth, hydrated skin with a fresh, calming touch after every wash.',
    price: 699,
    originalPrice: 999,
    stock: 80,
    badge: 'Cooling',
    isFeatured: false,
    isTrending: true,
    ingredients: 'Aloe vera, Cucumber, Mint, Vitamin E',
    benefits: 'Hydrates deeply, calms irritation, refreshes skin',
    howToUse: 'Apply generously on damp skin after bath or as needed.',
  },
  {
    name: 'Ubtan Body Polish',
    slug: 'ubtan-body-polish',
    category: 'Body Care',
    description:
      'A gentle Ayurvedic body scrub that exfoliates dead skin and leaves your skin soft, polished and radiant.',
    price: 799,
    originalPrice: 1099,
    stock: 48,
    badge: 'Exfoliating',
    isFeatured: false,
    isTrending: false,
    ingredients: 'Turmeric, Chickpea flour, Sandalwood, Rose petals',
    benefits: 'Exfoliates, smooths skin texture, brightens tone',
    howToUse: 'Massage on wet skin in circular motions and rinse off.',
  },
  {
    name: 'Neem Purifying Cleanser',
    slug: 'neem-purifying-cleanser',
    category: 'Face Care',
    description:
      'A deep-cleansing Ayurvedic face wash that purifies skin and helps reduce excess oil and breakouts.',
    price: 649,
    originalPrice: 899,
    stock: 61,
    badge: 'New',
    isFeatured: true,
    isTrending: false,
    ingredients: 'Neem, Tulsi, Tea tree, Aloe vera',
    benefits: 'Cleanses gently, purifies pores, controls excess oil',
    howToUse: 'Use twice daily on damp skin, massage gently, and rinse well.',
  },
]

const toImageUrl = (name: string) => encodeURI(`/uploads/products/${name}`)

const actualPhotos = fs
  .readdirSync(path.join(process.cwd(), 'public', 'uploads', 'products'))
  .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
  .map((file) => toImageUrl(file))

async function main() {
  for (const item of productCatalog) {
    const category = await db.category.upsert({
      where: { slug: item.category.toLowerCase().replace(/\s+/g, '-') },
      update: { name: item.category, isActive: true },
      create: {
        name: item.category,
        slug: item.category.toLowerCase().replace(/\s+/g, '-'),
        description: `${item.category} essentials from ShreejiAayur.`,
        image: photoMap[item.slug]?.[0] ? toImageUrl(photoMap[item.slug][0]) : actualPhotos[0] || '/placeholder-image.jpg',
        sortOrder: 0,
      },
    })

    const mappedImages = (photoMap[item.slug] || actualPhotos.slice(0, 3)).map((name) => toImageUrl(name))

    await db.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        categoryId: category.id,
        price: item.price * 100,
        originalPrice: item.originalPrice ? item.originalPrice * 100 : null,
        stock: item.stock,
        images: mappedImages,
        badge: item.badge,
        isFeatured: item.isFeatured,
        isTrending: item.isTrending,
        ingredients: item.ingredients,
        benefits: item.benefits,
        howToUse: item.howToUse,
        isActive: true,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        categoryId: category.id,
        price: item.price * 100,
        originalPrice: item.originalPrice ? item.originalPrice * 100 : null,
        stock: item.stock,
        images: mappedImages,
        badge: item.badge,
        isFeatured: item.isFeatured,
        isTrending: item.isTrending,
        ingredients: item.ingredients,
        benefits: item.benefits,
        howToUse: item.howToUse,
        isActive: true,
      },
    })

    console.log(`✅ ${item.name} -> ${mappedImages.join(', ')}`)
  }

  console.log('Catalog ready')
}

main()
  .catch((error) => {
    console.error('Seed catalog error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
