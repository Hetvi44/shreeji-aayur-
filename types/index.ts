export type Role = 'CUSTOMER' | 'ADMIN'

export interface User {
  id: string
  clerkId: string
  email: string
  name: string | null
  phone: string | null
  avatar: string | null
  role: Role
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  ingredients: string | null
  benefits: string | null
  howToUse: string | null
  price: number
  originalPrice: number | null
  stock: number
  images: string[]
  badge: string | null
  categoryId: string
  category?: Category
  isFeatured: boolean
  isTrending: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  userId: string
  name: string
  phone: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  isDefault: boolean
  createdAt: Date
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface Order {
  id: string
  orderNumber: string
  userId: string
  addressId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  razorpayOrderId: string | null
  razorpayPaymentId: string | null
  subtotal: number
  discount: number
  shippingCharge: number
  total: number
  couponId: string | null
  trackingNumber: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
  items?: OrderItem[]
  address?: Address
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  name: string
  image: string
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  product?: Product
  createdAt: Date
  updatedAt: Date
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product?: Product
  createdAt: Date
}

export interface Coupon {
  id: string
  code: string
  type: 'PERCENTAGE' | 'FIXED'
  value: number
  minOrderValue: number
  maxUses: number
  usedCount: number
  isActive: boolean
  expiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title: string | null
  body: string | null
  isApproved: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Banner {
  id: string
  title: string
  subtitle: string | null
  image: string
  link: string | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
}