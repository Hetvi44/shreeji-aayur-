"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, CreditCard, Truck, Shield, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

const cartItems = [
  {
    id: 1,
    name: "Kumkumadi Radiance Serum",
    price: 1299,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop",
    quantity: 1,
  },
  {
    id: 5,
    name: "Brahmi Hair Oil",
    price: 699,
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500&auto=format&fit=crop",
    quantity: 2,
  },
]

export default function CheckoutPage() {
  const [step, setStep] = useState<"address" | "payment" | "success">("address")
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("razorpay")
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("success")
  }

  if (step === "success") {
    return (
      <main className="min-h-screen pb-20 md:pb-0">
        <Header />
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-md mx-auto text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-light font-serif mb-4">Order Placed Successfully!</h1>
              <p className="text-muted-foreground mb-2">
                Thank you for your order. Your order number is:
              </p>
              <p className="text-xl font-semibold mb-6">#SA{Math.floor(100000 + Math.random() * 900000)}</p>
              <p className="text-muted-foreground mb-8">
                We have sent a confirmation email to your registered email address. 
                You will receive tracking details once your order is shipped.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="rounded-full">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild className="rounded-full">
                  <Link href="/profile">Track Order</Link>
                </Button>
              </div>
            </motion.div>
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
          {/* Back Link */}
          <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="h-4 w-4" />
            Back to Cart
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {/* Progress Steps */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`flex items-center gap-2 ${step === "address" || step === "payment" ? "text-primary" : "text-muted-foreground"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "address" ? "bg-primary text-primary-foreground" : step === "payment" ? "bg-primary/10 text-primary" : "bg-secondary"}`}>
                    1
                  </div>
                  <span className="hidden sm:inline">Address</span>
                </div>
                <div className="flex-1 h-px bg-border" />
                <div className={`flex items-center gap-2 ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                    2
                  </div>
                  <span className="hidden sm:inline">Payment</span>
                </div>
              </div>

              {step === "address" && (
                <motion.form 
                  onSubmit={handleAddressSubmit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-medium font-serif">Shipping Address</h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">First Name</label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Last Name</label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number</label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl"
                        placeholder="+91"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Address</label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl"
                      placeholder="House/Flat No., Building, Street"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">City</label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">State</label>
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">PIN Code</label>
                      <Input
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl"
                        pattern="[0-9]{6}"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full sm:w-auto rounded-full py-6 px-8">
                    Continue to Payment
                  </Button>
                </motion.form>
              )}

              {step === "payment" && (
                <motion.form 
                  onSubmit={handlePaymentSubmit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-medium font-serif">Payment Method</h2>
                  
                  <div className="space-y-3">
                    <label 
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-colors ${paymentMethod === "razorpay" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="razorpay"
                        checked={paymentMethod === "razorpay"}
                        onChange={() => setPaymentMethod("razorpay")}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "razorpay" ? "border-primary" : "border-muted-foreground"}`}>
                        {paymentMethod === "razorpay" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">Pay Online</p>
                        <p className="text-sm text-muted-foreground">Cards, UPI, Net Banking, Wallets</p>
                      </div>
                      <Image
                        src="https://razorpay.com/assets/razorpay-logo.svg"
                        alt="Razorpay"
                        width={80}
                        height={20}
                        className="opacity-60"
                      />
                    </label>

                    <label 
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-primary" : "border-muted-foreground"}`}>
                        {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-2xl">
                    <Shield className="h-5 w-5 text-primary shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep("address")}
                      className="rounded-full"
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 sm:flex-none rounded-full py-6 px-8">
                      {paymentMethod === "cod" ? "Place Order" : "Pay ₹" + total.toLocaleString('en-IN')}
                    </Button>
                  </div>
                </motion.form>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 sticky top-24">
                <h2 className="text-lg font-medium font-serif mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-secondary/50 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 py-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                </div>

                <div className="flex justify-between py-4 border-t border-border">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-semibold">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Order Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t border-border md:hidden z-40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-semibold">₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <Footer />
      <MobileNav />
    </main>
  )
}
