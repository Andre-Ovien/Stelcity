// src/app/store/favStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleFav: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.slug === item.slug);
          if (existing) {
            return {
              items: state.items.filter((i) => i.slug !== item.slug),
            };
          } else {
            return {
              items: [
                ...state.items,
                {
                  ...item,
                  slug: item.slug,
                },
              ],
            };
          }
        }),

      // Only check by slug
      isFav: (slug) => get().items.some((i) => i.slug === slug),
    }),
    { name: "fav-storage" }
  )
);