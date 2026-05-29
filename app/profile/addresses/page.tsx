"use client"

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/mobile-nav'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addAddress } from '@/lib/actions/users'
import { MapPin, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ProfileAddressesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const result = await addAddress(formData)
      
      if (result.success) {
        toast.success('Address added successfully')
        router.push('/profile')
      } else {
        toast.error(result.error || 'Failed to add address')
      }
    } catch (error) {
      console.error('Failed to add address:', error)
      toast.error('Failed to add address')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <Header />

      <section className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
        <div className="rounded-3xl border border-border bg-secondary/30 p-6 md:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Profile</p>
              <h1 className="text-3xl font-light font-serif">Add a new address</h1>
            </div>
            <Link href="/profile" className="text-sm font-medium text-primary hover:underline">
              Back to Profile
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5 rounded-3xl bg-background p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="grid gap-4">
                <Input 
                  name="name" 
                  placeholder="Full name" 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                />
                <Input 
                  name="phone" 
                  placeholder="Phone number" 
                  type="tel" 
                  required 
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Input 
                  name="line1" 
                  placeholder="Address line 1" 
                  type="text" 
                  required 
                  value={formData.line1}
                  onChange={handleChange}
                />
                <Input 
                  name="line2" 
                  placeholder="Address line 2" 
                  type="text" 
                  value={formData.line2}
                  onChange={handleChange}
                />
                <Input 
                  name="city" 
                  placeholder="City" 
                  type="text" 
                  required 
                  value={formData.city}
                  onChange={handleChange}
                />
                <Input 
                  name="state" 
                  placeholder="State" 
                  type="text" 
                  required 
                  value={formData.state}
                  onChange={handleChange}
                />
                <Input 
                  name="pincode" 
                  placeholder="Pincode" 
                  type="text" 
                  required 
                  value={formData.pincode}
                  onChange={handleChange}
                />
                <div className="flex items-center gap-2">
                  <input 
                    id="defaultAddress" 
                    name="isDefault" 
                    type="checkbox" 
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary" 
                  />
                  <label htmlFor="defaultAddress" className="text-sm text-muted-foreground">
                    Set as default address
                  </label>
                </div>
                <Button type="submit" className="w-full rounded-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Address
                </Button>
              </form>
            </div>

            <div className="rounded-3xl bg-primary/5 p-6 text-sm leading-7 text-muted-foreground">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Address Tips</span>
              </div>
              <p>Use a complete delivery address so your order arrives quickly and accurately.</p>
              <ul className="mt-4 space-y-2 list-disc list-inside">
                <li>Include landmark or apartment details.</li>
                <li>Verify pincode and state.</li>
                <li>Set this as your default address for faster checkout.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MobileNav />
    </main>
  )
}
