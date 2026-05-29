'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/mobile-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, CreditCard, Truck, Shield, CheckCircle2, Leaf, Loader2, Plus, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { getCart } from '@/lib/actions/cart'
import { getUserProfile, addAddress } from '@/lib/actions/users'
import { createOrder } from '@/lib/actions/orders'
import { createRazorpayOrder, verifyRazorpayPayment } from '@/lib/actions/razorpay'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'
import type { CartItemWithProduct } from '@/types'

type Step = 'address' | 'payment' | 'success'
type PaymentMethod = 'cod' | 'razorpay'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('address')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
  const [userAddresses, setUserAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  
  const { clearCart } = useCartStore()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  })

  useEffect(() => {
    loadCheckoutData()
  }, [])

  const loadCheckoutData = async () => {
    try {
      const [cart, profile] = await Promise.all([getCart(), getUserProfile()])
      
      if (cart.length === 0) {
        router.push('/cart')
        return
      }
      
      setCartItems(cart)
      
      if (profile) {
        setUserAddresses(profile.addresses || [])
        const defaultAddress = profile.addresses?.find((a: any) => a.isDefault)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
        }
      }
    } catch (error) {
      console.error('Failed to load checkout data:', error)
      toast.error('Failed to load checkout data')
    } finally {
      setLoading(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal >= 99900 ? 0 : 9900
  const total = subtotal + shipping

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const result = await addAddress({
        name: formData.name,
        phone: formData.phone,
        line1: formData.line1,
        line2: formData.line2 || undefined,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        isDefault: userAddresses.length === 0,
      })
      
      if (result.success) {
        toast.success('Address added successfully')
        setShowNewAddressForm(false)
        loadCheckoutData()
        if (result.data) {
          setSelectedAddressId(result.data.id)
        }
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error('Failed to add address:', error)
      toast.error('Failed to add address')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAddressId) {
      toast.error('Please select or add an address')
      return
    }
    setStep('payment')
    window.scrollTo(0, 0)
  }

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve()
      document.body.appendChild(script)
    })
  }

  const handleRazorpayPayment = async (orderId: string, orderNumber: string) => {
    try {
      await loadRazorpayScript()
      
      const razorpayResult = await createRazorpayOrder(total, orderId)
      if (!razorpayResult.success) {
        toast.error(razorpayResult.error)
        return
      }

      const options = {
        key: razorpayResult.data!.key,
        amount: razorpayResult.data!.amount,
        currency: razorpayResult.data!.currency,
        name: 'ShreejiAayur',
        description: 'Ayurvedic Skincare',
        order_id: razorpayResult.data!.razorpayOrderId,
        handler: async (response: any) => {
          const verifyResult = await verifyRazorpayPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId,
          })
          
          if (verifyResult.success) {
            clearCart()
            toast.success('Payment successful!')
            router.push(`/orders/${orderId}`)
          } else {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: userAddresses.find((a) => a.id === selectedAddressId)?.name || '',
          contact: userAddresses.find((a) => a.id === selectedAddressId)?.phone || '',
        },
        theme: {
          color: '#81ae74',
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Razorpay error:', error)
      toast.error('Payment failed. Please try again.')
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedAddressId) {
      toast.error('Please select an address')
      return
    }

    try {
      setSubmitting(true)
      
      const orderResult = await createOrder({
        addressId: selectedAddressId,
        paymentMethod,
      })

      if (!orderResult.success) {
        toast.error(orderResult.error)
        return
      }

      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment(orderResult.data!.orderId, orderResult.data!.orderNumber)
      } else {
        clearCart()
        toast.success('Order placed successfully!')
        router.push(`/orders/${orderResult.data!.orderId}`)
      }
    } catch (error) {
      console.error('Failed to place order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

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
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
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

  const selectedAddress = userAddresses.find((a) => a.id === selectedAddressId)

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
              <div className="space-y-6">
                {/* Saved Addresses */}
                {userAddresses.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium font-serif">Select Delivery Address</h2>
                    <div className="space-y-3">
                      {userAddresses.map((address) => (
                        <label
                          key={address.id}
                          className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                            selectedAddressId === address.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddressId === address.id}
                            onChange={(e) => setSelectedAddressId(e.target.value)}
                            className="accent-primary mt-1"
                          />
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm">{address.name}</p>
                              <p className="text-sm text-muted-foreground">{address.phone}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.line1}, {address.line2 && `${address.line2}, `}{address.city}, {address.state} - {address.pincode}
                              </p>
                              {address.isDefault && (
                                <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-2">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Address */}
                {!showNewAddressForm ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewAddressForm(true)}
                    className="w-full rounded-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                ) : (
                  <form onSubmit={handleAddAddress} className="space-y-4 p-6 bg-secondary/30 rounded-2xl">
                    <h3 className="font-medium font-serif">Add New Address</h3>
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="name">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Priya Sharma"
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
                      <label className="block text-sm font-medium mb-2" htmlFor="line1">
                        Address Line 1
                      </label>
                      <Input
                        id="line1"
                        name="line1"
                        value={formData.line1}
                        onChange={handleInputChange}
                        placeholder="House/Flat No., Street, Area"
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="line2">
                        Address Line 2 (Optional)
                      </label>
                      <Input
                        id="line2"
                        name="line2"
                        value={formData.line2}
                        onChange={handleInputChange}
                        placeholder="Landmark, Building name"
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
                    <div className="flex gap-3">
                      <Button type="submit" disabled={submitting} className="flex-1 rounded-full">
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Save Address
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewAddressForm(false)}
                        className="rounded-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                {userAddresses.length > 0 && !showNewAddressForm && (
                  <Button
                    type="button"
                    onClick={handleAddressSubmit}
                    disabled={!selectedAddressId}
                    size="lg"
                    className="w-full rounded-full text-base"
                  >
                    Continue to Payment
                  </Button>
                )}
              </div>
            )}

            {step === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {selectedAddress && (
                  <div className="p-4 bg-secondary/30 rounded-2xl">
                    <p className="text-sm font-medium mb-2">Delivering to:</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAddress.name} • {selectedAddress.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAddress.line1}, {selectedAddress.line2 && `${selectedAddress.line2}, `}{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </p>
                  </div>
                )}

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

                <Button type="submit" disabled={submitting} size="lg" className="w-full rounded-full text-base">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {paymentMethod === 'razorpay'
                    ? `Pay ${formatPrice(total)} Securely`
                    : `Place Order — ${formatPrice(total)}`}
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
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? 'text-primary font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
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
