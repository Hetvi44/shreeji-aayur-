"use client"

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/mobile-nav'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getUserProfile, updateProfile } from '@/lib/actions/users'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ProfileEditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const profile = await getUserProfile()
      setFormData({
        name: profile?.name || '',
        phone: profile?.phone || '',
      })
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const result = await updateProfile(formData)
      
      if (result.success) {
        toast.success('Profile updated successfully')
        router.push('/profile')
      } else {
        toast.error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (loading) {
    return (
      <main className="min-h-screen pb-20 md:pb-0">
        <Header />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <Header />

      <section className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <div className="rounded-3xl border border-border bg-secondary/30 p-6 md:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Profile</p>
              <h1 className="text-3xl font-light font-serif">Edit Profile</h1>
            </div>
            <Link href="/profile" className="text-sm font-medium text-primary hover:underline">
              Back to Profile
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <Input 
              name="name" 
              placeholder="Full name" 
              type="text" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
            <Input 
              name="phone" 
              placeholder="Phone number" 
              type="tel" 
              value={formData.phone}
              onChange={handleChange}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" className="w-full rounded-full sm:w-auto" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
              <Link href="/profile" className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-sm text-muted-foreground hover:bg-secondary/50">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>

      <Footer />
      <MobileNav />
    </main>
  )
}
