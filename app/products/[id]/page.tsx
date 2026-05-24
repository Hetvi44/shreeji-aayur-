'use client'

import { useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/mobile-nav'
import { Button } from '@/components/ui/button'
import { products } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import type { Product } from '@/lib/products'
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Shield,
  Leaf,
  ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const productId = parseInt(resolvedParams.id, 10)
  const product = products.find((p) => p.id === productId)

  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [quickViewProduct] = useState<Product | null>(null)

  if (!product) {
    notFound()
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const productImages = [
    product.image,
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop',
  ]

  const faqs = [
    {
      question: 'How to use this product?',
      answer:
        'Apply a small amount to clean, damp skin. Gently massage in circular motions until absorbed. Use morning and night for best results.',
    },
    {
      question: 'Suitable for sensitive skin?',
      answer:
        'Yes, all our products are formulated with natural ingredients gentle enough for sensitive skin. We recommend doing a patch test first.',
    },
    {
      question: 'What are the key benefits?',
      answer:
        'This product nourishes, hydrates, and protects your skin while promoting a natural, healthy glow. Made with 100% Ayurvedic ingredients.',
    },
  ]

  const scrollPrev = () => {
    emblaApi?.scrollPrev()
    setCurrentSlide((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))
  }

  const scrollNext = () => {
    emblaApi?.scrollNext()
    setCurrentSlide((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <main className="min-h-screen pb-32 md:pb-0">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </nav>
      </div>

      <section className="container mx-auto px-4 py-6 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl aspect-square" ref={emblaRef}>
              <div className="flex">
                {productImages.map((img, idx) => (
                  <div key={idx} className="flex-none w-full relative aspect-square">
                    <Image
                      src={img}
                      alt={`${product.name} - view ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={idx === 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-card transition-colors"
              aria-label="Previous image"
            >
              <span className="text-lg">‹</span>
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-card transition-colors"
              aria-label="Next image"
            >
              <span className="text-lg">›</span>
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {productImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    emblaApi?.scrollTo(idx)
                    setCurrentSlide(idx)
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'w-8 bg-primary' : 'w-2 bg-border'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {product.badge && (
              <span className="inline-block w-fit px-3 py-1 text-xs font-medium tracking-wide bg-primary text-primary-foreground rounded-full mb-4">
                {product.badge}
              </span>
            )}

            <span className="text-sm tracking-wider uppercase text-primary mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-medium font-serif mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl md:text-4xl font-semibold">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  {discount && (
                    <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
                      {discount}% off
                    </span>
                  )}
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 mb-8 py-6 border-y border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4 text-primary" />
                Free shipping above ₹999
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                30-day guarantee
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="h-4 w-4 text-primary" />
                100% Natural
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-6 mb-6">
              <span className="text-sm font-medium">Quantity</span>
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
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 rounded-full text-base font-medium tracking-wide"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-4"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    isWishlisted ? 'fill-destructive text-destructive' : ''
                  }`}
                />
              </Button>
            </div>

            {/* Buy Now CTA */}
            <Link href="/checkout" className="mt-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full text-base font-medium border-foreground/20"
              >
                Buy Now
              </Button>
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 md:mt-24 max-w-2xl mx-auto">
          <h2 className="text-2xl font-medium font-serif mb-6">Product FAQs</h2>
          <div className="divide-y divide-border">
            {faqs.map((faq, index) => (
              <div key={index} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 md:mt-24">
            <h2 className="text-2xl md:text-3xl font-light font-serif mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={() => {}} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border md:hidden z-40">
        <Button size="lg" className="w-full rounded-full text-base font-medium">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Add to Cart — ₹{product.price.toLocaleString('en-IN')}
        </Button>
      </div>

      <Footer />
      <MobileNav />
    </main>
  )
}
