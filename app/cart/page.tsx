"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, X, Truck, Tag, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"

const initialCartItems = [
  {
    id: 1,
    name: "Kumkumadi Radiance Serum",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop",
    category: "Face Care",
    quantity: 1,
  },
  {
    id: 5,
    name: "Brahmi Hair Oil",
    price: 699,
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500&auto=format&fit=crop",
    category: "Hair Care",
    quantity: 2,
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(items => items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal - discount + shipping

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "welcome10") {
      setCouponApplied(true)
    }
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen pb-20 md:pb-0">
        <Header />
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-2xl md:text-3xl font-light font-serif mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you have not added anything to your cart yet.</p>
            <Button asChild className="rounded-full">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </section>
        <Footer />
        <MobileNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-32 md:pb-0">
      <Header />
      
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-light font-serif mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 bg-card rounded-2xl"
                >
                  <Link href={`/products/${item.id}`} className="shrink-0">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-secondary/50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs tracking-wider uppercase text-muted-foreground">
                          {item.category}
                        </span>
                        <Link href={`/products/${item.id}`}>
                          <h3 className="font-medium font-serif hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-end justify-between mt-auto pt-4">
                      <div className="flex items-center border border-border rounded-full">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-secondary rounded-l-full transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-secondary rounded-r-full transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        {item.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Continue Shopping */}
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 text-primary hover:underline mt-4"
              >
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 sticky top-24">
                <h2 className="text-lg font-medium font-serif mb-6">Order Summary</h2>
                
                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Apply Coupon</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        className="pl-10 rounded-full"
                        disabled={couponApplied}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={applyCoupon}
                      disabled={couponApplied || !couponCode}
                      className="rounded-full"
                    >
                      {couponApplied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                  {couponApplied && (
                    <p className="text-sm text-primary mt-2">Coupon WELCOME10 applied! 10% off</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">Try: WELCOME10 for 10% off</p>
                </div>

                <div className="space-y-3 py-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for free shipping
                    </p>
                  )}
                </div>

                <div className="flex justify-between py-4 border-t border-border">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-semibold">₹{total.toLocaleString('en-IN')}</span>
                </div>

                <Button asChild className="w-full rounded-full py-6 text-base font-medium mt-4">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Free shipping ₹999+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Checkout Bar */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t border-border md:hidden z-40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{cartItems.length} items</span>
          <span className="text-lg font-semibold">₹{total.toLocaleString('en-IN')}</span>
        </div>
        <Button asChild className="w-full rounded-full py-6">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>

      <Footer />
      <MobileNav />
    </main>
  )
}
