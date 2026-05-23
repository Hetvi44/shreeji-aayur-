"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCarousel, ProductQuickView, type Product } from "./product-card"

const trendingProducts: Product[] = [
  {
    id: 6,
    name: "Chandan Glow Cream",
    description: "Lightweight moisturizer with pure sandalwood and manjistha. Evens skin tone while providing lasting hydration without heaviness.",
    price: 42,
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?q=80&w=500&auto=format&fit=crop",
    rating: 4.7,
    reviews: 98,
    badge: "Trending",
    category: "Moisturizer",
  },
  {
    id: 7,
    name: "Ashwagandha Night Repair",
    description: "Overnight treatment serum with adaptogenic ashwagandha. Works while you sleep to reduce stress signs and restore youthful vitality.",
    price: 55,
    originalPrice: 68,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=500&auto=format&fit=crop",
    rating: 4.8,
    reviews: 134,
    category: "Night Care",
  },
  {
    id: 8,
    name: "Triphala Eye Elixir",
    description: "Gentle eye treatment with triphala and cucumber extracts. Reduces puffiness, dark circles, and fine lines around the delicate eye area.",
    price: 38,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=500&auto=format&fit=crop",
    rating: 4.6,
    reviews: 87,
    category: "Eye Care",
  },
  {
    id: 9,
    name: "Jasmine Body Butter",
    description: "Rich body butter with jasmine, shea, and coconut. Deeply moisturizes dry skin while leaving a subtle, intoxicating floral scent.",
    price: 36,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=500&auto=format&fit=crop",
    rating: 4.9,
    reviews: 156,
    badge: "Limited",
    category: "Body Care",
  },
  {
    id: 10,
    name: "Tulsi Clarifying Toner",
    description: "Balancing toner with holy basil and witch hazel. Refines pores, controls excess oil, and preps skin for maximum serum absorption.",
    price: 26,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&auto=format&fit=crop",
    rating: 4.7,
    reviews: 112,
    category: "Toner",
  },
]

export function TrendingSection() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-3 block">
              What&apos;s Hot
            </span>
            <h2 className="text-3xl md:text-4xl font-light">Trending Now</h2>
          </div>
          <div className="hidden md:flex items-center gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <ChevronRight className="h-5 w-5" />
            </Button>
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
