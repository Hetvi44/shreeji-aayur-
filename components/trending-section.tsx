'use client'

import { useState } from 'react'
import { ProductCarousel, ProductQuickView } from './product-card'
import type { Product } from '@/lib/products'

const trendingProducts: Product[] = [
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
  {
    id: 4,
    name: 'Ubtan Body Polish',
    description:
      'Traditional turmeric-based body scrub that exfoliates, brightens, and nourishes. Made with chickpea flour, turmeric, and rose petals.',
    price: 799,
    originalPrice: 999,
    image:
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop',
    badge: 'Trending',
    category: 'Body Care',
  },
  {
    id: 10,
    name: 'Jasmine Body Lotion',
    description:
      'Lightweight body lotion infused with jasmine extract and shea butter. Non-greasy formula that absorbs quickly for all-day moisture.',
    price: 499,
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=500&auto=format&fit=crop',
    badge: 'Trending',
    category: 'Body Care',
  },
]

export function TrendingSection() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-3 block">
              What&apos;s Hot
            </span>
            <h2 className="text-3xl md:text-4xl font-light font-serif">Trending Now</h2>
          </div>
        </div>

        <ProductCarousel products={trendingProducts} onQuickView={setQuickViewProduct} />

        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </section>
  )
}
