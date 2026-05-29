'use client'

import { useState } from 'react'
import { ProductCarousel, ProductQuickView } from './product-card'
import type { ProductWithCategory } from '@/types'

interface TrendingSectionProps {
  products: ProductWithCategory[]
}

export function TrendingSection({ products }: TrendingSectionProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductWithCategory | null>(null)

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

        <ProductCarousel products={products} onQuickView={setQuickViewProduct} />

        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </section>
  )
}
