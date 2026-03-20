import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useFavStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleFav: (product) => {
        const existing = get().items.find((i) => i.id === product.id)
        if (existing) {
          set({ items: get().items.filter((i) => i.id !== product.id) })
        } else {
          set({ items: [...get().items, product] })
        }
      },

      isFav: (id) => get().items.some((i) => i.id === id),
    }),
    { name: "fav-storage" }
  )
)