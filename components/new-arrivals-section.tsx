"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCarousel, ProductQuickView } from "./product-card"
import { motion } from "framer-motion"
import type { ProductWithCategory } from "@/types"

interface NewArrivalsSectionProps {
  products: ProductWithCategory[]
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductWithCategory | null>(null)

  if (!products.length) return null

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
