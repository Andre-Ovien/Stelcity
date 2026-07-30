import { refreshAccessToken } from "./auth"
import { useAuthStore } from "../store/authStore"

let pendingRefresh = null

function withAccessToken(options, token) {
  const headers = new Headers(options.headers || {})
  headers.set("Authorization", `Bearer ${token}`)

  return {
    ...options,
    headers,
  }
}

async function renewAccessToken() {
  const { refreshToken } = useAuthStore.getState()
  if (!refreshToken) throw new Error("SESSION_EXPIRED")

  if (!pendingRefresh) {
    pendingRefresh = refreshAccessToken(refreshToken)
      .then(({ access, refresh }) => {
        useAuthStore.getState().updateTokens(access, refresh)
        return access
      })
      .finally(() => {
        pendingRefresh = null
      })
  }

  return pendingRefresh
}

export async function authenticatedFetch(url, options = {}, token) {
  const currentToken = token || useAuthStore.getState().token
  if (!currentToken) throw new Error("SESSION_EXPIRED")

  const response = await fetch(url, withAccessToken(options, currentToken))
  if (response.status !== 401) return response

  let renewedToken
  try {
    renewedToken = await renewAccessToken()
  } catch {
    throw new Error("SESSION_EXPIRED")
  }

  const retryResponse = await fetch(
    url,
    withAccessToken(options, renewedToken)
  )

  if (retryResponse.status === 401) {
    throw new Error("SESSION_EXPIRED")
  }

  return retryResponse
}
