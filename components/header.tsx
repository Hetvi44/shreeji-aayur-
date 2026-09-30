'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, Search, ShoppingBag, User, X, Heart, Leaf, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { motion, AnimatePresence } from 'framer-motion'
import { UserButton, useAuth } from '@clerk/nextjs'
import { getCategories } from '@/lib/actions/categories'
import type { Category } from '@/types'

export function Header() {
  const { isSignedIn } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories', err))
  }, [])

  const navLinks = [
    { name: 'Shop', href: '/products' },
    ...categories.map((c) => ({
      name: c.name,
      href: `/category/${c.slug}`,
    })),
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/50">
      <div className="bg-primary text-primary-foreground py-2 text-center">
        <p className="text-xs md:text-sm font-medium tracking-wide">
          Free Shipping on Orders Above ₹999 &nbsp;|&nbsp; COD Available &nbsp;|&nbsp; 100% Ayurvedic & Natural
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-background">
              <div className="flex items-center gap-2 mb-8 mt-2">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="text-xl font-semibold font-serif tracking-tight">ShreejiAayur</span>
              </div>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="border-t border-border pt-6 mt-2 flex flex-col gap-6">
                  <Link href="/about" className="text-xl font-medium text-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                  <Link href="/blog" className="text-xl font-medium text-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                  {isSignedIn && (
                    <Link href="/admin" className="text-xl font-medium text-primary transition-colors">
                      Admin Panel
                    </Link>
                  )}
                  {!isSignedIn && (
                    <Link href="/sign-in" className="text-xl font-medium text-primary transition-colors">
                      Sign in
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="flex items-center gap-2 md:absolute md:left-1/2 md:-translate-x-1/2"
          >
            <Leaf className="h-5 w-5 text-primary hidden md:block" />
            <span className="text-xl md:text-2xl font-semibold tracking-tight text-foreground font-serif">
              ShreejiAayur
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 max-w-[45%] overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-32 md:w-48 h-9 px-3 text-sm bg-secondary rounded-full border-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const q = (e.target as HTMLInputElement).value.trim()
                        if (q) window.location.href = `/products?search=${encodeURIComponent(q)}`
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(false)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    className="shrink-0"
                  >
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 hidden md:flex"
                    asChild
                  >
                    <Link href="/wishlist">
                      <Heart className="h-5 w-5" />
                      <span className="sr-only">Wishlist</span>
                    </Link>
                  </Button>
                  {isSignedIn ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 hidden md:flex"
                        asChild
                      >
                        <Link href="/admin" title="Admin">
                          <LayoutDashboard className="h-5 w-5" />
                          <span className="sr-only">Admin</span>
                        </Link>
                      </Button>
                      <div className="hidden md:flex items-center pl-1">
                        <UserButton />
                      </div>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 hidden md:flex"
                      asChild
                    >
                      <Link href="/sign-in">
                        <User className="h-5 w-5" />
                        <span className="sr-only">Account</span>
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="shrink-0 relative" asChild>
                    <Link href="/cart">
                      <ShoppingBag className="h-5 w-5" />
                      <span className="sr-only">Cart</span>
                    </Link>
                  </Button>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
