import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/mobile-nav'
import { getUserProfile } from '@/lib/actions/users'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User, MapPin, Phone, Mail, Trash2, Check, Package, Heart, ShoppingBag } from 'lucide-react'
import { deleteAddress, setDefaultAddress } from '@/lib/actions/users'
import { revalidatePath } from 'next/cache'

export default async function ProfilePage() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    redirect('/sign-in?redirect=/profile')
  }

  const profile = await getUserProfile()

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <Header />

      <section className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-light font-serif mb-8">My Profile</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-secondary/30 rounded-2xl p-6">
              <h2 className="text-lg font-medium font-serif mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 sm:items-center">
                  <User className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{profile?.name || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:items-center">
                  <Mail className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profile?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:items-center">
                  <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{profile?.phone || 'Not set'}</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 rounded-full" asChild>
                <Link href="/profile/edit">Edit Profile</Link>
              </Button>
            </div>

            <div className="bg-secondary/30 rounded-2xl p-6">
              <h2 className="text-lg font-medium font-serif mb-4">Quick Links</h2>
              <div className="grid gap-2">
                <Link href="/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span>My Orders</span>
                </Link>
                <Link href="/wishlist" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                  <Heart className="h-5 w-5 text-muted-foreground" />
                  <span>Wishlist</span>
                </Link>
                <Link href="/cart" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                  <span>Cart</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-secondary/30 rounded-2xl p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium font-serif">Saved Addresses</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your delivery locations and choose a default address for orders.
                  </p>
                </div>
                <Button size="sm" className="rounded-full" asChild>
                  <Link href="/profile/addresses">Add New Address</Link>
                </Button>
              </div>

              {profile?.addresses && profile.addresses.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {profile.addresses.map((address: any) => (
                    <div
                      key={address.id}
                      className={`p-4 rounded-xl border-2 ${
                        address.isDefault ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      {address.isDefault && (
                        <div className="flex items-center gap-1 text-xs text-primary font-medium mb-2">
                          <Check className="h-3 w-3" />
                          Default Address
                        </div>
                      )}
                      <div className="space-y-2 text-sm">
                        <p className="font-medium">{address.name}</p>
                        <p className="text-muted-foreground">{address.phone}</p>
                        <p className="text-muted-foreground">
                          {address.line1}
                          {address.line2 ? `, ${address.line2}` : ''}
                          , {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                        {!address.isDefault && (
                          <form
                            action={async () => {
                              'use server'
                              await setDefaultAddress(address.id)
                              revalidatePath('/profile')
                            }}
                          >
                            <Button size="sm" variant="outline" className="rounded-full w-full sm:w-auto">
                              Set Default
                            </Button>
                          </form>
                        )}
                        <form
                          action={async () => {
                            'use server'
                            await deleteAddress(address.id)
                            revalidatePath('/profile')
                          }}
                        >
                          <Button size="sm" variant="outline" className="rounded-full w-full sm:w-auto text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No saved addresses</p>
                  <Button className="rounded-full" asChild>
                    <Link href="/profile/addresses">Add Your First Address</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MobileNav />
    </main>
  )
}
