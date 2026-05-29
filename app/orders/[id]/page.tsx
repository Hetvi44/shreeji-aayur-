import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/mobile-nav'
import { getOrderById } from '@/lib/actions/orders'
import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Package, Calendar, MapPin, CreditCard, Phone, User, ArrowLeft, CheckCircle2, XCircle, Clock } from 'lucide-react'
import Image from 'next/image'

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const resolvedParams = await params
  const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    redirect('/sign-in')
  }

  const order = await getOrderById(resolvedParams.id)

  if (!order) {
    notFound()
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <Header />

      <section className="container mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-secondary/30 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-light font-serif mb-2">
                    Order #{order.orderNumber}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 text-sm font-medium rounded-full ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {order.paymentStatus === 'PAID' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : order.paymentStatus === 'PENDING' ? (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>{order.paymentStatus}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-secondary/30 rounded-2xl p-6">
              <h2 className="text-lg font-medium font-serif mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-secondary/30 rounded-2xl p-6">
              <h2 className="text-lg font-medium font-serif mb-4">Shipping Address</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{order.address.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.address.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    {order.address.line1}, {order.address.line2 && `${order.address.line2}, `}
                    {order.address.city}, {order.address.state} - {order.address.pincode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-secondary/30 rounded-2xl p-6">
              <h2 className="text-lg font-medium font-serif mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(order.shippingCharge)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-3 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Coupon */}
            {order.coupon && (
              <div className="bg-secondary/30 rounded-2xl p-6">
                <h2 className="text-lg font-medium font-serif mb-4">Applied Coupon</h2>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{order.coupon.code}</span>
                  <span className="text-green-600 text-sm">-{formatPrice(order.discount)}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full rounded-full" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button variant="outline" className="w-full rounded-full" asChild>
                <Link href="/contact">Need Help?</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MobileNav />
    </main>
  )
}
