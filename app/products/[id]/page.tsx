"use client"

import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/products"
import { Heart, Minus, Plus, ShoppingBag, Truck, Shield, Leaf, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const productId = parseInt(resolvedParams.id)
  const product = products.find(p => p.id === productId)
  
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [currentSlide, setCurrentSlide] = useState(0)

  if (!product) {
    notFound()
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop",
  ]

  const faqs = [
    {
      question: "How to use this product?",
      answer: "Apply a small amount to clean, damp skin. Gently massage in circular motions until absorbed. Use morning and night for best results.",
    },
    {
      question: "Suitable for sensitive skin?",
      answer: "Yes, all our products are formulated with natural ingredients and are gentle enough for sensitive skin. We recommend doing a patch test first.",
    },
    {
      question: "What are the key benefits?",
      answer: "This product helps nourish, hydrate, and protect your skin while promoting a natural, healthy glow. Made with 100% Ayurvedic ingredients.",
    },
  ]

  const scrollPrev = () => {
    emblaApi?.scrollPrev()
    setCurrentSlide(prev => (prev === 0 ? productImages.length - 1 : prev - 1))
  }

  const scrollNext = () => {
    emblaApi?.scrollNext()
    setCurrentSlide(prev => (prev === productImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <main className="min-h-screen pb-32 md:pb-0">
      <Header />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <section className="py-4 md:py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl" ref={emblaRef}>
                <div className="flex">
                  {productImages.map((img, index) => (
                    <div key={index} className="flex-none w-full aspect-square relative bg-secondary/50">
                      <Image
                        src={img}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>
                {product.badge && (
                  <span className="absolute top-4 left-4 px-4 py-1.5 text-sm font-medium tracking-wide bg-primary text-primary-foreground rounded-full z-10">
                    {product.badge}
                  </span>
                )}
                {/* Navigation Arrows */}
                <button
                  onClick={scrollPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors z-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={scrollNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors z-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              {/* Thumbnails */}
              <div className="flex gap-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      emblaApi?.scrollTo(index)
                      setCurrentSlide(index)
                    }}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all ${
                      currentSlide === index ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:py-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-sm tracking-wider uppercase text-primary mb-2 block">
                  {product.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-light font-serif mb-4">{product.name}</h1>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-semibold">₹{product.price.toLocaleString('en-IN')}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Quantity & Add to Cart */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                  <div className="flex items-center border border-border rounded-full">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-4 hover:bg-secondary rounded-l-full transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-16 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-4 hover:bg-secondary rounded-r-full transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <Button className="flex-1 rounded-full py-6 text-base font-medium tracking-wide">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to Cart - ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="h-14 w-14 rounded-full shrink-0"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-destructive text-destructive" : ""}`} />
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border mb-8">
                  <div className="text-center">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground">Free Shipping<br />Above ₹999</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground">100% Authentic<br />Products</p>
                  </div>
                  <div className="text-center">
                    <Leaf className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground">100% Natural<br />Ingredients</p>
                  </div>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-0">
                  <h3 className="font-medium font-serif mb-4">Product Information</h3>
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-border">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full py-4 flex items-center justify-between text-left"
                      >
                        <span className="font-medium">{faq.question}</span>
                        <ChevronDown className={`h-5 w-5 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {openFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="text-muted-foreground pb-4">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-light font-serif mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} className="group">
                  <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-square overflow-hidden bg-secondary/50">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium font-serif line-clamp-1 group-hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-lg font-semibold mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Add to Cart - Mobile */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t border-border md:hidden z-40">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-muted-foreground">{product.name}</p>
            <p className="text-lg font-semibold">₹{product.price.toLocaleString('en-IN')}</p>
          </div>
          <Button className="flex-1 rounded-full py-6">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      <Footer />
      <MobileNav />
    </main>
  )
}
