'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Plus, X, Minus, ShoppingBag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import type { ProductWithCategory } from '@/types'

interface ProductCardProps {
  product: ProductWithCategory
  onQuickView?: (product: ProductWithCategory) => void
  isWishlisted?: boolean
  onToggleWishlist?: () => void
  togglingWishlist?: boolean
}

export function ProductCard({ product, onQuickView, isWishlisted = false, onToggleWishlist, togglingWishlist = false }: ProductCardProps) {
  const discount =
    product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null

  return (
    <motion.div
      className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.images[0] || '/placeholder-image.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium tracking-wide bg-primary text-primary-foreground rounded-full z-10">
            {product.badge}
          </span>
        )}

        {/* Discount badge */}
        {discount && (
          <span className="absolute top-3 right-10 px-2 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded-full z-10">
            -{discount}%
          </span>
        )}

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            onClick={onToggleWishlist}
            disabled={togglingWishlist}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors shadow-sm z-10 disabled:opacity-50"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {togglingWishlist ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isWishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                }`}
              />
            )}
          </button>
        )}

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 left-3 right-3 py-2.5 text-sm font-medium tracking-wide bg-card/95 backdrop-blur-sm text-foreground rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm z-10"
          >
            Quick View
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <span className="text-xs tracking-wider uppercase text-muted-foreground">
          {product.category.name}
        </span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-base font-medium mt-1 mb-3 line-clamp-1 font-serif hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price & Add to Cart */}
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
          <Button size="icon" className="h-9 w-9 rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

interface ProductQuickViewProps {
  product: ProductWithCategory | null
  isOpen: boolean
  onClose: () => void
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl">
        <DialogTitle className="sr-only">{product.name} - Quick View</DialogTitle>
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-secondary/50">
            <Image
              src={product.images[0] || '/placeholder-image.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium tracking-wide bg-primary text-primary-foreground rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-6 md:p-8 flex flex-col">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Close quick view"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="text-sm tracking-wider uppercase text-primary mb-2">
              {product.category.name}
            </span>
            <h2 className="text-2xl md:text-3xl font-medium mb-4 font-serif">
              {product.name}
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-semibold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mt-auto">
              <div className="flex items-center border border-border rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-secondary rounded-l-full transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-secondary rounded-r-full transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button className="flex-1 rounded-full py-6 text-base font-medium tracking-wide">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ProductCarouselProps {
  products: ProductWithCategory[]
  onQuickView?: (product: ProductWithCategory) => void
}

export function ProductCarousel({ products, onQuickView }: ProductCarouselProps) {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  })

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4 md:gap-6">
        {products.map((product) => (
          <div key={product.id} className="flex-none w-[240px] md:w-[280px]">
            <ProductCard product={product} onQuickView={onQuickView} />
          </div>
        ))}
      </div>
    </div>
  )
}
