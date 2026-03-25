import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuth: false,

      login: (user, token, refreshToken) => {
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
        set({ user, token, refreshToken, isAuth: true })
      },

      logout: () => {
        document.cookie = "token=; path=/; max-age=0"
        set({ user: null, token: null, refreshToken: null, isAuth: false })
      },

      
      softLogout: () => {
        document.cookie = "token=; path=/; max-age=0"
        set({ user: null, token: null, refreshToken: null, isAuth: false })
      },

      updateUser: (updatedUser) => set((state) => ({
        user: { ...state.user, ...updatedUser }
      })),
    }),
    { name: "auth-storage" }
  )
)