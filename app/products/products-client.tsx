'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/mobile-nav'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { toggleWishlist } from '@/lib/actions/wishlist'
import { useWishlistStore } from '@/store/wishlist-store'
import { formatPrice } from '@/lib/utils'
import type { ProductWithCategory } from '@/types'
import { Heart, SlidersHorizontal, X, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
}

interface Props {
  products: ProductWithCategory[]
  categories: Category[]
  initialCategory?: string
  initialSearch?: string
  initialSort?: string
}

export default function ProductsClient({ products, categories, initialCategory, initialSearch, initialSort }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null)
  const [sortBy, setSortBy] = useState(initialSort || 'featured')
  const [searchQuery, setSearchQuery] = useState(initialSearch || '')
  const [togglingWishlist, setTogglingWishlist] = useState<string | null>(null)
  
  const { isWishlisted, toggle: toggleWishlistStore } = useWishlistStore()

  const filteredProducts = useMemo(() => {
    let base = products

    if (selectedCategory) {
      base = base.filter((p) => p.category.slug === selectedCategory)
    }

    if (searchQuery) {
      base = base.filter((p) => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return [...base].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })
  }, [products, selectedCategory, searchQuery, sortBy])

  const handleToggleWishlist = async (productId: string) => {
    try {
      setTogglingWishlist(productId)
      const result = await toggleWishlist(productId)
      
      if (result.success) {
        toggleWishlistStore(productId)
        toast.success(result.data!.wishlisted ? 'Added to wishlist' : 'Removed from wishlist')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
      toast.error('Failed to update wishlist')
    } finally {
      setTogglingWishlist(null)
    }
  }

  const updateURL = (category?: string | null, search?: string, sort?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    
    if (sort) {
      params.set('sort', sort)
    } else {
      params.delete('sort')
    }
    
    router.push(`/products?${params.toString()}`)
  }

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
    updateURL(category, searchQuery, sortBy)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    updateURL(selectedCategory, value, sortBy)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateURL(selectedCategory, searchQuery, value)
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
                onClick={() => handleCategoryChange(null)}
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
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
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
                      onClick={() => handleCategoryChange(null)}
                      className={`flex items-center justify-between py-3 border-b border-border text-sm ${
                        !selectedCategory ? 'text-primary font-medium' : 'text-foreground'
                      }`}
                    >
                      All Products
                      {!selectedCategory && <span className="text-primary">✓</span>}
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.slug)}
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

              {/* Search Input */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="h-9 px-3 text-sm border border-border rounded-full bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                onClick={() => handleCategoryChange(null)}
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
                onClick={() => {
                  handleCategoryChange(null)
                  handleSearchChange('')
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickView={() => {}}
                  isWishlisted={isWishlisted(product.id)}
                  onToggleWishlist={() => handleToggleWishlist(product.id)}
                  togglingWishlist={togglingWishlist === product.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <MobileNav />
    </main>
  )
}
