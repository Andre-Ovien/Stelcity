const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function registerUser(name, email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Registration failed")
  }

  return {
    user: data.user,         
    token: data.tokens.access,
    refreshToken: data.tokens.refresh,
  }
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Login failed")
  }

  return {
    user: data.user,
    token: data.tokens.access,
    refreshToken: data.tokens.refresh,
  }
}

export async function logoutUser() {
  
  return true
}

export async function refreshAccessToken(refreshToken) {
  const res = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error("Session expired")
  return data.access
}