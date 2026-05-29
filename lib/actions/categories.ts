"use server"

import { db } from "@/lib/db"

// ─── GET ALL CATEGORIES ─────────────────────────────────────
export async function getCategories() {
  try {
    return await db.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    })
  } catch (error) {
    console.error("[getCategories]", error)
    return []
  }
}

// ─── GET CATEGORY BY SLUG ────────────────────────────────────
export async function getCategoryBySlug(slug: string) {
  try {
    return await db.category.findUnique({
      where: { slug, isActive: true },
    })
  } catch (error) {
    console.error("[getCategoryBySlug]", error)
    return null
  }
}
