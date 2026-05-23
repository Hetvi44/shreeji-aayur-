"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ComboOffersBanner() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          className="relative overflow-hidden rounded-3xl bg-accent/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="p-8 md:p-12 lg:p-16">
              <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase bg-accent text-accent-foreground rounded-full mb-4">
                Limited Time Offer
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-serif mb-4 text-balance">
                Complete Skincare Combo
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                Get our bestselling Face Serum, Cleanser & Moisturizer combo at 30% off. 
                Everything you need for a complete skincare routine.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-semibold text-primary">₹1,999</span>
                <span className="text-xl text-muted-foreground line-through">₹2,847</span>
                <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
                  Save ₹848
                </span>
              </div>
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/products?combo=true">
                  Shop Combo Offers
                </Link>
              </Button>
            </div>

            {/* Image */}
            <div className="relative h-64 md:h-full md:min-h-[400px]">
              <Image
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop"
                alt="Skincare combo products"
                fill
                className="object-cover md:rounded-r-3xl"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
