export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  badge?: string
  category: string
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Kumkumadi Radiance Serum',
    description:
      'A luxurious blend of 26 Ayurvedic herbs including saffron and sandalwood. This time-tested formula brightens skin, reduces dark spots, and gives you a natural golden glow. Perfect for achieving that bridal radiance every day.',
    price: 1299,
    originalPrice: 1599,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop',
    badge: 'Best Seller',
    category: 'Face Care',
  },
  {
    id: 2,
    name: 'Rose & Saffron Face Mist',
    description:
      'Refreshing hydration mist infused with pure rose water and precious saffron extracts. Perfect for on-the-go glow and setting makeup naturally. Helps balance skin pH and provides instant freshness.',
    price: 599,
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=500&auto=format&fit=crop',
    category: 'Skin Care',
  },
  {
    id: 3,
    name: 'Neem Purifying Cleanser',
    description:
      'Gentle yet effective cleanser powered by neem and tulsi. Removes impurities without stripping natural oils, leaving skin fresh and balanced. Ideal for oily and acne-prone skin.',
    price: 449,
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop',
    category: 'Face Care',
  },
  {
    id: 4,
    name: 'Ubtan Body Polish',
    description:
      'Traditional turmeric-based body scrub that exfoliates, brightens, and nourishes. Made with chickpea flour, turmeric, and rose petals. A complete body care ritual for glowing skin.',
    price: 799,
    originalPrice: 999,
    image:
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop',
    badge: 'New',
    category: 'Body Care',
  },
  {
    id: 5,
    name: 'Brahmi Hair Oil',
    description:
      'Strengthening hair oil with brahmi, bhringraj, and amla. Promotes healthy hair growth, reduces hair fall, and adds natural shine. Traditional recipe for lustrous Indian hair.',
    price: 699,
    image:
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500&auto=format&fit=crop',
    category: 'Hair Care',
  },
  {
    id: 6,
    name: 'Sandalwood Face Cream',
    description:
      'Rich moisturizing cream with pure sandalwood and almond oil. Deeply hydrates and soothes the skin while providing a luxurious fragrance. Perfect for dry to normal skin.',
    price: 899,
    image:
      'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?q=80&w=500&auto=format&fit=crop',
    badge: 'New',
    category: 'Skin Care',
  },
  {
    id: 7,
    name: 'Turmeric Glow Mask',
    description:
      'Traditional haldi mask enriched with besan and honey. Brightens complexion and gives you a natural wedding-ready glow. Use twice a week for best results.',
    price: 549,
    image:
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop',
    badge: 'New',
    category: 'Face Care',
  },
  {
    id: 8,
    name: 'Aloe Vera Gel',
    description:
      'Pure aloe vera gel with added vitamin E. Multi-purpose hydrator for face, body, and hair. Soothes sunburn and irritation instantly. A must-have for Indian summers.',
    price: 349,
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop',
    category: 'Body Care',
  },
  {
    id: 9,
    name: 'Amla Hair Mask',
    description:
      'Intensive hair treatment with amla, shikakai, and coconut milk. Strengthens roots, prevents premature greying, and adds bounce. Weekly treatment for healthy hair.',
    price: 649,
    image:
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500&auto=format&fit=crop',
    category: 'Hair Care',
  },
  {
    id: 10,
    name: 'Jasmine Body Lotion',
    description:
      'Lightweight body lotion infused with jasmine extract and shea butter. Non-greasy formula that absorbs quickly for all-day moisture. Heavenly fragrance that lasts.',
    price: 499,
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=500&auto=format&fit=crop',
    category: 'Body Care',
  },
  {
    id: 11,
    name: 'Vitamin C Brightening Serum',
    description:
      'Powerful antioxidant serum with vitamin C, hyaluronic acid, and orange extracts. Brightens skin, fades dark spots, and protects against pollution damage.',
    price: 999,
    originalPrice: 1199,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop',
    badge: 'Trending',
    category: 'Skin Care',
  },
  {
    id: 12,
    name: 'Coconut Frizz-Control Serum',
    description:
      'Lightweight hair serum with virgin coconut oil and argan oil. Controls frizz, adds shine, and protects hair from heat damage. Perfect for humid Indian weather.',
    price: 549,
    image:
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500&auto=format&fit=crop',
    category: 'Hair Care',
  },
  {
    id: 13,
    name: 'Chandan Glow Cream',
    description:
      'Lightweight moisturizer with pure sandalwood and manjistha. Evens skin tone while providing lasting hydration without heaviness.',
    price: 749,
    originalPrice: 899,
    image:
      'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?q=80&w=500&auto=format&fit=crop',
    badge: 'Trending',
    category: 'Skin Care',
  },
  {
    id: 14,
    name: 'Ashwagandha Night Repair',
    description:
      'Overnight treatment serum with adaptogenic ashwagandha. Works while you sleep to reduce stress signs and restore youthful vitality.',
    price: 1099,
    originalPrice: 1299,
    image:
      'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=500&auto=format&fit=crop',
    badge: 'New',
    category: 'Face Care',
  },
  {
    id: 15,
    name: 'Triphala Eye Elixir',
    description:
      'Gentle eye treatment with triphala and cucumber extracts. Reduces puffiness, dark circles, and fine lines around the delicate eye area.',
    price: 649,
    image:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=500&auto=format&fit=crop',
    category: 'Face Care',
  },
]

export const categories = [
  { name: 'Skin Care', slug: 'skin-care', count: 5 },
  { name: 'Hair Care', slug: 'hair-care', count: 4 },
  { name: 'Body Care', slug: 'body-care', count: 3 },
  { name: 'Face Care', slug: 'face-care', count: 5 },
]

export function getProductsByCategory(category: string): Product[] {
  const categoryMap: Record<string, string> = {
    'skin-care': 'Skin Care',
    'hair-care': 'Hair Care',
    'body-care': 'Body Care',
    'face-care': 'Face Care',
  }
  return products.filter((p) => p.category === categoryMap[category])
}

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(
    (p) =>
      p.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/&/g, 'and') === slug
  )
}
