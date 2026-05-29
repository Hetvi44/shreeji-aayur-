'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItemType {
  id: string
  productId: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItemType[]
  isOpen: boolean
  count: number
  total: number
  
  setItems: (items: CartItemType[]) => void
  addItem: (item: CartItemType) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      count: 0,
      total: 0,

      setItems: (items) => {
        const count = items.reduce((acc, item) => acc + item.quantity, 0)
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
        set({ items, count, total })
      },

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId)
          let newItems

          if (existingItem) {
            newItems = state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            )
          } else {
            newItems = [...state.items, item]
          }

          const count = newItems.reduce((acc, i) => acc + i.quantity, 0)
          const total = newItems.reduce((acc, i) => acc + i.price * i.quantity, 0)

          return { items: newItems, count, total }
        }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id)
          const count = newItems.reduce((acc, i) => acc + i.quantity, 0)
          const total = newItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
          return { items: newItems, count, total }
        }),

      updateQty: (id, qty) =>
        set((state) => {
          const newItems = state.items
            .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock)) } : i))
            .filter((i) => i.quantity > 0)

          const count = newItems.reduce((acc, i) => acc + i.quantity, 0)
          const total = newItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
          return { items: newItems, count, total }
        }),

      clearCart: () => set({ items: [], count: 0, total: 0, isOpen: false }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'cart-store',
      skipHydration: true,
    }
  )
)