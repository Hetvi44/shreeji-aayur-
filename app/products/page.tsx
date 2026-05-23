"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { products, categories } from "@/lib/products"
import { Heart, Plus, SlidersHorizontal, X } from "lucide-react"
import { motion } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("featured")
  const [wishlist, setWishlist] = useState<number[]>([])

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory)
    : products

  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
      
      {/* Page Header */}
      <section className="bg-secondary/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light font-serif mb-4">
              {selectedCategory 
                ? categories.find(c => c.slug === selectedCategory)?.name || "All Products"
                : "All Products"
              }
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our complete collection of Ayurvedic skincare products, handcrafted with love using 100% natural ingredients.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Category Pills - Desktop */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" className="rounded-full">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[60vh] rounded-t-3xl">
                <SheetTitle className="text-lg font-medium font-serif mb-4">Filter Products</SheetTitle>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Category</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          !selectedCategory 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        All
                      </button>
                      {categories.map(category => (
                        <button
                          key={category.slug}
                          onClick={() => setSelectedCategory(category.slug)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === category.slug 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Sort By</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "featured", label: "Featured" },
                        { value: "price-low", label: "Price: Low to High" },
                        { value: "price-high", label: "Price: High to Low" },
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            sortBy === option.value 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
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

            {/* Results Count */}
            <p className="text-sm text-muted-foreground w-full md:w-auto">
              {sortedProducts.length} products
            </p>
          </div>

          {/* Active Filters */}
          {selectedCategory && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Filters:</span>
              <button
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
              >
                {categories.find(c => c.slug === selectedCategory)?.name}
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

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
