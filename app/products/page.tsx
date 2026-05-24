'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/mobile-nav'
import { Button } from '@/components/ui/button'
import { products, categories } from '@/lib/products'
import type { Product } from '@/lib/products'
import { ProductQuickView } from '@/components/product-card'
import { Heart, Plus, SlidersHorizontal, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('featured')
  const [wishlist, setWishlist] = useState<number[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const filteredProducts = useMemo(() => {
    const base = selectedCategory
      ? products.filter(
          (p) => p.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
        )
      : products

    return [...base].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })
  }, [selectedCategory, sortBy])

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <Header />

      {/* Page Header */}
      <section className="bg-secondary/30 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light font-serif mb-4">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name ?? 'All Products'
              : 'All Products'}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our complete collection of Ayurvedic skincare products, handcrafted with
            love using 100% natural ingredients.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Category Pills — Desktop */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Mobile Filter + Sort */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Mobile Category Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden rounded-full gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                    {selectedCategory && (
                      <span className="ml-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                        1
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-2xl">
                  <SheetTitle className="font-serif text-xl mb-6">Filter by Category</SheetTitle>
                  <div className="flex flex-col gap-3 pb-8">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`flex items-center justify-between py-3 border-b border-border text-sm ${
                        !selectedCategory ? 'text-primary font-medium' : 'text-foreground'
                      }`}
                    >
                      All Products
                      {!selectedCategory && <span className="text-primary">✓</span>}
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`flex items-center justify-between py-3 border-b border-border text-sm ${
                          selectedCategory === category.slug
                            ? 'text-primary font-medium'
                            : 'text-foreground'
                        }`}
                      >
                        {category.name}
                        {selectedCategory === category.slug && (
                          <span className="text-primary">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 text-sm border border-border rounded-full bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 ml-auto"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>

          {/* Active filter badge */}
          {selectedCategory && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Active filter:</span>
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {categories.find((c) => c.slug === selectedCategory)?.name}
                <X className="h-3 w-3 ml-1" />
              </button>
            </div>
          )}

          {/* Product Count */}
          <p className="text-sm text-muted-foreground mb-6">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-muted-foreground text-lg">No products found.</p>
              <Button
                variant="outline"
                className="mt-4 rounded-full"
                onClick={() => setSelectedCategory(null)}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden bg-secondary/50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </Link>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors shadow-sm z-10"
                    aria-label={
                      wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'
                    }
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        wishlist.includes(product.id)
                          ? 'fill-destructive text-destructive'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>

                  <div className="p-4">
                    <span className="text-xs tracking-wider uppercase text-muted-foreground">
                      {product.category}
                    </span>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-sm md:text-base font-medium mt-1 mb-2 line-clamp-1 font-serif hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base md:text-lg font-semibold">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs md:text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <Button
                        size="icon"
                        className="h-8 w-8 md:h-9 md:w-9 rounded-full"
                        onClick={() => setQuickViewProduct(product)}
                      >
                        <Plus className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductQuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <Footer />
      <MobileNav />
    </main>
  )
}
