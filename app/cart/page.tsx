"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, X, Truck, Tag, ShoppingBag, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { getCart, updateCartQuantity, removeFromCart } from "@/lib/actions/cart"
import { validateCoupon } from "@/lib/actions/coupons"
import { useCartStore } from "@/store/cart-store"
import { formatPrice } from "@/lib/utils"
import type { CartItemWithProduct } from "@/types"

const toStoreItems = (items: CartItemWithProduct[]) =>
  items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    price: item.product.price,
    originalPrice: item.product.originalPrice ?? undefined,
    image: item.product.images[0] ?? "",
    quantity: item.quantity,
    stock: item.product.stock,
  }))

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number } | null>(null)
  const [validatingCoupon, setValidatingCoupon] = useState(false)
  
  const { setItems: setStoreItems, clearCart: clearStoreCart } = useCartStore()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      setLoading(true)
      const cart = await getCart()
      const items = cart.items
      setCartItems(items)
      setStoreItems(toStoreItems(items))
    } catch (error) {
      console.error("Failed to load cart:", error)
      toast.error("Failed to load cart")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      setUpdating(id)
      const result = await updateCartQuantity(id, newQuantity)
      if (result.success) {
        const nextItems = cartItems.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
        setCartItems(nextItems)
        setStoreItems(toStoreItems(nextItems))
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error("Failed to update quantity:", error)
      toast.error("Failed to update quantity")
    } finally {
      setUpdating(null)
    }
  }

  const handleRemoveItem = async (id: string) => {
    try {
      setUpdating(id)
      const result = await removeFromCart(id)
      if (result.success) {
        const nextItems = cartItems.filter(item => item.id !== id)
        setCartItems(nextItems)
        setStoreItems(toStoreItems(nextItems))
        toast.success("Item removed from cart")
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error("Failed to remove item:", error)
      toast.error("Failed to remove item")
    } finally {
      setUpdating(null)
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    
    try {
      setValidatingCoupon(true)
      const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const result = await validateCoupon(couponCode, subtotal)
      
      if (result.valid) {
        setCouponApplied({ code: couponCode.toUpperCase(), discount: result.discount })
        toast.success(`Coupon applied! You save ${formatPrice(result.discount)}`)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Failed to validate coupon:", error)
      toast.error("Failed to validate coupon")
    } finally {
      setValidatingCoupon(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discount = couponApplied?.discount ?? 0
  const shipping = subtotal >= 99900 ? 0 : 9900
  const total = subtotal - discount + shipping

  if (loading) {
    return (
      <main className="min-h-screen pb-20 md:pb-0">
        <Header />
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </section>
        <Footer />
        <MobileNav />
      </main>
    )
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
                  <Link href={`/products/${item.product.slug}`} className="shrink-0">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-secondary/50">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/products/${item.product.slug}`}>
                          <h3 className="font-medium font-serif hover:text-primary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">Stock: {item.product.stock}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={updating === item.id}
                        className="p-2 hover:bg-secondary rounded-full transition-colors disabled:opacity-50"
                      >
                        {updating === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="flex items-end justify-between mt-auto pt-4">
                      <div className="flex items-center border border-border rounded-full">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={updating === item.id || item.quantity <= 1}
                          className="p-2 hover:bg-secondary rounded-l-full transition-colors disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id || item.quantity >= item.product.stock}
                          className="p-2 hover:bg-secondary rounded-r-full transition-colors disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                        {item.product.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.product.originalPrice * item.quantity)}
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
                        disabled={!!couponApplied}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleApplyCoupon}
                      disabled={!!couponApplied || !couponCode || validatingCoupon}
                      className="rounded-full"
                    >
                      {validatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : couponApplied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                  {couponApplied && (
                    <p className="text-sm text-primary mt-2">Coupon {couponApplied.code} applied! You save {formatPrice(couponApplied.discount)}</p>
                  )}
                </div>

                <div className="space-y-3 py-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add {formatPrice(99900 - subtotal)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="flex justify-between py-4 border-t border-border">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-semibold">{formatPrice(total)}</span>
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
          <span className="text-lg font-semibold">{formatPrice(total)}</span>
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
