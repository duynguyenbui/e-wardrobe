import { ProductVariant } from '@/payload-types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type CartProductVariant = Pick<
  ProductVariant,
  'id' | 'price' | 'quantity' | 'title' | 'discount'
> & {
  quantityToBuy: number
  isBuying: boolean
}

type CartStore = {
  items: CartProductVariant[]
  add: (item: CartProductVariant) => void
  remove: (item: CartProductVariant) => void
  clear: () => void
  minus: (variantId: string) => void
  plus: (variantId: string) => void
  setIsBuying: (variantId: string, isBuying: boolean) => void
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

          const quantityToBuy =
            item.quantityToBuy > item.quantity ? item.quantity : item.quantityToBuy

          return {
            items: [
              ...state.items,
              {
                ...item,
                quantityToBuy,
                isBuying: true, // luôn set khi thêm mới
              },
            ],
          }
        })
      },
      remove: (item) =>
        set((state: CartStore) => ({
          items: state.items.filter((i) => i.id !== item.id),
        })),
      clear: () =>
        set((state: CartStore) => ({
          items: state.items.filter((i) => !i.isBuying),
        })),
      minus: (variantId) =>
        set((state: CartStore) => ({
          items: state.items.map((i) =>
            i.id === variantId && i.quantityToBuy > 1
              ? { ...i, quantityToBuy: i.quantityToBuy - 1 }
              : i,
          ),
        })),
      plus: (variantId) =>
        set((state: CartStore) => ({
          items: state.items.map((i) =>
            i.id === variantId && i.quantityToBuy < i.quantity
              ? { ...i, quantityToBuy: i.quantityToBuy + 1 }
              : i,
          ),
        })),
      setIsBuying: (variantId, isBuying) =>
        set((state: CartStore) => ({
          items: state.items.map((i) => (i.id === variantId ? { ...i, isBuying } : i)),
        })),
    }),
    {
      name: 'e-wardrobeCartStore', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
