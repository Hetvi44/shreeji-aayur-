'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, ShoppingBag, User, X, Heart, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { name: 'Shop', href: '/products' },
  { name: 'Skin Care', href: '/category/skin-care' },
  { name: 'Hair Care', href: '/category/hair-care' },
  { name: 'Body Care', href: '/category/body-care' },
  { name: 'Face Care', href: '/category/face-care' },
]

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/50">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-center">
        <p className="text-xs md:text-sm font-medium tracking-wide">
          🌿 Free Shipping on Orders Above ₹999 &nbsp;|&nbsp; COD Available &nbsp;|&nbsp; 100% Ayurvedic & Natural
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
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
                    key={link.name}
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
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 md:absolute md:left-1/2 md:-translate-x-1/2"
          >
            <Leaf className="h-5 w-5 text-primary hidden md:block" />
            <span className="text-xl md:text-2xl font-semibold tracking-tight text-foreground font-serif">
              ShreejiAayur
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 hidden md:flex"
                    asChild
                  >
                    <Link href="/login">
                      <User className="h-5 w-5" />
                      <span className="sr-only">Account</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="shrink-0 relative" asChild>
                    <Link href="/cart">
                      <ShoppingBag className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                        2
                      </span>
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
