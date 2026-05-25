"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Search, Plus, Edit2, Trash2, Copy, SlidersHorizontal } from "lucide-react"
import {
  MiniStats, StatusBadge, TableCard, ActionBtn, TH, TD,
} from "@/components/admin/shared"
import {
  Dialog, DialogContent, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { products } from "@/lib/products"
import type { Product } from "@/lib/products"

const CATEGORIES = ["All", "Face Care", "Skin Care", "Hair Care", "Body Care"]

// Mock stock data (replace with DB later)
const stockMap: Record<number, { stock: number; sales: number }> = {
  1: { stock: 42, sales: 186 }, 2: { stock: 67, sales: 134 }, 3: { stock: 8, sales: 97 },
  4: { stock: 31, sales: 78 }, 5: { stock: 0, sales: 212 }, 6: { stock: 19, sales: 65 },
  7: { stock: 5, sales: 88 }, 8: { stock: 93, sales: 201 }, 9: { stock: 24, sales: 54 },
  10: { stock: 38, sales: 72 }, 11: { stock: 12, sales: 99 }, 12: { stock: 44, sales: 63 },
  13: { stock: 29, sales: 45 }, 14: { stock: 7, sales: 38 }, 15: { stock: 56, sales: 52 },
}

function getStockStatus(stock: number) {
  if (stock === 0) return "out"
  if (stock < 10) return "low"
  return "active"
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [toast, setToast] = useState("")

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === "All" || p.category === category
      return matchSearch && matchCat
    })
  }, [search, category])

  const totalStock = Object.values(stockMap).reduce((s, v) => s + v.stock, 0)
  const lowStock = Object.values(stockMap).filter((v) => v.stock < 10 && v.stock > 0).length
  const outOfStock = Object.values(stockMap).filter((v) => v.stock === 0).length

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0c0f0b] text-white text-[12px] font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg animate-fade-in">
          <span className="text-[#81ae74]">✓</span> {toast}
        </div>
      )}

      <MiniStats
        items={[
          { label: "Total Products", value: String(products.length),   color: "text-[#81ae74]" },
          { label: "In Stock",       value: String(products.length - outOfStock), color: "text-[#5c8a4e]" },
          { label: "Low Stock",      value: String(lowStock),          color: "text-amber-600" },
          { label: "Out of Stock",   value: String(outOfStock),        color: "text-red-600" },
          { label: "Categories",     value: "4",                       color: "text-[#b2997d]" },
        ]}
      />

      <TableCard
        title="All Products"
        actions={
          <>
            <div className="flex items-center gap-1.5 bg-[#f5f0ea] rounded-full px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-[#6b6356]" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-[12px] outline-none text-[#0c0f0b] placeholder:text-[#6b6356] w-36"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-[12px] border border-[#e8e3dc] rounded-full px-3 py-1.5 bg-white text-[#0c0f0b] outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-[#81ae74] text-white text-[12px] font-medium px-3 py-1.5 rounded-full hover:bg-[#5c8a4e] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Product
            </button>
          </>
        }
        footer={
          <>
            <span>Showing {filtered.length} of {products.length} products</span>
            <div className="flex gap-1">
              <button className="w-7 h-7 rounded-lg border border-[#e8e3dc] text-[11px] bg-[#81ae74] text-white">1</button>
              <button className="w-7 h-7 rounded-lg border border-[#e8e3dc] text-[11px] hover:bg-[#f5f0ea] transition-colors">2</button>
              <button className="w-7 h-7 rounded-lg border border-[#e8e3dc] text-[11px] hover:bg-[#f5f0ea] transition-colors">›</button>
            </div>
          </>
        }
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={TH}>Product</th>
              <th className={TH}>Category</th>
              <th className={TH}>Price</th>
              <th className={TH}>Stock</th>
              <th className={TH}>Status</th>
              <th className={TH}>Sales</th>
              <th className={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const s = stockMap[p.id] ?? { stock: 50, sales: 20 }
              const status = getStockStatus(s.stock)
              const discount = p.originalPrice
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                : null
              return (
                <tr key={p.id} className="group hover:bg-[#f5f0ea]/40 transition-colors">
                  <td className={TD}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#eef5ec] shrink-0 relative">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-[#0c0f0b] line-clamp-1 max-w-[200px]">{p.name}</p>
                        <p className="text-[10px] text-[#6b6356]">ID: SA-P{String(p.id).padStart(3, "0")}</p>
                      </div>
                    </div>
                  </td>
                  <td className={TD}><span className="text-[#6b6356]">{p.category}</span></td>
                  <td className={TD}>
                    <p className="font-semibold">₹{p.price.toLocaleString("en-IN")}</p>
                    {p.originalPrice && (
                      <p className="text-[10px] text-[#6b6356] line-through">₹{p.originalPrice.toLocaleString("en-IN")}</p>
                    )}
                    {discount && (
                      <span className="text-[9px] font-bold text-[#5c8a4e] bg-[#eef5ec] px-1.5 py-0.5 rounded-full">
                        -{discount}%
                      </span>
                    )}
                  </td>
                  <td className={TD}>
                    <span
                      className={`font-semibold ${
                        s.stock === 0 ? "text-red-600" : s.stock < 10 ? "text-amber-600" : "text-[#0c0f0b]"
                      }`}
                    >
                      {s.stock}
                    </span>
                    <span className="text-[#6b6356]"> units</span>
                  </td>
                  <td className={TD}><StatusBadge status={status} /></td>
                  <td className={TD}><span className="font-medium">{s.sales}</span> sold</td>
                  <td className={TD}>
                    <div className="flex items-center gap-0.5">
                      <ActionBtn onClick={() => { setEditProduct(p); showToast(`Editing: ${p.name}`) }}>
                        <Edit2 className="h-3.5 w-3.5" />
                      </ActionBtn>
                      <ActionBtn onClick={() => showToast("Product duplicated!")}>
                        <Copy className="h-3.5 w-3.5" />
                      </ActionBtn>
                      <ActionBtn danger onClick={() => setDeleteId(p.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </ActionBtn>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </TableCard>

      {/* Add Product Modal */}
      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={() => { setShowAddModal(false); showToast("Product added successfully!") }}
      />

      {/* Delete Confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogTitle className="font-serif text-xl">Delete Product?</DialogTitle>
          <p className="text-[13px] text-[#6b6356] mt-2 mb-6">
            This action cannot be undone. The product will be permanently removed from your store.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" className="rounded-full" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              className="rounded-full bg-red-600 hover:bg-red-700 text-white"
              onClick={() => { setDeleteId(null); showToast("Product deleted!") }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Add Product Modal ────────────────────────────────────────
function AddProductModal({
  open, onClose, onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: () => void
}) {
  const [form, setForm] = useState({
    name: "", category: "Face Care", price: "", originalPrice: "",
    stock: "", badge: "", description: "", featured: false, trending: false,
  })

  const set = (k: string, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#e8e3dc]">
          <DialogTitle className="font-serif text-xl">Add New Product</DialogTitle>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Kumkumadi Radiance Serum"
              className="rounded-xl border-[#e8e3dc] focus:border-[#81ae74] focus:ring-[#81ae74]/20"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full border border-[#e8e3dc] rounded-xl px-3 py-2 text-[13px] text-[#0c0f0b] bg-white outline-none focus:border-[#81ae74]"
            >
              <option>Face Care</option>
              <option>Skin Care</option>
              <option>Hair Care</option>
              <option>Body Care</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Badge
            </label>
            <select
              value={form.badge}
              onChange={(e) => set("badge", e.target.value)}
              className="w-full border border-[#e8e3dc] rounded-xl px-3 py-2 text-[13px] text-[#0c0f0b] bg-white outline-none focus:border-[#81ae74]"
            >
              <option value="">None</option>
              <option>Best Seller</option>
              <option>New</option>
              <option>Trending</option>
              <option>Limited</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Sale Price (₹) *
            </label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="999"
              className="rounded-xl border-[#e8e3dc] focus:border-[#81ae74]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Original Price (₹)
            </label>
            <Input
              type="number"
              value={form.originalPrice}
              onChange={(e) => set("originalPrice", e.target.value)}
              placeholder="1299 (optional)"
              className="rounded-xl border-[#e8e3dc] focus:border-[#81ae74]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Stock Quantity *
            </label>
            <Input
              type="number"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              placeholder="100"
              className="rounded-xl border-[#e8e3dc] focus:border-[#81ae74]"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the product, key ingredients, and benefits..."
              rows={3}
              className="w-full border border-[#e8e3dc] rounded-xl px-3 py-2 text-[13px] text-[#0c0f0b] bg-white outline-none focus:border-[#81ae74] resize-none font-sans"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Product Images
            </label>
            <div className="border-2 border-dashed border-[#e8e3dc] rounded-xl p-6 text-center cursor-pointer hover:border-[#81ae74] hover:bg-[#eef5ec] transition-all">
              <p className="text-2xl mb-2">☁️</p>
              <p className="text-[12px] text-[#6b6356]">
                Click to upload or drag & drop
              </p>
              <p className="text-[11px] text-[#81ae74] font-medium mt-1">
                PNG, JPG, WebP up to 5MB — Cloudinary integration coming
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[12px] font-medium text-[#0c0f0b]">Featured on Homepage</label>
            <button
              onClick={() => set("featured", !form.featured)}
              className={`w-9 h-5 rounded-full transition-colors relative ${form.featured ? "bg-[#81ae74]" : "bg-[#e8e3dc]"}`}
              role="switch"
              aria-checked={form.featured}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.featured ? "translate-x-4" : "translate-x-0.5"}`}
              />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[12px] font-medium text-[#0c0f0b]">Show in Trending</label>
            <button
              onClick={() => set("trending", !form.trending)}
              className={`w-9 h-5 rounded-full transition-colors relative ${form.trending ? "bg-[#81ae74]" : "bg-[#e8e3dc]"}`}
              role="switch"
              aria-checked={form.trending}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.trending ? "translate-x-4" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#e8e3dc] flex justify-end gap-3">
          <Button variant="outline" className="rounded-full" onClick={onClose}>Cancel</Button>
          <Button
            className="rounded-full bg-[#81ae74] hover:bg-[#5c8a4e] text-white"
            onClick={onSave}
            disabled={!form.name || !form.price || !form.stock}
          >
            Save Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
