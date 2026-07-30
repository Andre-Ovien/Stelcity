import { create } from "zustand"
import { persist } from "zustand/middleware"

const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

function writeTokenCookie(token) {
  if (typeof document === "undefined") return

  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `token=${token}; path=/; max-age=${SESSION_COOKIE_MAX_AGE}; SameSite=Lax${secure}`
}

function clearTokenCookie() {
  if (typeof document === "undefined") return
  document.cookie = "token=; path=/; max-age=0; SameSite=Lax"
}

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuth: false,

      login: (user, token, refreshToken) => {
        writeTokenCookie(token)
        set({ user, token, refreshToken, isAuth: true })
      },

      updateTokens: (token, refreshToken) => {
        writeTokenCookie(token)
        set((state) => ({
          token,
          refreshToken: refreshToken || state.refreshToken,
          isAuth: true,
        }))
      },

      logout: () => {
        clearTokenCookie()
        set({ user: null, token: null, refreshToken: null, isAuth: false })
      },

      softLogout: () => {
        clearTokenCookie()
        set({ user: null, token: null, refreshToken: null, isAuth: false })
      },

      updateUser: (updatedUser) => set((state) => ({
        user: { ...state.user, ...updatedUser }
      })),
    }),
    { name: "auth-storage" }
  )
)
