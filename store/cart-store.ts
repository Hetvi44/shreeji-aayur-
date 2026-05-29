import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItemWithProduct } from '@/types'

interface CartStore {
  items: CartItemWithProduct[]
  count: number
  total: number
  isOpen: boolean
  setItems: (items: CartItemWithProduct[]) => void
  addItem: (item: CartItemWithProduct) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      total: 0,
      isOpen: false,

      setItems: (items) => {
        const count = items.reduce((sum, item) => sum + item.quantity, 0)
        const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        set({ items, count, total })
      },

      addItem: (item) => {
        const items = get().items
        const existingIndex = items.findIndex((i) => i.id === item.id)

        if (existingIndex >= 0) {
          items[existingIndex].quantity += item.quantity
        } else {
          items.push(item)
        }

        const count = items.reduce((sum, item) => sum + item.quantity, 0)
        const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        set({ items, count, total })
      },

      removeItem: (id) => {
        const items = get().items.filter((item) => item.id !== id)
        const count = items.reduce((sum, item) => sum + item.quantity, 0)
        const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        set({ items, count, total })
      },

      updateQty: (id, qty) => {
        const items = get().items.map((item) =>
          item.id === id ? { ...item, quantity: qty } : item
        )
        const count = items.reduce((sum, item) => sum + item.quantity, 0)
        const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        set({ items, count, total })
      },

      clearCart: () => {
        set({ items: [], count: 0, total: 0 })
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'cart-storage',
    }
  )
)
