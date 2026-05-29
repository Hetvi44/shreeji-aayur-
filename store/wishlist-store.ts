'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  ids: string[]
  count: number
  
  setIds: (ids: string[]) => void
  toggle: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      count: 0,

      setIds: (ids) => set({ ids, count: ids.length }),

      toggle: (productId) =>
        set((state) => {
          const isWishlisted = state.ids.includes(productId)
          const newIds = isWishlisted
            ? state.ids.filter((id) => id !== productId)
            : [...state.ids, productId]
          
          return { ids: newIds, count: newIds.length }
        }),

      isWishlisted: (productId) => get().ids.includes(productId),

      clear: () => set({ ids: [], count: 0 }),
    }),
    {
      name: 'wishlist-store',
      skipHydration: true,
    }
  )
)