'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/mobile-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, CreditCard, Truck, Shield, CheckCircle2, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'

const cartItems = [
  {
    id: 1,
    name: 'Kumkumadi Radiance Serum',
    price: 1299,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop',
    quantity: 1,
  },
  {
    id: 5,
    name: 'Brahmi Hair Oil',
    price: 699,
    image:
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500&auto=format&fit=crop',
    quantity: 2,
  },
]

type Step = 'address' | 'payment' | 'success'
type PaymentMethod = 'cod' | 'razorpay'

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('address')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay')

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
    window.scrollTo(0, 0)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: integrate Razorpay SDK here
    setStep('success')
    window.scrollTo(0, 0)
  }

  if (step === 'success') {
    return (
      <main className="min-h-screen pb-20 md:pb-0">
        <Header />
        <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8"
          >
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-light font-serif mb-4">
              Order Confirmed! 🌿
            </h1>
            <p className="text-muted-foreground max-w-md mb-2">
              Thank you for choosing ShreejiAayur. Your order has been placed successfully.
            </p>
            <p className="text-muted-foreground mb-8">
              Order confirmation sent to{' '}
              <span className="text-foreground font-medium">{formData.email || 'your email'}</span>
            </p>
            <div className="bg-secondary/50 rounded-2xl p-6 mb-8 text-left max-w-sm mx-auto">
              <p className="text-sm font-medium mb-1">Estimated Delivery</p>
              <p className="text-muted-foreground text-sm">5–7 business days</p>
              <p className="text-xs text-muted-foreground mt-2">
                Order ID: <span className="font-mono font-medium">SA{Date.now().toString().slice(-8)}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </motion.div>
        </section>
        <Footer />
        <MobileNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <Header />

      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Back */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              step === 'payment' ? setStep('address') : window.history.back()
            }
            className="rounded-full"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-medium font-serif">
            {step === 'address' ? 'Delivery Address' : 'Payment'}
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-10">
          {(['address', 'payment'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  step === s || (i === 0 && step === 'payment')
                    ? 'w-8 bg-primary'
                    : 'w-4 bg-border'
                }`}
              />
              <span
                className={`text-xs capitalize ${
                  step === s ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-10">
          {/* Form */}
          <div>
            {step === 'address' && (
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="firstName">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Priya"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="lastName">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Sharma"
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="priya@example.com"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="address">
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Street, Area"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="city">
                      City
                    </label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="state">
                      State
                    </label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="pincode">
                      Pincode
                    </label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      required
                      maxLength={6}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full rounded-full text-base">
                  Continue to Payment
                </Button>
              </form>
            )}

            {step === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Delivering to:{' '}
                  <span className="text-foreground font-medium">
                    {formData.address}, {formData.city} — {formData.pincode}
                  </span>
                </p>

                {/* Payment Options */}
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'razorpay' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-primary"
                    />
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Pay Online (Razorpay)</p>
                        <p className="text-xs text-muted-foreground">
                          UPI, Cards, Net Banking, Wallets
                        </p>
                      </div>
                    </div>
                    <span className="ml-auto text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-primary"
                    />
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-accent" />
                      <div>
                        <p className="font-medium text-sm">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-2xl">
                  <Shield className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Your payment information is secured with 256-bit SSL encryption.
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full rounded-full text-base">
                  {paymentMethod === 'razorpay'
                    ? `Pay ₹${total.toLocaleString('en-IN')} Securely`
                    : `Place Order — ₹${total.toLocaleString('en-IN')}`}
                </Button>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-secondary/30 rounded-3xl p-6">
              <h2 className="text-lg font-medium font-serif mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-secondary shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? 'text-primary font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Trust */}
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <Leaf className="h-4 w-4 text-primary shrink-0" />
                <span>Free returns within 30 days on all orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <MobileNav />
    </main>
  )
}
