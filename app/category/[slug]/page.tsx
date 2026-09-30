"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/actions/products"
import { getCategoryBySlug } from "@/lib/actions/categories"
import { toggleWishlist } from "@/lib/actions/wishlist"
import { useWishlistStore } from "@/store/wishlist-store"
import { Heart, Plus, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { formatPrice } from "@/lib/utils"
import type { ProductWithCategory, Category } from "@/types"

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [togglingWishlist, setTogglingWishlist] = useState<string | null>(null)

  const { isWishlisted, toggle: toggleWishlistStore } = useWishlistStore()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const resolvedParams = await params
      const currentSlug = resolvedParams.slug

      const [categoryData, productsData] = await Promise.all([
        getCategoryBySlug(currentSlug),
        getProducts({ category: currentSlug, limit: 100 }),
      ])

      if (!categoryData || !categoryData.isActive) {
        setNotFoundState(true)
        return
      }

      setCategory(categoryData)
      setProducts(productsData)
    } catch (error) {
      console.error("Failed to load category data:", error)
      setNotFoundState(true)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleWishlist = async (productId: string) => {
    try {
      setTogglingWishlist(productId)
      const result = await toggleWishlist(productId)

      if (result.success) {
        toggleWishlistStore(productId)
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error)
    } finally {
      setTogglingWishlist(null)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen pb-20 md:pb-0">
        <Header />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    )
  }

  if (notFoundState || !category) {
    notFound()
  }

  const cat = category as Category

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    return 0
  })

  const heroImage = cat.image

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <Header />

      <section className="relative h-64 md:h-80 overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={cat.name}
            fill
            className="object-cover"
            priority
            unoptimized={heroImage.startsWith("http")}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-[#5c8a4e] to-[#0c0f0b]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <nav className="flex items-center gap-2 text-sm text-background/70 mb-4">
                <Link href="/" className="hover:text-background">
                  Home
                </Link>
                <span>/</span>
                <Link href="/products" className="hover:text-background">
                  Products
                </Link>
                <span>/</span>
                <span className="text-background">{cat.name}</span>
              </nav>
              <h1 className="text-3xl md:text-5xl font-light font-serif text-background mb-4">
                {cat.name}
              </h1>
              {cat.description && (
                <p className="text-background/80 max-w-xl hidden md:block">
                  {cat.description}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              {sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""}
            </p>
            {sortedProducts.length > 0 && (
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
            )}
          </div>

          {sortedProducts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground text-lg mb-4">
                No products in this category yet.
              </p>
              <Button asChild className="rounded-full">
                <Link href="/products">Browse all products</Link>
              </Button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
            >
              {sortedProducts.map((product) => {
                const img = product.images[0] || "/placeholder-image.jpg"
                return (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative aspect-square overflow-hidden bg-secondary/50">
                        <Image
                          src={img}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized={img.startsWith("http")}
                        />
                        {product.badge && (
                          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium tracking-wide bg-primary text-primary-foreground rounded-full">
                            {product.badge}
                          </span>
                        )}
                      </div>
                    </Link>

                    <button
                      onClick={() => handleToggleWishlist(product.id)}
                      disabled={togglingWishlist === product.id}
                      className="absolute top-3 right-3 p-2.5 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors shadow-sm z-10 disabled:opacity-50"
                    >
                      {togglingWishlist === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart
                          className={`h-4 w-4 transition-colors ${
                            isWishlisted(product.id)
                              ? "fill-destructive text-destructive"
                              : "text-muted-foreground"
                          }`}
                        />
                      )}
                    </button>

                    <div className="p-4">
                      <span className="text-xs tracking-wider uppercase text-muted-foreground">
                        {product.category.name}
                      </span>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-base font-medium mt-1 mb-3 line-clamp-1 font-serif hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <Button size="icon" className="h-9 w-9 rounded-full" asChild>
                          <Link href={`/products/${product.slug}`}>
                            <Plus className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
      <MobileNav />
    </main>
  )
}
