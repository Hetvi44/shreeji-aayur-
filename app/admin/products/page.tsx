"use client"

import { useState, useMemo, useEffect, useRef, Suspense } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Search, Plus, Edit2, Trash2, Loader2, Upload, X } from "lucide-react"
import {
  MiniStats, StatusBadge, TableCard, ActionBtn, TH, TD,
} from "@/components/admin/shared"
import {
  Dialog, DialogContent, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/actions/products"
import { getAdminCategories } from "@/lib/actions/categories"
import { paiseToRupees } from "@/lib/utils"
import type { ProductWithCategory, Category } from "@/types"

function getStockStatus(stock: number) {
  if (stock === 0) return "out"
  if (stock < 10) return "low"
  return "active"
}

async function uploadImage(file: File) {
  const fd = new FormData()
  fd.append("file", file)
  fd.append("folder", "products")
  const res = await fetch("/api/upload", { method: "POST", body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Upload failed")
  return data.url as string
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AdminProductsPageInner />
    </Suspense>
  )
}

function AdminProductsPageInner() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductWithCategory | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState("")
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadAll()
  }, [])

  useEffect(() => {
    if (searchParams.get("action") === "add" && !loading) {
      setEditProduct(null)
      setShowModal(true)
    }
  }, [searchParams, loading])

  const loadAll = async () => {
    try {
      setLoading(true)
      const [prods, cats] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
      ])
      setProducts(prods)
      setCategories(cats.filter((c) => c.isActive))
    } catch (error) {
      console.error("Failed to load products:", error)
      showToast("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2800)
  }

  const filterOptions = useMemo(
    () => ["All", ...categories.map((c) => c.name)],
    [categories]
  )

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === "All" || p.category.name === category
      return matchSearch && matchCat
    })
  }, [search, category, products])

  const lowStock = products.filter((p) => p.stock < 10 && p.stock > 0).length
  const outOfStock = products.filter((p) => p.stock === 0).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0c0f0b] text-white text-[12px] font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg">
          <span className="text-[#81ae74]">✓</span> {toast}
        </div>
      )}

      <MiniStats
        items={[
          { label: "Total Products", value: String(products.length), color: "text-[#81ae74]" },
          { label: "In Stock", value: String(products.length - outOfStock), color: "text-[#5c8a4e]" },
          { label: "Low Stock", value: String(lowStock), color: "text-amber-600" },
          { label: "Out of Stock", value: String(outOfStock), color: "text-red-600" },
          { label: "Categories", value: String(categories.length), color: "text-[#b2997d]" },
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
              {filterOptions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={() => {
                if (categories.length === 0) {
                  showToast("Create a category first")
                  return
                }
                setEditProduct(null)
                setShowModal(true)
              }}
              className="flex items-center gap-1.5 bg-[#81ae74] text-white text-[12px] font-medium px-3 py-1.5 rounded-full hover:bg-[#5c8a4e] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Product
            </button>
          </>
        }
        footer={
          <span>
            Showing {filtered.length} of {products.length} products
          </span>
        }
      >
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-[#6b6356]">
            {products.length === 0
              ? "No products yet. Add a category, then add your first product with photos."
              : "No products match your filters."}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className={TH}>Product</th>
                <th className={TH}>Category</th>
                <th className={TH}>Price</th>
                <th className={TH}>Stock</th>
                <th className={TH}>Status</th>
                <th className={TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const status = getStockStatus(p.stock)
                const discount = p.originalPrice
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : null
                const img = p.images[0] || "/placeholder-image.jpg"
                return (
                  <tr key={p.id} className="group hover:bg-[#f5f0ea]/40 transition-colors">
                    <td className={TD}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#eef5ec] shrink-0 relative">
                          <Image
                            src={img}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                            unoptimized={img.startsWith("http")}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-[#0c0f0b] line-clamp-1 max-w-[200px]">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-[#6b6356]">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className={TD}>
                      <span className="text-[#6b6356]">{p.category.name}</span>
                    </td>
                    <td className={TD}>
                      <p className="font-semibold">
                        {(p.price / 100).toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </p>
                      {p.originalPrice && (
                        <p className="text-[10px] text-[#6b6356] line-through">
                          {(p.originalPrice / 100).toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </p>
                      )}
                      {discount !== null && (
                        <span className="text-[9px] font-bold text-[#5c8a4e] bg-[#eef5ec] px-1.5 py-0.5 rounded-full">
                          -{discount}%
                        </span>
                      )}
                    </td>
                    <td className={TD}>
                      <span
                        className={`font-semibold ${
                          p.stock === 0
                            ? "text-red-600"
                            : p.stock < 10
                              ? "text-amber-600"
                              : "text-[#0c0f0b]"
                        }`}
                      >
                        {p.stock}
                      </span>
                      <span className="text-[#6b6356]"> units</span>
                    </td>
                    <td className={TD}>
                      <StatusBadge status={status} />
                    </td>
                    <td className={TD}>
                      <div className="flex items-center gap-0.5">
                        <ActionBtn
                          onClick={() => {
                            setEditProduct(p)
                            setShowModal(true)
                          }}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
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
        )}
      </TableCard>

      <ProductModal
        open={showModal}
        product={editProduct}
        categories={categories}
        saving={saving}
        onClose={() => {
          if (!saving) setShowModal(false)
        }}
        onSave={async (payload) => {
          setSaving(true)
          try {
            const result = editProduct
              ? await updateProduct(editProduct.id, payload)
              : await createProduct(payload)
            if (!result.success) {
              showToast(result.error || "Save failed")
              return
            }
            setShowModal(false)
            setEditProduct(null)
            showToast(editProduct ? "Product updated" : "Product added")
            await loadAll()
          } finally {
            setSaving(false)
          }
        }}
      />

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogTitle className="font-serif text-xl">Delete Product?</DialogTitle>
          <p className="text-[13px] text-[#6b6356] mt-2 mb-6">
            The product will be hidden from your store. You can add it again later if needed.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" className="rounded-full" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              className="rounded-full bg-red-600 hover:bg-red-700 text-white"
              disabled={saving}
              onClick={async () => {
                if (!deleteId) return
                setSaving(true)
                try {
                  const result = await deleteProduct(deleteId)
                  setDeleteId(null)
                  if (!result.success) {
                    showToast(result.error || "Delete failed")
                    return
                  }
                  showToast("Product deleted")
                  await loadAll()
                } finally {
                  setSaving(false)
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProductModal({
  open,
  product,
  categories,
  saving,
  onClose,
  onSave,
}: {
  open: boolean
  product: ProductWithCategory | null
  categories: Category[]
  saving: boolean
  onClose: () => void
  onSave: (payload: {
    name: string
    description: string
    categoryId: string
    priceRupees: string
    originalPriceRupees: string
    stock: string
    images: string[]
    badge: string
    isFeatured: boolean
    isTrending: boolean
  }) => Promise<void>
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    price: "",
    originalPrice: "",
    stock: "",
    badge: "",
    description: "",
    featured: false,
    trending: false,
  })
  const [images, setImages] = useState<string[]>([])
  const [urlInput, setUrlInput] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!open) return
    if (product) {
      setForm({
        name: product.name,
        categoryId: product.categoryId,
        price: String(paiseToRupees(product.price)),
        originalPrice: product.originalPrice
          ? String(paiseToRupees(product.originalPrice))
          : "",
        stock: String(product.stock),
        badge: product.badge || "",
        description: product.description,
        featured: product.isFeatured,
        trending: product.isTrending,
      })
      setImages(product.images || [])
    } else {
      setForm({
        name: "",
        categoryId: categories[0]?.id || "",
        price: "",
        originalPrice: "",
        stock: "",
        badge: "",
        description: "",
        featured: false,
        trending: false,
      })
      setImages([])
    }
    setUrlInput("")
  }, [open, product, categories])

  const set = (k: string, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        urls.push(await uploadImage(file))
      }
      setImages((prev) => [...prev, ...urls])
    } catch (e: any) {
      alert(e.message || "Upload failed")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const canSave =
    !!form.name.trim() &&
    !!form.description.trim() &&
    !!form.categoryId &&
    !!form.price &&
    form.stock !== "" &&
    images.length > 0

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#e8e3dc]">
          <DialogTitle className="font-serif text-xl">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
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
              className="rounded-xl border-[#e8e3dc]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className="w-full border border-[#e8e3dc] rounded-xl px-3 py-2 text-[13px] bg-white outline-none focus:border-[#81ae74]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Badge
            </label>
            <select
              value={form.badge}
              onChange={(e) => set("badge", e.target.value)}
              className="w-full border border-[#e8e3dc] rounded-xl px-3 py-2 text-[13px] bg-white outline-none focus:border-[#81ae74]"
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
              min="0"
              step="1"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="999"
              className="rounded-xl border-[#e8e3dc]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Original Price (₹)
            </label>
            <Input
              type="number"
              min="0"
              step="1"
              value={form.originalPrice}
              onChange={(e) => set("originalPrice", e.target.value)}
              placeholder="1299 (optional)"
              className="rounded-xl border-[#e8e3dc]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Stock Quantity *
            </label>
            <Input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              placeholder="100"
              className="rounded-xl border-[#e8e3dc]"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the product, key ingredients, and benefits..."
              rows={3}
              className="w-full border border-[#e8e3dc] rounded-xl px-3 py-2 text-[13px] outline-none focus:border-[#81ae74] resize-none"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
              Product Images * (at least one)
            </label>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {images.map((src) => (
                  <div
                    key={src}
                    className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#eef5ec] border border-[#e8e3dc]"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized={src.startsWith("http")}
                    />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((i) => i !== src))}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/50 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-[#e8e3dc] rounded-xl p-6 text-center hover:border-[#81ae74] hover:bg-[#eef5ec] transition-all disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#81ae74]" />
              ) : (
                <>
                  <Upload className="h-6 w-6 mx-auto text-[#6b6356] mb-2" />
                  <p className="text-[12px] text-[#6b6356]">
                    Click to upload photos from your computer
                  </p>
                  <p className="text-[11px] text-[#81ae74] font-medium mt-1">
                    PNG, JPG, WebP up to 5MB each
                  </p>
                </>
              )}
            </button>
            <div className="flex gap-2 mt-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Or paste image URL"
                className="rounded-xl border-[#e8e3dc] text-[12px]"
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-full shrink-0"
                onClick={() => {
                  const u = urlInput.trim()
                  if (u) {
                    setImages((prev) => [...prev, u])
                    setUrlInput("")
                  }
                }}
              >
                Add URL
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[12px] font-medium text-[#0c0f0b]">Featured on Homepage</label>
            <button
              type="button"
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
              type="button"
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
          <Button variant="outline" className="rounded-full" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            className="rounded-full bg-[#81ae74] hover:bg-[#5c8a4e] text-white"
            disabled={!canSave || saving}
            onClick={() =>
              onSave({
                name: form.name,
                description: form.description,
                categoryId: form.categoryId,
                priceRupees: form.price,
                originalPriceRupees: form.originalPrice,
                stock: form.stock,
                images,
                badge: form.badge,
                isFeatured: form.featured,
                isTrending: form.trending,
              })
            }
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
