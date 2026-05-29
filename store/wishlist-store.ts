import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  ids: string[]
  toggle: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  setIds: (ids: string[]) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (productId) => {
        const ids = get().ids
        if (ids.includes(productId)) {
          set({ ids: ids.filter((id) => id !== productId) })
        } else {
          set({ ids: [...ids, productId] })
        }
      },

      isWishlisted: (productId) => {
        return get().ids.includes(productId)
      },

      setIds: (ids) => {
        set({ ids })
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)
