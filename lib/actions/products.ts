"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import type { ActionResult, ProductWithCategory } from "@/types"

// ─── GET ALL PRODUCTS ────────────────────────────────────────
export async function getProducts(params?: {
  category?: string
  featured?: boolean
  trending?: boolean
  search?: string
  limit?: number
}): Promise<ProductWithCategory[]> {
  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        ...(params?.category && {
          category: { slug: params.category },
        }),
        ...(params?.featured && { isFeatured: true }),
        ...(params?.trending && { isTrending: true }),
        ...(params?.search && {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: params?.limit,
    })
    return products
  } catch (error) {
    console.error("[getProducts]", error)
    return []
  }
}

// ─── GET SINGLE PRODUCT ──────────────────────────────────────
export async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  try {
    const product = await db.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    })
    return product
  } catch (error) {
    console.error("[getProductBySlug]", error)
    return null
  }
}

// ─── GET ALL PRODUCTS (ADMIN) ────────────────────────────────
export async function getAdminProducts() {
  try {
    return await db.product.findMany({
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { orderItems: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[getAdminProducts]", error)
    return []
  }
}

// ─── CREATE PRODUCT ──────────────────────────────────────────
export async function createProduct(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const name        = formData.get("name") as string
    const description = formData.get("description") as string
    const categoryId  = formData.get("categoryId") as string
    const price       = Number(formData.get("price")) * 100     // convert to paise
    const origPrice   = formData.get("originalPrice")
      ? Number(formData.get("originalPrice")) * 100
      : null
    const stock       = Number(formData.get("stock"))
    const badge       = formData.get("badge") as string || null
    const isFeatured  = formData.get("isFeatured") === "true"
    const isTrending  = formData.get("isTrending") === "true"
    const ingredients = formData.get("ingredients") as string || null
    const benefits    = formData.get("benefits") as string || null
    const howToUse    = formData.get("howToUse") as string || null

    if (!name || !description || !categoryId || !price || !stock) {
      return { success: false, error: "Missing required fields" }
    }

    // Create URL-friendly slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    // Check slug uniqueness
    const existing = await db.product.findUnique({ where: { slug } })
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug

    const product = await db.product.create({
      data: {
        name,
        slug: finalSlug,
        description,
        categoryId,
        price,
        originalPrice: origPrice,
        stock,
        badge,
        isFeatured,
        isTrending,
        ingredients,
        benefits,
        howToUse,
        images: [], // Cloudinary URLs added separately
      },
    })

    revalidatePath("/products")
    revalidatePath("/admin/products")
    revalidatePath("/")

    return { success: true, data: { id: product.id } }
  } catch (error) {
    console.error("[createProduct]", error)
    return { success: false, error: "Failed to create product" }
  }
}

// ─── UPDATE PRODUCT ──────────────────────────────────────────
export async function updateProduct(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const price     = Number(formData.get("price")) * 100
    const origPrice = formData.get("originalPrice")
      ? Number(formData.get("originalPrice")) * 100
      : null

    await db.product.update({
      where: { id },
      data: {
        name:          formData.get("name") as string,
        description:   formData.get("description") as string,
        categoryId:    formData.get("categoryId") as string,
        price,
        originalPrice: origPrice,
        stock:         Number(formData.get("stock")),
        badge:         formData.get("badge") as string || null,
        isFeatured:    formData.get("isFeatured") === "true",
        isTrending:    formData.get("isTrending") === "true",
        ingredients:   formData.get("ingredients") as string || null,
        benefits:      formData.get("benefits") as string || null,
        howToUse:      formData.get("howToUse") as string || null,
      },
    })

    revalidatePath("/products")
    revalidatePath("/admin/products")
    revalidatePath("/")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[updateProduct]", error)
    return { success: false, error: "Failed to update product" }
  }
}

// ─── DELETE PRODUCT ──────────────────────────────────────────
export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    // Soft delete — keep for order history
    await db.product.update({
      where: { id },
      data: { isActive: false },
    })

    revalidatePath("/admin/products")
    revalidatePath("/products")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[deleteProduct]", error)
    return { success: false, error: "Failed to delete product" }
  }
}

// ─── UPDATE STOCK ────────────────────────────────────────────
export async function updateStock(
  id: string,
  quantity: number
): Promise<ActionResult> {
  try {
    await db.product.update({
      where: { id },
      data: { stock: { increment: quantity } },
    })
    revalidatePath("/admin/products")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[updateStock]", error)
    return { success: false, error: "Failed to update stock" }
  }
}
