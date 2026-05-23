"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCarousel, ProductQuickView, type Product } from "./product-card"
import { motion } from "framer-motion"

const bestSellers: Product[] = [
  {
    id: 1,
    name: "Kumkumadi Radiance Serum",
    description: "A luxurious blend of 26 Ayurvedic herbs including saffron and sandalwood. This time-tested formula brightens skin, reduces dark spots, and gives you a natural golden glow.",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop",
    badge: "Best Seller",
    category: "Face Care",
  },
  {
    id: 2,
    name: "Rose & Saffron Face Mist",
    description: "Refreshing hydration mist infused with pure rose water and precious saffron extracts. Perfect for on-the-go glow and setting makeup naturally.",
    price: 599,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=500&auto=format&fit=crop",
    category: "Skin Care",
  },
  {
    id: 3,
    name: "Neem Purifying Cleanser",
    description: "Gentle yet effective cleanser powered by neem and tulsi. Removes impurities without stripping natural oils, leaving skin fresh and balanced.",
    price: 449,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop",
    category: "Face Care",
  },
  {
    id: 4,
    name: "Ubtan Body Polish",
    description: "Traditional turmeric-based body scrub that exfoliates, brightens, and nourishes. Made with chickpea flour, turmeric, and rose petals.",
    price: 799,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop",
    badge: "New",
    category: "Body Care",
  },
  {
    id: 5,
    name: "Brahmi Hair Oil",
    description: "Strengthening hair oil with brahmi, bhringraj, and amla. Promotes healthy hair growth, reduces hair fall, and adds natural shine.",
    price: 699,
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500&auto=format&fit=crop",
    category: "Hair Care",
  },
]

export function BestSellersSection() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  return (
    <section id="bestsellers" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-3 block">
              Customer Favorites
            </span>
            <h2 className="text-3xl md:text-4xl font-light font-serif">Best Sellers</h2>
          </div>
          <div className="hidden md:flex items-center gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        <ProductCarousel products={bestSellers} onQuickView={setQuickViewProduct} />

        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </section>
  )
}
