"use client"

import Link from "next/link"
import { Home, Search, Heart, User, ShoppingBag } from "lucide-react"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/products" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: User, label: "Account", href: "/login" },
  { icon: ShoppingBag, label: "Cart", href: "/cart", badge: 2 },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border/50 pb-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-foreground transition-colors relative"
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.badge && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-wide">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
