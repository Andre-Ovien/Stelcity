// src/app/store/favStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trackAddToWishlist } from "../lib/tiktok";

export const useFavStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleFav: (item) => {
        const existing = get().items.find((i) => i.slug === item.slug);
        if (!existing && item.type !== "service") {
          trackAddToWishlist(item);
        }

        set((state) => {
          const currentItem = state.items.find((i) => i.slug === item.slug);
          if (currentItem) {
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
        });
      },

      // Only check by slug
      isFav: (slug) => get().items.some((i) => i.slug === slug),
    }),
    { name: "fav-storage" }
  )
);
