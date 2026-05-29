// types/index.ts
// Shared types used across server actions and components

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export type CartItemWithProduct = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    originalPrice: number | null
    images: string[]
    stock: number
  }
}

export type OrderWithItems = {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  subtotal: number
  discount: number
  shippingCharge: number
  total: number
  createdAt: Date
  address: {
    name: string
    line1: string
    line2: string | null
    city: string
    state: string
    pincode: string
    phone: string
  }
  items: {
    id: string
    quantity: number
    price: number
    name: string
    image: string
  }[]
  coupon: { code: string } | null
}

export type ProductWithCategory = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice: number | null
  images: string[]
  badge: string | null
  stock: number
  isFeatured: boolean
  isTrending: boolean
  ingredients: string | null
  benefits: string | null
  howToUse: string | null
  category: {
    id: string
    name: string
    slug: string
  }
}
