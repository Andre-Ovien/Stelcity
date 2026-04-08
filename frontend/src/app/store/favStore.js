import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useFavStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleFav: (product) => {
        const existing = get().items.find((i) => i.slug === product.slug)
        if (existing) {
          set({ items: get().items.filter((i) => i.slug !== product.slug) })
        } else {
          set({ items: [...get().items, product] })
        }
      },

      isFav: (slug) => get().items.some((i) => i.slug === slug),
    }),
    { name: "fav-storage" }
  )
)