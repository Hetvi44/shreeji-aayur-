"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCarousel, ProductQuickView, type Product } from "./product-card"
import { motion } from "framer-motion"

const newArrivals: Product[] = [
  {
    id: 6,
    name: "Sandalwood Face Cream",
    description: "Rich moisturizing cream with pure sandalwood and almond oil. Deeply hydrates and soothes the skin while providing a luxurious fragrance.",
    price: 899,
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?q=80&w=500&auto=format&fit=crop",
    badge: "New",
    category: "Skin Care",
  },
  {
    id: 7,
    name: "Turmeric Glow Mask",
    description: "Traditional haldi mask enriched with besan and honey. Brightens complexion and gives you a natural wedding-ready glow.",
    price: 549,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop",
    badge: "New",
    category: "Face Care",
  },
  {
    id: 8,
    name: "Aloe Vera Gel",
    description: "Pure aloe vera gel with added vitamin E. Multi-purpose hydrator for face, body, and hair. Soothes sunburn and irritation instantly.",
    price: 349,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop",
    badge: "New",
    category: "Body Care",
  },
  {
    id: 9,
    name: "Amla Hair Mask",
    description: "Intensive hair treatment with amla, shikakai, and coconut milk. Strengthens roots, prevents premature greying, and adds bounce.",
    price: 649,
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500&auto=format&fit=crop",
    badge: "New",
    category: "Hair Care",
  },
  {
    id: 10,
    name: "Jasmine Body Lotion",
    description: "Lightweight body lotion infused with jasmine extract and shea butter. Non-greasy formula that absorbs quickly for all-day moisture.",
    price: 499,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=500&auto=format&fit=crop",
    badge: "New",
    category: "Body Care",
  },
]

export function NewArrivalsSection() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
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
              Just Launched
            </span>
            <h2 className="text-3xl md:text-4xl font-light font-serif">New Arrivals</h2>
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

        <ProductCarousel products={newArrivals} onQuickView={setQuickViewProduct} />

        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </section>
  )
}
