"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  BarChart3, Tag, Image, Star, Settings,
  ExternalLink, Leaf, Menu, X, Bell, LogOut,
} from "lucide-react"

const navItems = [
  {
    section: "Main",
    items: [
      { label: "Overview",   href: "/admin",             icon: LayoutDashboard },
      { label: "Products",   href: "/admin/products",    icon: Package,         badge: "48" },
      { label: "Orders",     href: "/admin/orders",      icon: ShoppingCart,    badge: "12", badgeRed: true },
      { label: "Customers",  href: "/admin/customers",   icon: Users },
    ],
  },
  {
    section: "Store",
    items: [
      { label: "Analytics",  href: "/admin/analytics",   icon: BarChart3 },
      { label: "Coupons",    href: "/admin/coupons",     icon: Tag },
      { label: "Banners",    href: "/admin/banners",     icon: Image },
      { label: "Reviews",    href: "/admin/reviews",     icon: Star },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Settings",   href: "/admin/settings",    icon: Settings },
      { label: "View Store", href: "/",                  icon: ExternalLink },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pageTitle = () => {
    if (pathname === "/admin")              return "Overview"
    if (pathname.startsWith("/admin/products"))  return "Products"
    if (pathname.startsWith("/admin/orders"))    return "Orders"
    if (pathname.startsWith("/admin/customers")) return "Customers"
    if (pathname.startsWith("/admin/analytics")) return "Analytics"
    if (pathname.startsWith("/admin/coupons"))   return "Coupons"
    if (pathname.startsWith("/admin/banners"))   return "Banners"
    if (pathname.startsWith("/admin/reviews"))   return "Reviews"
    if (pathname.startsWith("/admin/settings"))  return "Settings"
    return "Admin"
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-[#0c0f0b] w-[220px]">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-[#81ae74]" />
          <span className="font-serif text-white font-semibold text-base tracking-tight">
            ShreejiAayur
          </span>
        </div>
        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1 ml-6">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.section} className="mb-2">
            <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/25 px-2 py-2">
              {group.section}
            </p>
            {group.items.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 text-[12px] font-medium transition-all ${
                    active
                      ? "bg-[#81ae74] text-white"
                      : "text-white/50 hover:bg-white/6 hover:text-white/85"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.badgeRed
                          ? "bg-red-500 text-white"
                          : "bg-[#81ae74] text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-full bg-[#81ae74] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-[11px] font-medium truncate">Admin</p>
            <p className="text-white/30 text-[10px] truncate">Super Admin</p>
          </div>
          <button className="text-white/30 hover:text-white/60 transition-colors" aria-label="Sign out">
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-[#fcfaf9] overflow-hidden font-sans">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-[#e8e3dc] h-[52px] flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-[#6b6356] hover:text-[#0c0f0b] transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-serif text-[18px] font-semibold text-[#0c0f0b]">
              {pageTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="relative p-2 rounded-full hover:bg-[#f5f0ea] transition-colors text-[#6b6356]"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <Link
              href="/admin/products?action=add"
              className="hidden sm:flex items-center gap-1.5 bg-[#81ae74] text-white text-[12px] font-medium px-3 py-1.5 rounded-full hover:bg-[#5c8a4e] transition-colors"
            >
              + Add Product
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
