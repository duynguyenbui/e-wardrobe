import { ProductVariant } from '@/payload-types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type CartProductVariant = Pick<ProductVariant, 'id' | 'price' | 'quantity' | 'title'> & {
  quantityToBuy: number
}

type CartStore = {
  items: CartProductVariant[]
  add: (item: CartProductVariant) => void
  remove: (item: CartProductVariant) => void
  clear: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      add: (item) => {
        set((state: CartStore) => {
          if (item.quantity === 0) {
            return state
          }

          const existingItem = state.items.find((i) => i.id === item.id)

          if (existingItem) {
            const newQuantityToBuy = existingItem.quantityToBuy + item.quantityToBuy
            if (newQuantityToBuy > existingItem.quantity) {
              return {
                items: state.items.map((i) =>
                  i.id === item.id ? { ...i, quantityToBuy: existingItem.quantity } : i,
                ),
              }
            }
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantityToBuy: newQuantityToBuy } : i,
              ),
            }
          }

          if (item.quantityToBuy > item.quantity) {
            item.quantityToBuy = item.quantity
          }

          return { items: [...state.items, item] }
        })
      },
      remove: (item) =>
        set((state: CartStore) => ({
          items: state.items.filter((i) => i.id !== item.id),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'e-wardrobeCartStore', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
