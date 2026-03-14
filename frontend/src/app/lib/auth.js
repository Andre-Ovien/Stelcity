const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""


// const res = await fetch(`${BASE_URL}/api/auth/login`, {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ email, password })
// })
// const data = await res.json()
// return data  → { user: { id, name, email }, token: "..." }

export async function loginUser(email, password) {
  return {
    user: { id: 1, name: "Stella Stella", email },
    token: "fake-token-123",
  }
}

export async function registerUser(name, email, password) {
  return {
    user: { id: 1, name, email },
    token: "fake-token-123",
  }
}

export async function logoutUser() {
 
  return true
}