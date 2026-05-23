"use client"

import { useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { getProductsByCategory, categories } from "@/lib/products"
import { Heart, Plus } from "lucide-react"
import { motion } from "framer-motion"

const categoryImages: Record<string, string> = {
  "skin-care": "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1200&auto=format&fit=crop",
  "hair-care": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1200&auto=format&fit=crop",
  "body-care": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=1200&auto=format&fit=crop",
  "face-care": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop",
}

const categoryDescriptions: Record<string, string> = {
  "skin-care": "Nourish and protect your skin with our range of Ayurvedic skincare products. From serums to moisturizers, find everything you need for healthy, glowing skin.",
  "hair-care": "Transform your hair with ancient Ayurvedic formulations. Our hair care range strengthens, nourishes, and promotes natural shine and growth.",
  "body-care": "Pamper your body with our luxurious body care collection. From scrubs to lotions, experience the best of Ayurvedic body care.",
  "face-care": "Achieve radiant, clear skin with our face care range. Cleansers, masks, and treatments designed specifically for Indian skin.",
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const category = categories.find(c => c.slug === resolvedParams.slug)
  const products = getProductsByCategory(resolvedParams.slug)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("featured")

  if (!category || products.length === 0) {
    notFound()
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    return 0
  })

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={categoryImages[resolvedParams.slug] || categoryImages["skin-care"]}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <nav className="flex items-center gap-2 text-sm text-background/70 mb-4">
                <Link href="/" className="hover:text-background">Home</Link>
                <span>/</span>
                <Link href="/products" className="hover:text-background">Products</Link>
                <span>/</span>
                <span className="text-background">{category.name}</span>
              </nav>
              <h1 className="text-3xl md:text-5xl font-light font-serif text-background mb-4">
                {category.name}
              </h1>
              <p className="text-background/80 max-w-xl hidden md:block">
                {categoryDescriptions[resolvedParams.slug]}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">{sortedProducts.length} products</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-secondary rounded-full px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
          >
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-secondary/50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium tracking-wide bg-primary text-primary-foreground rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </Link>
                
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors shadow-sm z-10"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      wishlist.includes(product.id) ? "fill-destructive text-destructive" : "text-muted-foreground"
                    }`}
                  />
                </button>

                <div className="p-4">
                  <span className="text-xs tracking-wider uppercase text-muted-foreground">
                    {product.category}
                  </span>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-base font-medium mt-1 mb-3 line-clamp-1 font-serif hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <Button size="icon" className="h-9 w-9 rounded-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
      <MobileNav />
    </main>
  )
}
